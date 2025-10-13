"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const dotenv_1 = __importDefault(require("dotenv"));
const path_1 = __importDefault(require("path"));
const auth_routes_1 = __importDefault(require("./routes/auth.routes"));
const product_routes_1 = __importDefault(require("./routes/product.routes"));
const notification_routes_1 = __importDefault(require("./routes/notification.routes"));
const user_routes_1 = __importDefault(require("./routes/user.routes"));
const seller_routes_1 = __importDefault(require("./routes/seller.routes"));
const cron_util_1 = require("./utils/cron.util");
dotenv_1.default.config();
console.log('Server starting...');
console.log('After dotenv config');
console.log('Before app setup');
const app = (0, express_1.default)();
const PORT = process.env.PORT || 3000;
app.use((0, helmet_1.default)());
app.use((0, cors_1.default)({
    origin: (origin, callback) => {
        // Autoriser les requêtes sans origine (comme les apps mobiles)
        if (!origin)
            return callback(null, true);
        // Liste des origines autorisées
        const allowedOrigins = [
            "http://localhost:4200", // Angular dev server (port par défaut)
            "http://localhost:5173", // Vite dev server
            "http://localhost:5174", // Vite dev server
            "http://localhost:5176", // Vite dev server
            "http://localhost:5177", // Vite dev server
            "http://127.0.0.1:4200", // Angular avec IP locale
            "http://127.0.0.1:5173", // Vite avec IP locale
            /^http:\/\/localhost:\d+$/, // Tous les ports localhost
            /^http:\/\/127\.0\.0\.1:\d+$/ // Tous les ports 127.0.0.1
        ];
        // Vérifier si l'origine correspond à une des origines autorisées
        const isAllowed = allowedOrigins.some(pattern => {
            if (typeof pattern === 'string') {
                return pattern === origin;
            }
            else {
                return pattern.test(origin);
            }
        });
        if (isAllowed) {
            callback(null, true);
        }
        else {
            console.log('CORS blocked origin:', origin);
            callback(new Error('Not allowed by CORS'));
        }
    },
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"],
    credentials: true,
}));
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
// Servir les fichiers statiques (uploads)
app.use('/uploads', express_1.default.static(path_1.default.join(__dirname, '../public/uploads')));
// Routes API
app.use('/api/auth', auth_routes_1.default);
app.use('/api/sellers', seller_routes_1.default);
app.use('/api/products', product_routes_1.default);
app.use('/api/notifications', notification_routes_1.default);
app.use('/api/users', user_routes_1.default);
console.log('API routes configured');
// Initialiser les tâches cron
cron_util_1.CronService.init();
app.get('/health', (req, res) => {
    console.log('Health check requested');
    res.json({ status: 'OK', timestamp: new Date().toISOString() });
});
app.use((err, req, res, next) => {
    console.error('Erreur serveur:', err.stack);
    res.status(500).json({ error: 'Something went wrong!' });
});
app.use('*', (req, res) => {
    console.log('Route non trouvée:', req.originalUrl);
    res.status(404).json({ error: 'Route not found' });
});
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
exports.default = app;
//# sourceMappingURL=server.js.map