"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CloudinaryUtil = void 0;
const cloudinary_1 = require("cloudinary");
const stream_1 = require("stream");
// Configuration Cloudinary
cloudinary_1.v2.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});
class CloudinaryUtil {
    /**
     * Upload une image vers Cloudinary depuis un buffer
     */
    static async uploadImage(fileBuffer, folder = 'fotoljay/products') {
        return new Promise((resolve, reject) => {
            const uploadStream = cloudinary_1.v2.uploader.upload_stream({
                folder,
                resource_type: 'image',
                transformation: [
                    { width: 1200, height: 1200, crop: 'limit' }, // Limiter la taille
                    { quality: 'auto' }, // Optimisation automatique
                    { fetch_format: 'auto' }, // Format optimal (WebP si supporté)
                ],
            }, (error, result) => {
                if (error) {
                    reject(error);
                }
                else if (result) {
                    resolve({
                        url: result.secure_url,
                        publicId: result.public_id,
                    });
                }
            });
            // Convertir le buffer en stream et uploader
            const readableStream = new stream_1.Readable();
            readableStream.push(fileBuffer);
            readableStream.push(null);
            readableStream.pipe(uploadStream);
        });
    }
    /**
     * Upload plusieurs images
     */
    static async uploadMultipleImages(files, folder = 'fotoljay/products') {
        const uploadPromises = files.map((file) => this.uploadImage(file.buffer, folder));
        return Promise.all(uploadPromises);
    }
    /**
     * Supprimer une image de Cloudinary
     */
    static async deleteImage(publicId) {
        try {
            await cloudinary_1.v2.uploader.destroy(publicId);
        }
        catch (error) {
            console.error('Error deleting image from Cloudinary:', error);
            throw error;
        }
    }
    /**
     * Supprimer plusieurs images
     */
    static async deleteMultipleImages(publicIds) {
        try {
            await cloudinary_1.v2.api.delete_resources(publicIds);
        }
        catch (error) {
            console.error('Error deleting images from Cloudinary:', error);
            throw error;
        }
    }
    /**
     * Obtenir les détails d'une image
     */
    static async getImageDetails(publicId) {
        try {
            return await cloudinary_1.v2.api.resource(publicId);
        }
        catch (error) {
            console.error('Error getting image details:', error);
            throw error;
        }
    }
}
exports.CloudinaryUtil = CloudinaryUtil;
exports.default = CloudinaryUtil;
//# sourceMappingURL=cloudinary.util.js.map