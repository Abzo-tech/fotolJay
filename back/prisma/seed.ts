import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  // Vérifier si un admin existe déjà
  const existingAdmin = await prisma.user.findFirst({
    where: { role: 'ADMIN' },
  });

  if (!existingAdmin) {
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
  } else {
    console.log('Admin user already exists');
  }

  // Créer un utilisateur modérateur si pas existant
  const existingModerator = await prisma.user.findFirst({
    where: { role: 'MODERATOR' },
  });

  if (!existingModerator) {
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
  } else {
    console.log('Moderator user already exists');
  }

  // Créer un utilisateur vendeur test si pas existant
  const existingSeller = await prisma.user.findFirst({
    where: { email: 'seller@test.com' },
  });

  if (!existingSeller) {
    const hashedPasswordSeller = await bcrypt.hash('password', 12);
    const seller = await prisma.user.create({
      data: {
        email: 'seller@test.com',
        password: hashedPasswordSeller,
        firstName: 'Test',
        lastName: 'Seller',
        role: 'SELLER',
        credits: 50, // Donner 50 crédits pour tester
      },
    });

    console.log('✅ Test seller user created successfully:', seller.email);
  } else {
    console.log('Test seller user already exists');
  }

  console.log('\n📋 Résumé des utilisateurs:');
  console.log('==========================');
  console.log('Admin: admin@fotoljay.com / admin123');
  console.log('Moderator: moderator@fotoljay.com / moderator123');
  console.log('Test Seller: seller@test.com / password');
  console.log('\n💡 Note: Utilisez le compte seller pour tester les fonctionnalités vendeur!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });