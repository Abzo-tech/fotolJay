"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const bcrypt = __importStar(require("bcrypt"));
const prisma = new client_1.PrismaClient();
async function main() {
    // Vérifier si un admin existe déjà
    const existingAdmin = await prisma.user.findFirst({
        where: { role: 'ADMIN' },
    });
    if (existingAdmin) {
        console.log('Admin user already exists');
        return;
    }
    const hashedPassword = await bcrypt.hash('admin123', 12);
    // Créer un utilisateur admin
    const admin = await prisma.user.create({
        data: {
            email: 'admin@fotoljay.com',
            password: hashedPassword,
            firstName: 'Admin',
            lastName: 'FOTOLJAY',
            role: 'ADMIN',
        },
    });
    console.log('✅ Admin user created successfully:', admin.email);
    // Créer un utilisateur modérateur
    const hashedPasswordMod = await bcrypt.hash('moderator123', 12);
    const moderator = await prisma.user.create({
        data: {
            email: 'moderator@fotoljay.com',
            password: hashedPasswordMod,
            firstName: 'Moderator',
            lastName: 'FOTOLJAY',
            role: 'MODERATOR',
        },
    });
    console.log('✅ Moderator user created successfully:', moderator.email);
    console.log('\n📋 Résumé des utilisateurs créés:');
    console.log('================================');
    console.log('Admin: admin@fotoljay.com / admin123');
    console.log('Moderator: moderator@fotoljay.com / moderator123');
    console.log('\n💡 Note: Les vendeurs publient sans compte!');
    console.log('Les acheteurs consultent sans connexion!');
}
main()
    .catch((e) => {
    console.error(e);
    process.exit(1);
})
    .finally(async () => {
    await prisma.$disconnect();
});
//# sourceMappingURL=seed.js.map