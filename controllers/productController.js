const {Product, Category, Image} = require('../models')



function show_all_products(req,res){
    Product.findAll({
        include:Category
    })
    .then((prod)=>{
        res.json(prod)}).catch((err)=>{
            res.status(500).json({eror:err.message})
        })
}

function show_one_product(req,res){
    const {id} = req.params
    Product.findOne({
        where:{id},
        include:Category
    })
    .then((prod)=>{
        res.json(prod)}).catch((err)=>{
            res.status(500).json({eror:err.message})
        })
}

async function update_product(req,res){
    const { id } = req.params;
  const { name, price, description, quantity, categoryId } = req.body;
  const { files } = req; // Assuming you're using Multer for file upload

  try {
    const images = await Image.findAll({ where: { productId: id } });

    for (const image of images) {
      const filePath = path.join(
        __dirname,
        "..",
        "static",
        "images",
        image.fileName
      );
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    }

    await Image.destroy({ where: { productId: id } });

    if (files) {
      console.log("New File:", files);

      // Create a new image record
      const imgs = files.map((file) => {
        return {
          productId: id,
          fileName: file.filename,
        };
      });
      // const newImage = await Image.create({ productId: id, fileName: files[0].filename });
      const newImage = await Image.bulkCreate(imgs);

      console.log("New Image:", newImage);

      // Associate the new image with the product
      const product = await Product.findByPk(id);
      await product.addImage(newImage);
    }

    // Update the product data
    await Product.update(
      { name, price, description, quantity, categoryId },
      { where: { id } }
    );

    // Fetch the updated product from the database
    const updatedProduct = await Product.findByPk(id);

    console.log("Updated Product:", updatedProduct.toJSON());

    res.status(200).json({ message: "Product updated successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Something went wrong!" });
  }
}

async function create_product(req,res){
  
    const { name, price, description, quantity, categoryId } = req.body;
    try {
      const newProduct = await Product.create({
        name,
        price,
        description,
        quantity,
        categoryId
        
      });
      const images = req.files.map((file)=> { 
        return {
            fileName: file.filename,
            productId: newProduct.id
        }
    });
    await Image.bulkCreate(images);
      res.status(201).json(newProduct);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
}

async function delete_product (req, res) {
    const { id } = req.params;
  try {
    const images = await Image.findAll({ where: { productId: id } });

    for (const image of images) {
      const filePath = path.join(
        __dirname,
        "..",
        "static",
        "images",
        image.fileName
      );
      fs.unlinkSync(filePath);
    }

    await Image.destroy({ where: { productId: id } });
    await Product.destroy({ where: { id } });

    res
      .status(200)
      .json({ message: "Product and associated images deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Something went wrong!" });
  }
            
}





module.exports = {
    show_all_products, show_one_product, update_product, create_product, delete_product
}