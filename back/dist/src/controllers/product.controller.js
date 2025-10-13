"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductController = void 0;
const product_service_1 = __importDefault(require("../services/product.service"));
const client_1 = require("@prisma/client");
const cloudinary_util_1 = __importDefault(require("../utils/cloudinary.util"));
class ProductController {
    // Créer un produit (vendeur authentifié)
    async createProduct(req, res) {
        try {
            console.log('=== CREATE PRODUCT REQUEST ===');
            console.log('Body:', req.body);
            console.log('Files:', req.files);
            console.log('User:', req.user);
            const { title, description } = req.body;
            const userId = req.user?.id;
            console.log('Extracted data:', { title, description, userId });
            // Validation
            if (!title || !description) {
                return res.status(400).json({ error: 'Title and description are required' });
            }
            if (!userId) {
                return res.status(401).json({ error: 'Authentication required' });
            }
            // Vérifier que des photos ont été uploadées
            const files = req.files;
            if (!files || files.length === 0) {
                return res.status(400).json({ error: 'At least one photo is required' });
            }
            if (files.length > 5) {
                return res.status(400).json({ error: 'Maximum 5 photos allowed' });
            }
            // Upload des photos vers Cloudinary
            const uploadedPhotos = await cloudinary_util_1.default.uploadMultipleImages(files);
            const product = await product_service_1.default.createProduct({
                title,
                description,
                sellerId: userId,
                photos: uploadedPhotos,
            });
            res.status(201).json({
                message: 'Product submitted successfully. It will be reviewed by our team.',
                product,
            });
        }
        catch (error) {
            console.error('Error creating product:', error);
            res.status(500).json({ error: error.message || 'Internal server error' });
        }
    }
    // Récupérer tous les produits (public)
    async getProducts(req, res) {
        try {
            const { status, search, page, limit } = req.query;
            const filters = {
                status: status,
                search: search,
                page: page ? parseInt(page) : undefined,
                limit: limit ? parseInt(limit) : undefined,
            };
            // Par défaut, ne montrer que les produits approuvés pour le public
            if (!filters.status) {
                filters.status = client_1.ProductStatus.APPROVED;
            }
            const result = await product_service_1.default.getProducts(filters);
            res.json(result);
        }
        catch (error) {
            console.error('Error fetching products:', error);
            res.status(500).json({ error: error.message || 'Internal server error' });
        }
    }
    // Récupérer les produits d'un vendeur par email
    async getSellerProducts(req, res) {
        try {
            const { email } = req.params;
            const { status, search, page, limit } = req.query;
            const filters = {
                sellerEmail: email,
                status: status,
                search: search,
                page: page ? parseInt(page) : undefined,
                limit: limit ? parseInt(limit) : undefined,
            };
            const result = await product_service_1.default.getProducts(filters);
            res.json(result);
        }
        catch (error) {
            console.error('Error fetching seller products:', error);
            res.status(500).json({ error: error.message || 'Internal server error' });
        }
    }
    // Récupérer un produit par ID
    async getProductById(req, res) {
        try {
            const { id } = req.params;
            const product = await product_service_1.default.getProductById(id);
            res.json(product);
        }
        catch (error) {
            console.error('Error fetching product:', error);
            if (error.message === 'Product not found') {
                return res.status(404).json({ error: error.message });
            }
            res.status(500).json({ error: error.message || 'Internal server error' });
        }
    }
    // Supprimer un produit (admin/modérateur uniquement)
    async deleteProduct(req, res) {
        try {
            const { id } = req.params;
            const result = await product_service_1.default.deleteProduct(id);
            res.json(result);
        }
        catch (error) {
            console.error('Error deleting product:', error);
            if (error.message === 'Product not found') {
                return res.status(404).json({ error: error.message });
            }
            res.status(500).json({ error: error.message || 'Internal server error' });
        }
    }
    // Modération: Récupérer les produits en attente
    async getPendingProducts(req, res) {
        try {
            const { page, limit } = req.query;
            const result = await product_service_1.default.getPendingProducts(page ? parseInt(page) : undefined, limit ? parseInt(limit) : undefined);
            res.json(result);
        }
        catch (error) {
            console.error('Error fetching pending products:', error);
            res.status(500).json({ error: error.message || 'Internal server error' });
        }
    }
    // Modération: Approuver un produit
    async approveProduct(req, res) {
        try {
            const { id } = req.params;
            const product = await product_service_1.default.approveProduct(id);
            res.json(product);
        }
        catch (error) {
            console.error('Error approving product:', error);
            if (error.message === 'Product not found') {
                return res.status(404).json({ error: error.message });
            }
            res.status(500).json({ error: error.message || 'Internal server error' });
        }
    }
    // Modération: Rejeter un produit
    async rejectProduct(req, res) {
        try {
            const { id } = req.params;
            const { reason } = req.body;
            const product = await product_service_1.default.rejectProduct(id, reason);
            res.json(product);
        }
        catch (error) {
            console.error('Error rejecting product:', error);
            if (error.message === 'Product not found') {
                return res.status(404).json({ error: error.message });
            }
            res.status(500).json({ error: error.message || 'Internal server error' });
        }
    }
}
exports.ProductController = ProductController;
exports.default = new ProductController();
//# sourceMappingURL=product.controller.js.map