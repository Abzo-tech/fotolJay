import { Request, Response } from 'express';
export declare class UserController {
    getAllUsers(req: Request, res: Response): Promise<void>;
    getUserById(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
    updateVipStatus(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
    updateUserRole(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
    updateUserStatus(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
}
declare const _default: UserController;
export default _default;
//# sourceMappingURL=user.controller.d.ts.map