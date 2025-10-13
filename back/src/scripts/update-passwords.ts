import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function updateUserPasswords() {
  try {
    console.log('🔄 Mise à jour des mots de passe utilisateurs...');

    // Générer le hash pour "pass123"
    const hashedPassword = await bcrypt.hash('pass123', 10);

    // Mettre à jour le mot de passe de tous les utilisateurs existants
    const updateResult = await prisma.user.updateMany({
      data: {
        password: hashedPassword
      }
    });

    console.log(`✅ Mots de passe mis à jour pour ${updateResult.count} utilisateurs`);

    // Vérifier les utilisateurs actuels
    const users = await prisma.user.findMany({
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        role: true
      },
      orderBy: { createdAt: 'asc' }
    });

    console.log('\n📋 Utilisateurs actuels :');
    users.forEach(user => {
      console.log(`- ${user.firstName} ${user.lastName} (${user.email}) - Rôle: ${user.role}`);
    });

    // Créer ou mettre à jour les comptes admin et modérateur avec des emails simples
    const adminData = {
      email: 'admin@fotoljay.com',
      password: hashedPassword,
      firstName: 'Admin',
      lastName: 'Fotoljay',
      role: 'ADMIN' as const,
      phone: '+221771234567',
      isActive: true
    };

    const moderatorData = {
      email: 'moderator@fotoljay.com',
      password: hashedPassword,
      firstName: 'Modérateur',
      lastName: 'Fotoljay',
      role: 'MODERATOR' as const,
      phone: '+221771234568',
      isActive: true
    };

    // Créer ou mettre à jour admin
    const admin = await prisma.user.upsert({
      where: { email: adminData.email },
      update: adminData,
      create: adminData
    });

    // Créer ou mettre à jour modérateur
    const moderator = await prisma.user.upsert({
      where: { email: moderatorData.email },
      update: moderatorData,
      create: moderatorData
    });

    console.log('\n✅ Comptes créés/mis à jour :');
    console.log(`- Admin: ${admin.email} (pass123)`);
    console.log(`- Modérateur: ${moderator.email} (pass123)`);

    // Supprimer le compte système automatique s'il existe
    try {
      await prisma.user.deleteMany({
        where: { email: 'system-admin@fotoljay.com' }
      });
      console.log('\n🗑️ Compte système automatique supprimé');
    } catch (error) {
      console.log('\nℹ️ Aucun compte système à supprimer');
    }

    console.log('\n🎉 Mise à jour terminée avec succès !');
    console.log('\n📧 Informations de connexion :');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('👑 ADMIN');
    console.log(`   Email: admin@fotoljay.com`);
    console.log(`   Mot de passe: pass123`);
    console.log('');
    console.log('🛡️ MODÉRATEUR');
    console.log(`   Email: moderator@fotoljay.com`);
    console.log(`   Mot de passe: pass123`);
    console.log('');
    console.log('👤 VENDEURS');
    console.log(`   Tous les vendeurs existants ont maintenant le mot de passe: pass123`);
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

  } catch (error) {
    console.error('❌ Erreur lors de la mise à jour:', error);
  } finally {
    await prisma.$disconnect();
  }
}

updateUserPasswords();
