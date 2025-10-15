import { Request, Response } from 'express';
export declare class ProductController {
    createProduct(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
    getProducts(req: Request, res: Response): Promise<void>;
    getCurrentSellerProducts(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
    getProductById(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
    deleteProduct(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
    getPendingProducts(req: Request, res: Response): Promise<void>;
    approveProduct(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
    rejectProduct(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
}
declare const _default: ProductController;
export default _default;
//# sourceMappingURL=product.controller.d.ts.map