
const {Category} =  require ("../models")


async function allCategories(req, res) {
    try {
      const categories = await Category.findAll();
      res.status(201).json(categories);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  }
  
  function getCategory(req, res) {
    const { id } = req.params;
    try{
      const category = Category.findOne({ where: { id } });
      res.status(201).json(category);
    }catch(err){
      res.status(500).json({ message: err.message });
    }
  }

  async function createCategory(req, res) {
    const { name } = req.body;
    try{
      const category = await Category.create({ name });
      res.status(201).json(category);
    }catch(err){
      res.status(500).json({ message: err.message });
    }
  }

  
  async function updateCategory(req, res) {
    const { id } = req.params;
    const { name } = req.body;
    try{
      const category = await Category.update({ name }, { where: { id } });
      res.status(201).json(category);
    }catch(err){
      res.status(500).json({ message: err.message });
    }
  }

  async function deleteCategory(req, res) {
    const { id } = req.params;
    try{
      const category = await Category.destroy({ where: { id } });
      res.status(201).json(category);
    }catch(err){
      res.status(500).json({ message: err.message });
    }
  }

  module.exports = {
    allCategories,
    getCategory,
    createCategory,
    updateCategory,
    deleteCategory,
  };