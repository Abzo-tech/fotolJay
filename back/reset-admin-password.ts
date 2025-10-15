import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('🔧 Réinitialisation du mot de passe admin...\n');

  // Trouver l'utilisateur admin
  const admin = await prisma.user.findFirst({
    where: { role: 'ADMIN' },
  });

  if (!admin) {
    console.log('❌ Aucun utilisateur admin trouvé.');
    return;
  }

  console.log(`Admin trouvé: ${admin.email}`);

  // Nouveau mot de passe
  const newPassword = 'admin123';
  const hashedPassword = await bcrypt.hash(newPassword, 12);

  // Mettre à jour le mot de passe
  await prisma.user.update({
    where: { id: admin.id },
    data: { password: hashedPassword },
  });

  console.log(`✅ Mot de passe admin réinitialisé pour ${admin.email}`);
  console.log(`Nouveau mot de passe: ${newPassword}`);
  console.log('\n💡 Utilisez ces identifiants pour vous connecter:');
  console.log(`${admin.email} / ${newPassword}`);
}

main()
  .catch((e) => {
    console.error('Erreur:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
