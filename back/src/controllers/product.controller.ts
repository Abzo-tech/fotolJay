import { Request, Response } from 'express';
import productService from '../services/product.service';
import { ProductStatus } from '@prisma/client';
import CloudinaryUtil from '../utils/cloudinary.util';

export class ProductController {
  // Créer un produit (vendeur authentifié)
  async createProduct(req: Request, res: Response) {
    try {
      console.log('=== CREATE PRODUCT REQUEST ===');
      console.log('Body:', req.body);
      console.log('Files:', req.files);
      console.log('User:', (req as any).user);

      const { title, description } = req.body;
      const userId = (req as any).user?.id;

      console.log('Extracted data:', { title, description, userId });

      // Validation
      if (!title || !description) {
        return res.status(400).json({ error: 'Title and description are required' });
      }

      if (!userId) {
        return res.status(401).json({ error: 'Authentication required' });
      }

      // Vérifier que des photos ont été uploadées
      const files = req.files as Express.Multer.File[];
      if (!files || files.length === 0) {
        return res.status(400).json({ error: 'At least one photo is required' });
      }

      if (files.length > 5) {
        return res.status(400).json({ error: 'Maximum 5 photos allowed' });
      }

      // Upload des photos vers Cloudinary
      const uploadedPhotos = await CloudinaryUtil.uploadMultipleImages(files);

      const product = await productService.createProduct({
        title,
        description,
        sellerId: userId,
        photos: uploadedPhotos,
      });

      res.status(201).json({
        message: 'Product submitted successfully. It will be reviewed by our team.',
        product,
      });
    } catch (error: any) {
      console.error('Error creating product:', error);
      res.status(500).json({ error: error.message || 'Internal server error' });
    }
  }

  // Récupérer tous les produits (public)
  async getProducts(req: Request, res: Response) {
    try {
      const { status, search, page, limit } = req.query;

      const filters: any = {
        status: status as ProductStatus | undefined,
        search: search as string | undefined,
        page: page ? parseInt(page as string) : undefined,
        limit: limit ? parseInt(limit as string) : undefined,
      };

      // Par défaut, ne montrer que les produits approuvés pour le public
      if (!filters.status) {
        filters.status = ProductStatus.APPROVED;
      }

      const result = await productService.getProducts(filters);
      res.json(result);
    } catch (error: any) {
      console.error('Error fetching products:', error);
      res.status(500).json({ error: error.message || 'Internal server error' });
    }
  }

  // Récupérer les produits du vendeur actuellement connecté
  async getCurrentSellerProducts(req: Request, res: Response) {
    try {
      const userId = (req as any).user?.id;

      if (!userId) {
        return res.status(401).json({ error: 'Authentication required' });
      }

      const { status, search, page, limit } = req.query;

      const filters: any = {
        sellerId: userId,
        status: status as ProductStatus | undefined,
        search: search as string | undefined,
        page: page ? parseInt(page as string) : undefined,
        limit: limit ? parseInt(limit as string) : undefined,
      };

      const result = await productService.getProducts(filters);
      res.json(result);
    } catch (error: any) {
      console.error('Error fetching current seller products:', error);
      res.status(500).json({ error: error.message || 'Internal server error' });
    }
  }

  // Récupérer un produit par ID
  async getProductById(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const product = await productService.getProductById(id);
      res.json(product);
    } catch (error: any) {
      console.error('Error fetching product:', error);
      if (error.message === 'Product not found') {
        return res.status(404).json({ error: error.message });
      }
      res.status(500).json({ error: error.message || 'Internal server error' });
    }
  }

  // Supprimer un produit (admin/modérateur uniquement)
  async deleteProduct(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const result = await productService.deleteProduct(id);
      res.json(result);
    } catch (error: any) {
      console.error('Error deleting product:', error);
      if (error.message === 'Product not found') {
        return res.status(404).json({ error: error.message });
      }
      res.status(500).json({ error: error.message || 'Internal server error' });
    }
  }

  // Modération: Récupérer les produits en attente
  async getPendingProducts(req: Request, res: Response) {
    try {
      const { page, limit } = req.query;

      const result = await productService.getPendingProducts(
        page ? parseInt(page as string) : undefined,
        limit ? parseInt(limit as string) : undefined
      );

      res.json(result);
    } catch (error: any) {
      console.error('Error fetching pending products:', error);
      res.status(500).json({ error: error.message || 'Internal server error' });
    }
  }

  // Modération: Approuver un produit
  async approveProduct(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const product = await productService.approveProduct(id);
      res.json(product);
    } catch (error: any) {
      console.error('Error approving product:', error);
      if (error.message === 'Product not found') {
        return res.status(404).json({ error: error.message });
      }
      res.status(500).json({ error: error.message || 'Internal server error' });
    }
  }

  // Modération: Rejeter un produit
  async rejectProduct(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { reason } = req.body;

      const product = await productService.rejectProduct(id, reason);
      res.json(product);
    } catch (error: any) {
      console.error('Error rejecting product:', error);
      if (error.message === 'Product not found') {
        return res.status(404).json({ error: error.message });
      }
      res.status(500).json({ error: error.message || 'Internal server error' });
    }
  }
}

export default new ProductController();
