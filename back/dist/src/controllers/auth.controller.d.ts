import { Request, Response } from 'express';
export declare class AuthController {
    static register(req: Request, res: Response): Promise<void>;
    static registerAdmin(req: Request, res: Response): Promise<void>;
    static login(req: Request, res: Response): Promise<void>;
    static logout(req: Request, res: Response): Promise<void>;
    static getCurrentUser(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
    static changePassword(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
    static initialChangePassword(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
    static completeFirstLogin(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
}
export declare const authValidation: {
    register: import("express-validator").ValidationChain[];
    login: import("express-validator").ValidationChain[];
    changePassword: import("express-validator").ValidationChain[];
    initialChangePassword: import("express-validator").ValidationChain[];
    completeFirstLogin: import("express-validator").ValidationChain[];
};
//# sourceMappingURL=auth.controller.d.ts.map