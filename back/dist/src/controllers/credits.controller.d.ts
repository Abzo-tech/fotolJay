import { Request, Response } from 'express';
export declare class CreditsController {
    getBalance(req: Request, res: Response): Promise<void>;
    buyCredits(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
    getTransactions(req: Request, res: Response): Promise<void>;
    payWithOperator(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
    stripeWebhook(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
    paytechWebhook(req: Request, res: Response): Promise<void>;
}
declare const _default: CreditsController;
export default _default;
//# sourceMappingURL=credits.controller.d.ts.map