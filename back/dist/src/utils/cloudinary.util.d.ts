export declare class CloudinaryUtil {
    /**
     * Upload une image vers Cloudinary depuis un buffer
     */
    static uploadImage(fileBuffer: Buffer, folder?: string): Promise<{
        url: string;
        publicId: string;
    }>;
    /**
     * Upload plusieurs images
     */
    static uploadMultipleImages(files: Express.Multer.File[], folder?: string): Promise<{
        url: string;
        publicId: string;
    }[]>;
    /**
     * Supprimer une image de Cloudinary
     */
    static deleteImage(publicId: string): Promise<void>;
    /**
     * Supprimer plusieurs images
     */
    static deleteMultipleImages(publicIds: string[]): Promise<void>;
    /**
     * Obtenir les détails d'une image
     */
    static getImageDetails(publicId: string): Promise<any>;
}
export default CloudinaryUtil;
//# sourceMappingURL=cloudinary.util.d.ts.map