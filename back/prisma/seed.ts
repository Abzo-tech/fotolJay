import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

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