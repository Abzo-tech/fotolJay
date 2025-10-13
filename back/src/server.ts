import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import path from 'path';

import authRoutes from './routes/auth.routes';
import productRoutes from './routes/product.routes';
import notificationRoutes from './routes/notification.routes';
import userRoutes from './routes/user.routes';
import sellerRoutes from './routes/seller.routes';
import { CronService } from './utils/cron.util';

dotenv.config();

console.log('Server starting...');
console.log('After dotenv config');
console.log('Before app setup');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(helmet());
app.use(cors({
  origin: (origin, callback) => {
    // Autoriser les requêtes sans origine (comme les apps mobiles)
    if (!origin) return callback(null, true);

    // Liste des origines autorisées
    const allowedOrigins = [
      "http://localhost:4200",      // Angular dev server (port par défaut)
      "http://localhost:5173",      // Vite dev server
      "http://localhost:5174",      // Vite dev server
      "http://localhost:5176",      // Vite dev server
      "http://localhost:5177",      // Vite dev server
      "http://127.0.0.1:4200",     // Angular avec IP locale
      "http://127.0.0.1:5173",     // Vite avec IP locale
      /^http:\/\/localhost:\d+$/,   // Tous les ports localhost
      /^http:\/\/127\.0\.0\.1:\d+$/ // Tous les ports 127.0.0.1
    ];

    // Vérifier si l'origine correspond à une des origines autorisées
    const isAllowed = allowedOrigins.some(pattern => {
      if (typeof pattern === 'string') {
        return pattern === origin;
      } else {
        return pattern.test(origin);
      }
    });

    if (isAllowed) {
      callback(null, true);
    } else {
      console.log('CORS blocked origin:', origin);
      callback(new Error('Not allowed by CORS'));
    }
  },
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"],
  credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Servir les fichiers statiques (uploads)
app.use('/uploads', express.static(path.join(__dirname, '../public/uploads')));

// Routes API
app.use('/api/auth', authRoutes);
app.use('/api/sellers', sellerRoutes);
app.use('/api/products', productRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/users', userRoutes);

console.log('API routes configured');

// Initialiser les tâches cron
CronService.init();

app.get('/health', (req: express.Request, res: express.Response) => {
  console.log('Health check requested');
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('Erreur serveur:', err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

app.use('*', (req: express.Request, res: express.Response) => {
  console.log('Route non trouvée:', req.originalUrl);
  res.status(404).json({ error: 'Route not found' });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

export default app;