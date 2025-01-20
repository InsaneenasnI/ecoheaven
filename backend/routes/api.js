const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');
const userController = require('../controllers/userController');
const ecoController = require('../controllers/ecoController');

// Testovací route
router.get('/test', (req, res) => {
    res.json({ message: 'API je funkční!' });
});

// Produktové routy
router.get('/products', productController.getProducts);
router.get('/products/:id', productController.getProductById);
router.post('/products', productController.createProduct);
router.put('/products/:id', productController.updateProduct);
router.delete('/products/:id', productController.deleteProduct);

// Přidáme novou route pro update command
router.post('/products/update', productController.updateProductCommand);

// Přidáme novou route pro delete command
router.post('/products/delete', productController.deleteProductCommand);

// Uživatelské routy
router.post('/users/register', userController.register);
router.post('/users/profile', userController.updateProfile);
router.post('/users/login', userController.login);

// Eko routy
router.post('/eco/score', ecoController.updateEcoScore);
router.post('/eco/recommendations', ecoController.getRecommendations);

module.exports = router; 