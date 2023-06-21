
const express = require('express');
const prodRouter = express.Router();

const product  = require('../controllers/productController');
const {  authenticateTokenAdmin} = require('../jwt/jwtAutenticate');
const { upload } = require('../multer/multer');


prodRouter.get('/all', product.show_all_products )
prodRouter.get('/:id', product.show_one_product )
prodRouter.put('/update/:id',authenticateTokenAdmin, product.update_product )
prodRouter.post('/create',upload.array("image"), product.create_product )
prodRouter.delete('/delete/:id',authenticateTokenAdmin, product.delete_product )

module.exports = prodRouter

