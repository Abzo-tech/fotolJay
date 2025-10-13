import { test, expect } from '@playwright/test';

test.describe('Logo and Navbar Display', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should display logo correctly in navbar on desktop', async ({ page }) => {
    // Vérifier que le logo est visible
    const logo = page.locator('.brand-logo');
    await expect(logo).toBeVisible();

    // Vérifier les attributs de l'image
    await expect(logo).toHaveAttribute('src', 'assets/images/logo.png');
    await expect(logo).toHaveAttribute('alt', 'Fotoljay Logo');

    // Vérifier que le texte du brand est visible
    const brandName = page.locator('.brand-name');
    await expect(brandName).toBeVisible();
    await expect(brandName).toHaveText('Fotoljay');
  });

  test('should have hover effects on logo', async ({ page }) => {
    const logoLink = page.locator('.navbar-brand');

    // Hover sur le logo
    await logoLink.hover();

    // Le logo devrait garder sa visibilité même en hover
    const logo = page.locator('.brand-logo');
    await expect(logo).toBeVisible();
  });

  test('should navigate to home when logo is clicked', async ({ page }) => {
    const logoLink = page.locator('.navbar-brand');

    // Naviguer vers une autre page d'abord (login)
    await page.locator('a[routerLink="/login"]').click();
    await expect(page).toHaveURL('/login');

    // Cliquer sur le logo pour revenir à l'accueil
    await logoLink.click();
    await expect(page).toHaveURL('/');
  });

  test('should display navbar links correctly on desktop', async ({ page }) => {
    // Vérifier tous les liens de la navbar
    await expect(page.locator('a[routerLink="/seller-auth"]')).toBeVisible();
    await expect(page.locator('a[routerLink="/sell"]')).toBeVisible();
    await expect(page.locator('a[routerLink="/login"]')).toBeVisible();

    // Vérifier le texte des liens
    await expect(page.locator('a[routerLink="/seller-auth"]')).toContainText('Espace Vendeur');
    await expect(page.locator('a[routerLink="/sell"]')).toContainText('Vendre un produit');
    await expect(page.locator('a[routerLink="/login"]')).toContainText('Connexion Admin');
  });

  test('should show mobile menu on small screens', async ({ page }) => {
    // Redimensionner pour mobile
    await page.setViewportSize({ width: 375, height: 667 });

    // Le logo devrait toujours être visible
    const logo = page.locator('.brand-logo');
    await expect(logo).toBeVisible();

    // Le bouton menu mobile devrait être visible
    const mobileMenuButton = page.locator('.mobile-menu-button');
    await expect(mobileMenuButton).toBeVisible();

    // Les liens desktop ne devraient pas être visibles sur mobile
    await expect(page.locator('.navbar-right')).not.toBeVisible();
  });

  test('should open and close mobile menu correctly', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });

    // Ouvrir le menu mobile
    const mobileMenuButton = page.locator('.mobile-menu-button');
    await mobileMenuButton.click();

    // Vérifier que le menu est ouvert
    await expect(page.locator('.mobile-menu-overlay')).toBeVisible();
    await expect(page.locator('.mobile-menu')).toBeVisible();

    // Vérifier les éléments du menu mobile
    await expect(page.locator('.mobile-menu a[routerLink="/seller-auth"]')).toBeVisible();
    await expect(page.locator('.mobile-menu a[routerLink="/sell"]')).toBeVisible();
    await expect(page.locator('.mobile-menu a[routerLink="/login"]')).toBeVisible();

    // Fermer le menu mobile
    const closeButton = page.locator('.mobile-menu-close');
    await closeButton.click();

    // Vérifier que le menu est fermé
    await expect(page.locator('.mobile-menu-overlay')).not.toBeVisible();
  });

  test('should not have template compilation errors', async ({ page }) => {
    // Vérifier qu'il n'y a pas d'erreurs JavaScript
    const errors: string[] = [];
    page.on('pageerror', (error) => {
      errors.push(error.message);
    });

    // Naviguer et attendre le chargement
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // Aucune erreur ne devrait être présente
    expect(errors).toHaveLength(0);

    // Vérifier que la page se charge correctement
    await expect(page.locator('h1')).toContainText("Trouvez des produits d'occasion de qualité");
  });

  test('should handle logo image loading errors gracefully', async ({ page }) => {
    // Intercepter les requêtes d'images et simuler une erreur pour le logo
    await page.route('**/assets/images/logo.png', (route) => {
      route.abort();
    });

    await page.goto('/');

    // Le logo devrait toujours avoir l'attribut alt pour l'accessibilité
    const logo = page.locator('.brand-logo');
    await expect(logo).toHaveAttribute('alt', 'Fotoljay Logo');

    // Le texte Fotoljay devrait toujours être visible même si l'image ne charge pas
    const brandName = page.locator('.brand-name');
    await expect(brandName).toBeVisible();
    await expect(brandName).toHaveText('Fotoljay');
  });

  test('should have proper responsive behavior across different screen sizes', async ({ page }) => {
    const breakpoints = [
      { width: 1200, height: 800, description: 'Desktop' },
      { width: 768, height: 1024, description: 'Tablet' },
      { width: 375, height: 667, description: 'Mobile' },
    ];

    for (const breakpoint of breakpoints) {
      await page.setViewportSize({ width: breakpoint.width, height: breakpoint.height });

      // Le logo devrait toujours être visible
      const logo = page.locator('.brand-logo');
      await expect(logo).toBeVisible();

      // Le brand name devrait toujours être visible
      const brandName = page.locator('.brand-name');
      await expect(brandName).toBeVisible();

      // Vérifier la navigation appropriée selon la taille
      if (breakpoint.width < 768) {
        await expect(page.locator('.mobile-menu-button')).toBeVisible();
      } else {
        await expect(page.locator('.navbar-right')).toBeVisible();
      }
    }
  });
});
