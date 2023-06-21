const express = require("express")
const category_router = express.Router()
const category = require("../controllers/categoryController")
const {  authenticateTokenAdmin} = require('../jwt/jwtAutenticate');





    
    category_router.get('/all', category.allCategories);
    category_router.get('/:id', category.getCategory);
    category_router.post('/create',authenticateTokenAdmin, category.createCategory);
    category_router.put('/update/:id',authenticateTokenAdmin, category.updateCategory);
    category_router.delete('/delete/:id',authenticateTokenAdmin, category.deleteCategory);


module.exports = category_router
