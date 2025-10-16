import { Request, Response } from 'express';
import CreditsService from '../services/credits.service';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-04-10',
});

export class CreditsController {
  // Récupérer le solde de crédits
  async getBalance(req: Request, res: Response) {
    try {
      const userId = req.user!.id;
      const balance = await CreditsService.getBalance(userId);
      res.json({ balance });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  // Acheter des crédits (wallet mock)
  async buyCredits(req: Request, res: Response) {
    try {
      const userId = req.user!.id;
      const { package: packageAmount } = req.body;

      let amount = 0;
      switch (packageAmount) {
        case '10':
          amount = 10;
          break;
        case '15':
          amount = 15;
          break;
        case '25':
          amount = 25;
          break;
        default:
          return res.status(400).json({ error: 'Invalid package' });
      }

      await CreditsService.addCredits(userId, amount, 'wallet', `Achat de ${amount} crédits (mode test)`);
      const balance = await CreditsService.getBalance(userId);

      res.json({
        message: 'Credits purchased successfully in test mode',
        credits: balance
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  // Récupérer l'historique des transactions
  async getTransactions(req: Request, res: Response) {
    try {
      const userId = req.user!.id;
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 20;

      const result = await CreditsService.getTransactions(userId, page, limit);
      res.json(result);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  // Préparation pour paiement opérateur (mock pour l'instant)
  async payWithOperator(req: Request, res: Response) {
    try {
      const userId = req.user!.id;
      const { phone, amount, operator } = req.body;

      if (!phone || !amount || !operator) {
        return res.status(400).json({ error: 'Phone, amount, and operator are required' });
      }

      if (amount <= 0) {
        return res.status(400).json({ error: 'Amount must be positive' });
      }

      // TODO: Intégrer API opérateur (Orange Money, Wave, etc.)
      // Pour l'instant, simuler un paiement réussi
      await CreditsService.addCredits(userId, amount, `operator-${operator}`);

      res.json({
        message: 'Payment processed successfully (mock)',
        credits: await CreditsService.getBalance(userId)
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  // Webhook Stripe (pour les paiements réels)
  async stripeWebhook(req: Request, res: Response) {
    const sig = req.headers['stripe-signature'] as string;

    let event;

    try {
      event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET!);
    } catch (err: any) {
      console.log(`Webhook signature verification failed.`, err.message);
      return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    // Handle the event
    switch (event.type) {
      case 'payment_intent.succeeded':
        const paymentIntent = event.data.object as Stripe.PaymentIntent;
        // TODO: Ajouter les crédits basés sur le montant payé
        // Ex: const amount = paymentIntent.amount / 100; // Convertir cents en unités
        // await CreditsService.addCredits(userId, amount, 'stripe');
        console.log('Payment succeeded:', paymentIntent.id);
        break;
      case 'payment_method.attached':
        const paymentMethod = event.data.object as Stripe.PaymentMethod;
        console.log('PaymentMethod was attached to a Customer:', paymentMethod.id);
        break;
      // ... handle other event types
      default:
        console.log(`Unhandled event type ${event.type}`);
    }

    // Return a 200 response to acknowledge receipt of the event
    res.json({ received: true });
  }

  // Webhook PayTech (mock pour l'instant)
  async paytechWebhook(req: Request, res: Response) {
    // TODO: Implémenter la vérification de signature PayTech
    console.log('PayTech webhook received:', req.body);

    // Simuler le traitement du paiement
    const { transactionId, amount, status, userId } = req.body;

    if (status === 'SUCCESS' && userId && amount) {
      // Ajouter les crédits
      await CreditsService.addCredits(userId, parseInt(amount), 'paytech');
      console.log(`Credits added via PayTech: ${amount} for user ${userId}`);
    }

    res.json({ received: true, status: 'processed' });
  }
}

export default new CreditsController();
