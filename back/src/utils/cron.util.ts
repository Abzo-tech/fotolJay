import cron from 'node-cron';
import productService from '../services/product.service';

export class CronService {
  // Initialiser les tâches cron
  static init() {
    // Exécuter tous les jours à minuit pour marquer les produits expirés
    cron.schedule('0 0 * * *', async () => {
      console.log('Running cron job: Expiring old products...');
      try {
        const result = await productService.expireOldProducts();
        console.log(`Cron job completed: ${result.expired} products expired`);
      } catch (error) {
        console.error('Error in cron job (expiring products):', error);
      }
    });

    // Exécuter tous les jours à 10h pour notifier les produits qui vont expirer
    cron.schedule('0 10 * * *', async () => {
      console.log('Running cron job: Notifying expiring products...');
      try {
        const result = await productService.notifyExpiringProducts();
        console.log(`Cron job completed: ${result.notified} users notified`);
      } catch (error) {
        console.error('Error in cron job (notifying expiring products):', error);
      }
    });

    console.log('Cron jobs initialized');
  }
}
