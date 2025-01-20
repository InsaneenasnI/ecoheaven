const Product = require('../models/product');

// Získat všechny produkty
exports.getProducts = async (req, res) => {
    try {
        const products = await Product.find();
        res.json(products);
    } catch (error) {
        res.status(500).json({ message: 'Chyba při načítání produktů', error: error.message });
    }
};

// Získat jeden produkt podle ID
exports.getProductById = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) {
            return res.status(404).json({ message: 'Produkt nenalezen' });
        }
        res.json(product);
    } catch (error) {
        res.status(500).json({ message: 'Chyba při načítání produktu', error: error.message });
    }
};

// Vytvořit nový produkt
exports.createProduct = async (req, res) => {
    try {
        const product = new Product(req.body);
        await product.save();
        res.status(201).json(product);
    } catch (error) {
        res.status(400).json({ message: 'Chyba při vytváření produktu', error: error.message });
    }
};

// Aktualizovat produkt
exports.updateProduct = async (req, res) => {
    try {
        const product = await Product.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );
        if (!product) {
            return res.status(404).json({ message: 'Produkt nenalezen' });
        }
        res.json(product);
    } catch (error) {
        res.status(400).json({ message: 'Chyba při aktualizaci produktu', error: error.message });
    }
};

// Smazat produkt
exports.deleteProduct = async (req, res) => {
    try {
        const product = await Product.findByIdAndDelete(req.params.id);
        if (!product) {
            return res.status(404).json({ message: 'Produkt nenalezen' });
        }
        res.json({ message: 'Produkt byl úspěšně smazán' });
    } catch (error) {
        res.status(500).json({ message: 'Chyba při mazání produktu', error: error.message });
    }
};

// Update command pro produkt
exports.updateProductCommand = async (req, res) => {
    try {
        const { productId, updates } = req.body;

        if (!productId || !updates) {
            return res.status(400).json({
                message: 'Chybí ID produktu nebo data pro aktualizaci'
            });
        }

        const product = await Product.findByIdAndUpdate(
            productId,
            updates,
            { new: true, runValidators: true }
        );

        if (!product) {
            return res.status(404).json({ message: 'Produkt nenalezen' });
        }

        res.json({
            message: 'Produkt byl úspěšně aktualizován',
            product: product
        });
    } catch (error) {
        res.status(400).json({
            message: 'Chyba při aktualizaci produktu',
            error: error.message
        });
    }
};

// Delete command pro produkt
exports.deleteProductCommand = async (req, res) => {
    try {
        const { productId } = req.body;

        if (!productId) {
            return res.status(400).json({
                message: 'Chybí ID produktu pro smazání'
            });
        }

        const product = await Product.findByIdAndDelete(productId);

        if (!product) {
            return res.status(404).json({
                message: 'Produkt nenalezen'
            });
        }

        res.json({
            message: 'Produkt byl úspěšně smazán',
            deletedProduct: product
        });
    } catch (error) {
        res.status(400).json({
            message: 'Chyba při mazání produktu',
            error: error.message
        });
    }
}; 