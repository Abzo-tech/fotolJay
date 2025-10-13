import { Request, Response } from 'express';
export declare class SellerController {
    register(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
    login(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
    getProfile(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
    getMyProducts(req: Request, res: Response): Promise<void>;
}
//# sourceMappingURL=seller.controller.d.ts.map