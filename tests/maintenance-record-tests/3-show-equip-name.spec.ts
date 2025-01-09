import { test, expect } from '@playwright/test';

test.describe('Maintenance Records Table - Group by Equipment Name', () => {
  test('should group table by equipment name', async ({ page }) => {
    // Navigate to the page containing the MaintenanceRecordsTable component
    await page.goto('http://localhost:3000/maintenance-records-table');

    // Wait for the table to be visible
    await page.waitForSelector('table');

    // Log the initial table structure
    console.log('Initial table structure:');
    await logTableStructure(page);

    // Check if the grouping select exists
    const groupingSelect = await page.$('select#grouping-select');
    expect(groupingSelect, 'Grouping select should exist').toBeTruthy();
    // Select "Equipment Name" from the "Group by" dropdown
    await page.selectOption('select#grouping-select', 'equipmentName');

    // Wait for the table to update
    await page.waitForTimeout(2000); // Increased timeout to ensure grouping has taken effect

    // Log the table structure after grouping
    console.log('Table structure after grouping:');
    await logTableStructure(page);

    // Get all the rows in the table body
    const rows = await page.$$('tbody tr');

    // Initialize variables to track grouping
    let currentGroup = '';
    let isGrouped = true;
    let hasGroups = false;
    let groupingErrors: string[] = []; // Specify the type as string[]

    // Iterate through the rows to check if they're grouped correctly
    for (let i = 0; i < rows.length; i++) {
      const row = rows[i];
      const cells = await row.$$('td');
      const cellTexts = await Promise.all(cells.map(cell => cell.textContent()));

      console.log(`Row ${i + 1}:`, cellTexts.join(' | '));

      if (cellTexts[0]?.includes('Equipment Name:')) {
        // This is a group header row
        hasGroups = true;
        currentGroup = cellTexts[0].split('Equipment Name:')[1].trim();
      } else if (cellTexts.length > 1) {
        // This is a data row
        const equipmentName = cellTexts[1]; // Assuming equipment name is in the 2nd column
        if (equipmentName !== currentGroup) {
          isGrouped = false;
          groupingErrors.push(`Row ${i + 1}: Expected "${currentGroup}", but found "${equipmentName}"`);
        }
      }
    }

    // Log detailed information about the grouping
    console.log(`Number of rows found: ${rows.length}`);
    console.log(`Has groups: ${hasGroups}`);
    console.log(`Is grouped correctly: ${isGrouped}`);

    if (groupingErrors.length > 0) {
      console.log('Grouping errors:');
      groupingErrors.forEach(error => console.log(error));
    }

    // Assert that the table is correctly grouped
    expect(hasGroups, 'Table should have group headers').toBe(true);
    expect(isGrouped, 'Table should be correctly grouped by equipment name').toBe(true);
  });
});

async function logTableStructure(page) {
  const tableStructure = await page.evaluate(() => {
    const table = document.querySelector('table');
    if (!table) return 'Table not found';

    const headers = Array.from(table.querySelectorAll('thead th')).map(th => th.textContent);
    const rows = Array.from(table.querySelectorAll('tbody tr')).map(tr => 
      Array.from(tr.querySelectorAll('td')).map(td => td.textContent)
    );

    return { headers, rows };
  });

  console.log('Table headers:', tableStructure.headers);
  console.log('Table rows:');
  tableStructure.rows.forEach((row, index) => {
    console.log(`Row ${index + 1}:`, row.join(' | '));
  });
}

