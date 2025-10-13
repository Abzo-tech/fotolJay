"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CronService = void 0;
const node_cron_1 = __importDefault(require("node-cron"));
const product_service_1 = __importDefault(require("../services/product.service"));
class CronService {
    // Initialiser les tâches cron
    static init() {
        // Exécuter tous les jours à minuit pour marquer les produits expirés
        node_cron_1.default.schedule('0 0 * * *', async () => {
            console.log('Running cron job: Expiring old products...');
            try {
                const result = await product_service_1.default.expireOldProducts();
                console.log(`Cron job completed: ${result.expired} products expired`);
            }
            catch (error) {
                console.error('Error in cron job (expiring products):', error);
            }
        });
        // Exécuter tous les jours à 10h pour notifier les produits qui vont expirer
        node_cron_1.default.schedule('0 10 * * *', async () => {
            console.log('Running cron job: Notifying expiring products...');
            try {
                const result = await product_service_1.default.notifyExpiringProducts();
                console.log(`Cron job completed: ${result.notified} users notified`);
            }
            catch (error) {
                console.error('Error in cron job (notifying expiring products):', error);
            }
        });
        console.log('Cron jobs initialized');
    }
}
exports.CronService = CronService;
//# sourceMappingURL=cron.util.js.map