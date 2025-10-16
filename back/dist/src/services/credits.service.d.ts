export declare class CreditsService {
    getBalance(userId: string): Promise<number>;
    deductCredits(userId: string, amount: number, reason: string, productId?: string): Promise<void>;
    addCredits(userId: string, amount: number, source: string, description?: string): Promise<void>;
    private createTransaction;
    getTransactions(userId: string, page?: number, limit?: number): Promise<{
        transactions: any[];
        pagination: {
            total: number;
            page: number;
            limit: number;
            totalPages: number;
        };
    }>;
}
declare const _default: CreditsService;
export default _default;
//# sourceMappingURL=credits.service.d.ts.map