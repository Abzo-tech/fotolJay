import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🔍 Vérification des utilisateurs existants...\n');

  const users = await prisma.user.findMany({
    select: {
      id: true,
      email: true,
      firstName: true,
      lastName: true,
      role: true,
      credits: true,
      isVip: true,
      createdAt: true,
    },
    orderBy: {
      createdAt: 'asc',
    },
  });

  if (users.length === 0) {
    console.log('❌ Aucun utilisateur trouvé dans la base de données.');
    return;
  }

  console.log(`📊 ${users.length} utilisateur(s) trouvé(s):\n`);

  users.forEach((user, index) => {
    console.log(`${index + 1}. ${user.firstName} ${user.lastName}`);
    console.log(`   Email: ${user.email}`);
    console.log(`   Rôle: ${user.role}`);
    console.log(`   Crédits: ${user.credits}`);
    console.log(`   VIP: ${user.isVip ? 'Oui' : 'Non'}`);
    console.log(`   Créé le: ${user.createdAt.toLocaleDateString('fr-FR')}`);
    console.log('');
  });

  console.log('🔐 Comptes de connexion:');
  console.log('========================');
  const admin = users.find(u => u.role === 'ADMIN');
  const moderator = users.find(u => u.role === 'MODERATOR');

  if (admin) {
    console.log(`Admin: ${admin.email} / admin123`);
  }
  if (moderator) {
    console.log(`Modérateur: ${moderator.email} / moderator123`);
  }

  console.log('\n💡 Note: Les vendeurs publient sans compte!');
  console.log('Les acheteurs consultent sans connexion!');
}

main()
  .catch((e) => {
    console.error('Erreur:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
