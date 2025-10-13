import { v2 as cloudinary } from 'cloudinary';
import { Readable } from 'stream';

// Configuration Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export class CloudinaryUtil {
  /**
   * Upload une image vers Cloudinary depuis un buffer
   */
  static async uploadImage(
    fileBuffer: Buffer,
    folder: string = 'fotoljay/products'
  ): Promise<{ url: string; publicId: string }> {
    return new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder,
          resource_type: 'image',
          transformation: [
            { width: 1200, height: 1200, crop: 'limit' }, // Limiter la taille
            { quality: 'auto' }, // Optimisation automatique
            { fetch_format: 'auto' }, // Format optimal (WebP si supporté)
          ],
        },
        (error, result) => {
          if (error) {
            reject(error);
          } else if (result) {
            resolve({
              url: result.secure_url,
              publicId: result.public_id,
            });
          }
        }
      );

      // Convertir le buffer en stream et uploader
      const readableStream = new Readable();
      readableStream.push(fileBuffer);
      readableStream.push(null);
      readableStream.pipe(uploadStream);
    });
  }

  /**
   * Upload plusieurs images
   */
  static async uploadMultipleImages(
    files: Express.Multer.File[],
    folder: string = 'fotoljay/products'
  ): Promise<{ url: string; publicId: string }[]> {
    const uploadPromises = files.map((file) =>
      this.uploadImage(file.buffer, folder)
    );
    return Promise.all(uploadPromises);
  }

  /**
   * Supprimer une image de Cloudinary
   */
  static async deleteImage(publicId: string): Promise<void> {
    try {
      await cloudinary.uploader.destroy(publicId);
    } catch (error) {
      console.error('Error deleting image from Cloudinary:', error);
      throw error;
    }
  }

  /**
   * Supprimer plusieurs images
   */
  static async deleteMultipleImages(publicIds: string[]): Promise<void> {
    try {
      await cloudinary.api.delete_resources(publicIds);
    } catch (error) {
      console.error('Error deleting images from Cloudinary:', error);
      throw error;
    }
  }

  /**
   * Obtenir les détails d'une image
   */
  static async getImageDetails(publicId: string) {
    try {
      return await cloudinary.api.resource(publicId);
    } catch (error) {
      console.error('Error getting image details:', error);
      throw error;
    }
  }
}

export default CloudinaryUtil;
