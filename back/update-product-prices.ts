import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Updating prices for existing products...');

  const products = await prisma.product.findMany();

  if (products.length === 0) {
    console.log('No products found.');
    return;
  }

  const updates = products.map(async (product) => {
    const randomPrice = Math.floor(Math.random() * (500 - 10 + 1)) + 10; // Random between 10 and 500
    return prisma.product.update({
      where: { id: product.id },
      data: { price: randomPrice },
    });
  });

  const updatedProducts = await Promise.all(updates);

  console.log(`Updated ${updatedProducts.length} products with random prices.`);
}

main()
  .catch((e) => {
    console.error('Error updating prices:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
