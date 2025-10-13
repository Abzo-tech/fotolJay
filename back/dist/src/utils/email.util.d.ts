declare class EmailService {
    private transporter;
    constructor();
    private initializeTransporter;
    sendProductSubmittedEmail(data: {
        sellerName: string;
        sellerEmail: string;
        productTitle: string;
    }): Promise<void>;
    sendProductApprovedEmail(data: {
        sellerName: string;
        sellerEmail: string;
        productTitle: string;
    }): Promise<void>;
    sendProductRejectedEmail(data: {
        sellerName: string;
        sellerEmail: string;
        productTitle: string;
        reason?: string;
    }): Promise<void>;
    sendProductExpiringEmail(data: {
        sellerName: string;
        sellerEmail: string;
        productTitle: string;
    }): Promise<void>;
}
declare const _default: EmailService;
export default _default;
//# sourceMappingURL=email.util.d.ts.map