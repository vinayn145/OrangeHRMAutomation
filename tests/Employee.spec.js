import { test, expect } from '@playwright/test';

test('Add Employee', async ({ page }) => {
  test.setTimeout(90_000); // public demo site is slow

  const loader = page.locator('.oxd-form-loader');

  // Employee Id is limited to 10 characters: "EMP" + 7 digits = 10
  const employeeId = `EMP${Date.now().toString().slice(-7)}`;

  // Locate the Employee Id input by its label (more stable than .nth(4))
  const employeeIdInput = page
    .locator('.oxd-input-group')
    .filter({ hasText: 'Employee Id' })
    .locator('input');

  // 1. Login
  await page.goto('https://opensource-demo.orangehrmlive.com/web/index.php/auth/login');
  await page.getByPlaceholder('Username').fill('Admin');
  await page.getByPlaceholder('Password').fill('admin123');
  await page.getByRole('button', { name: 'Login' }).click();

  await expect(page).toHaveURL(/dashboard/);
  await expect(page.getByRole('heading', { name: 'Dashboard' })).toBeVisible();

  // 2. Navigate to PIM > Add Employee
  await page.getByRole('link', { name: 'PIM' }).click();
  await expect(page.getByRole('heading', { name: 'PIM', level: 6 })).toBeVisible();
  await page.getByRole('link', { name: 'Add Employee' }).click();
  await expect(page.getByRole('heading', { name: 'Add Employee' })).toBeVisible();

  // 3. Fill name (lastName unchanged)
  await page.getByPlaceholder('First Name').fill('Vinay');
  await page.getByPlaceholder('Middle Name').fill('Test');
  await page.getByPlaceholder('Last Name').fill('Automation');

  // 4. Wait for the loader, otherwise the auto-generated ID can overwrite ours
  await expect(loader).toBeHidden({ timeout: 30_000 });

  // 5. Set a unique Employee Id
  await employeeIdInput.fill(employeeId);
  await expect(employeeIdInput).toHaveValue(employeeId);

  // 6. Save
  await page.getByRole('button', { name: 'Save' }).click();
  await expect(page.getByText('Successfully Saved')).toBeVisible();

  // 7. Verify Personal Details page
  await expect(page.getByRole('heading', { name: 'Personal Details' })).toBeVisible();
  await expect(loader).toBeHidden();
  await expect(page.getByPlaceholder('First Name')).toHaveValue('Vinay');
  await expect(page.getByPlaceholder('Last Name')).toHaveValue('Automation');
  await expect(employeeIdInput).toHaveValue(employeeId);
});