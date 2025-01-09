import { test, expect } from '@playwright/test';

test.describe('Equipment Management Page', () => {
    test('inspect page structure', async ({ page }) => {
      await page.goto('http://localhost:3000/equipment-form');
      
      // Log the entire page content
      const pageContent = await page.content();
      console.log('Page content:', pageContent);
    
      // Log the text content of all h1 elements
      const h1Elements = await page.locator('h1').allTextContents();
      console.log('H1 elements:', h1Elements);
    
      // Log the text content of all h2 elements
      const h2Elements = await page.locator('h2').allTextContents();
      console.log('H2 elements:', h2Elements);
    
      // Log the classes of the main container
      const mainClasses = await page.locator('main').first().getAttribute('class');
      console.log('Main container classes:', mainClasses);
    
      // Log the structure of the form
      const formFields = await page.locator('form input, form select').allTextContents();
      console.log('Form fields:', formFields);
    
      // Log the structure of the table
      const tableHeaders = await page.locator('table th').allTextContents();
      console.log('Table headers:', tableHeaders);
    
      // Check for specific elements and log their presence
      const elements = [
        'main:has(h1:text("Equipment Management"))',
        'form',
        'table',
        'button:text("Submit")',
        'button:text("Reset")'
      ];
    
      for (const selector of elements) {
        const isPresent = await page.locator(selector).count() > 0;
        console.log(`Element "${selector}" is present:`, isPresent);
      }
    
      // Take a screenshot for visual inspection
      await page.screenshot({ path: 'equipment-form-screenshot.png', fullPage: true });
    
      // Log any console errors
      page.on('console', msg => {
        if (msg.type() === 'error') {
          console.error('Page error:', msg.text());
        }
      });
    });

    test('should render the main container with the correct CSS classes', async ({ page }) => {
        await page.goto('http://localhost:3000/equipment-form');
        
        // First, let's check how many matching elements we have
        const mainContainers = page.locator('main:has(h1:text("Equipment Management"))');
        const count = await mainContainers.count();
        console.log(`Number of matching main containers: ${count}`);
      
        // If there are multiple elements, we'll check the first one
        if (count > 1) {
          console.warn('Warning: Multiple main containers found. Checking the first one.');
          await expect(mainContainers.first()).toHaveClass('container mx-auto p-4');
        } else {
          await expect(mainContainers).toHaveClass('container mx-auto p-4');
        }
      
        // Additional checks to help diagnose the issue
        const allMainElements = page.locator('main');
        const allMainCount = await allMainElements.count();
        console.log(`Total number of main elements: ${allMainCount}`);
      
        for (let i = 0; i < allMainCount; i++) {
          const mainElement = allMainElements.nth(i);
          const classes = await mainElement.getAttribute('class');
          const hasH1 = await mainElement.locator('h1:text("Equipment Management")').count() > 0;
          console.log(`Main element ${i + 1}: classes="${classes}", has correct h1: ${hasH1}`);
        }
      });

  test('should display the Equipment Management heading with correct styling', async ({ page }) => {
    await page.goto('http://localhost:3000/equipment-form');
    
    const heading = page.locator('main:has(h1:text("Equipment Management")) h1');
    await expect(heading).toHaveText('Equipment Management');
    await expect(heading).toHaveClass('text-2xl font-bold mb-4');
  });

  test('should render the EquipmentForm component in the "Add New Equipment" section', async ({ page }) => {
    await page.goto('http://localhost:3000/equipment-form');
    
    const addNewEquipmentSection = page.locator('main:has(h1:text("Equipment Management")) section', { hasText: 'Add New Equipment' });
    await expect(addNewEquipmentSection).toBeVisible();
    
    const equipmentForm = addNewEquipmentSection.locator('form');
    await expect(equipmentForm).toBeVisible();
  });

  test('should render the EquipmentTable component in the "Equipment List" section', async ({ page }) => {
    await page.goto('http://localhost:3000/equipment-form');
    
    const equipmentListSection = page.locator('main:has(h1:text("Equipment Management")) section', { hasText: 'Equipment List' });
    await expect(equipmentListSection).toBeVisible();
    
    const equipmentTable = equipmentListSection.locator('table');
    await expect(equipmentTable).toBeVisible();
  });

test('should maintain proper spacing between sections using the mb-8 class', async ({ page }) => {
    await page.goto('http://localhost:3000/equipment-form');

    const addNewEquipmentSection = page.locator('main:has(h1:text("Equipment Management")) section', { hasText: 'Add New Equipment' });
    const equipmentListSection = page.locator('main:has(h1:text("Equipment Management")) section', { hasText: 'Equipment List' });

    await expect(addNewEquipmentSection).toHaveClass('mb-8');
    await expect(equipmentListSection).not.toHaveClass('mb-8');

    const computedStyle = await addNewEquipmentSection.evaluate((el) => {
      return window.getComputedStyle(el).marginBottom;
    });

    expect(computedStyle).toBe('32px'); // 8 * 4px (default tailwind spacing unit)
  });

test('should apply consistent font styling to all headings', async ({ page }) => {
  await page.goto('http://localhost:3000/equipment-form');

  const h1 = page.locator('h1');
  const h2s = page.locator('h2');

  await expect(h1).toHaveClass('font-bold');
  await expect(h2s).toHaveCount(2);
  
  for (let i = 0; i < 2; i++) {
    await expect(h2s.nth(i)).toHaveClass('font-semibold');
  }

  await expect(h1).toHaveCSS('font-weight', '700');
  await expect(h2s.first()).toHaveCSS('font-weight', '600');
  await expect(h2s.last()).toHaveCSS('font-weight', '600');
});
test('should ensure the page layout is responsive and adapts to different screen sizes', async ({ page }) => {
  await page.goto('http://localhost:3000/equipment-form');

  const viewports = [
    { width: 1920, height: 1080 }, // Desktop
    { width: 1024, height: 768 },  // Tablet
    { width: 375, height: 667 }    // Mobile
  ];

  for (const viewport of viewports) {
    await page.setViewportSize(viewport);

    const mainContainer = page.locator('main');
    await expect(mainContainer).toHaveClass('container mx-auto p-4');

    const heading = page.locator('h1');
    await expect(heading).toBeVisible();
    await expect(heading).toHaveClass('text-2xl font-bold mb-4');

    const sections = page.locator('section');
    await expect(sections).toHaveCount(2);

    const addNewEquipmentSection = sections.nth(0);
    const equipmentListSection = sections.nth(1);

    await expect(addNewEquipmentSection).toBeVisible();
    await expect(equipmentListSection).toBeVisible();

    await expect(addNewEquipmentSection).toHaveClass('mb-8');

    const sectionHeadings = page.locator('h2');
    await expect(sectionHeadings).toHaveCount(2);
    await expect(sectionHeadings).toHaveClass('text-xl font-semibold mb-4');

    const equipmentForm = addNewEquipmentSection.locator('form');
    await expect(equipmentForm).toBeVisible();

    const equipmentTable = equipmentListSection.locator('table');
    await expect(equipmentTable).toBeVisible();

    // Check if elements are within the viewport
    await expect(mainContainer).toBeInViewport();
    await expect(heading).toBeInViewport();
    await expect(addNewEquipmentSection).toBeInViewport();
    await expect(equipmentListSection).toBeInViewport();
  }
});
test('should import EquipmentForm and EquipmentTable components correctly', async ({ page }) => {
  await page.goto('http://localhost:3000/equipment-form');

  const equipmentForm = page.locator('section').filter({ hasText: 'Add New Equipment' }).locator('form');
  const equipmentTable = page.locator('section').filter({ hasText: 'Equipment List' }).locator('table');

  await expect(equipmentForm).toBeVisible();
  await expect(equipmentTable).toBeVisible();
});
test('should render "Add New Equipment" section before "Equipment List" section', async ({ page }) => {
  await page.goto('http://localhost:3000/equipment-form');

  const sections = page.locator('section');
  await expect(sections).toHaveCount(2);

  const firstSectionHeading = sections.nth(0).locator('h2');
  const secondSectionHeading = sections.nth(1).locator('h2');

  await expect(firstSectionHeading).toHaveText('Add New Equipment');
  await expect(secondSectionHeading).toHaveText('Equipment List');

  const firstSectionRect = await sections.nth(0).boundingBox();
  const secondSectionRect = await sections.nth(1).boundingBox();

  if (firstSectionRect && secondSectionRect) {
    expect(firstSectionRect.y).toBeLessThan(secondSectionRect.y);
  } else {
    throw new Error('Unable to get bounding boxes for sections');
  }
});

test('should confirm proper heading hierarchy for accessibility', async ({ page }) => {
  await page.goto('http://localhost:3000/equipment-form');

  const h1 = page.locator('h1');
  const h2s = page.locator('h2');

  // Check if there's only one h1 element
  await expect(h1).toHaveCount(1);

  // Check if the h1 content is correct
  await expect(h1).toHaveText('Equipment Management');

  // Check if there are two h2 elements
  await expect(h2s).toHaveCount(2);

  // Check if the h2 contents are correct and in the right order
  await expect(h2s.nth(0)).toHaveText('Add New Equipment');
  await expect(h2s.nth(1)).toHaveText('Equipment List');

  // Check if h1 comes before h2s in the DOM
  const h1Box = await h1.boundingBox();
  const firstH2Box = await h2s.first().boundingBox();
  if (h1Box && firstH2Box) {
    expect(h1Box.y).toBeLessThan(firstH2Box.y);
  } else {
    throw new Error('Unable to get bounding boxes for h1 or first h2');
  }

  // Check if h2s are in the correct sections
  const addNewEquipmentSection = page.locator('section').filter({ hasText: 'Add New Equipment' });
  const equipmentListSection = page.locator('section').filter({ hasText: 'Equipment List' });

  await expect(addNewEquipmentSection.locator('h2')).toHaveText('Add New Equipment');
  await expect(equipmentListSection.locator('h2')).toHaveText('Equipment List');
});
});