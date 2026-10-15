import { test, expect } from '@playwright/test';


test('Add and Search Employee', async ({ page }) => {
    // OrangeHRM demo can sometimes be slow
  test.setTimeout(60_000);

  const firstName=`Vinay${Date.now().toString().slice(-5)}`;
  const middleName= 'Test';
  const lastName='Automation';
  const employeeId = `EMP${Date.now().toString().slice(-7)}`;

  // 1. Login
  await page.goto('https://opensource-demo.orangehrmlive.com/web/index.php/auth/login',
    { 
      waitUntil: 'domcontentloaded',
      timeout: 60_000,
    }
  );

  //2. Login
  await page.getByPlaceholder('Username').fill('Admin');
  await page.getByPlaceholder('Password').fill('admin123');
  await page.getByRole('button', { name: 'Login' }).click();

  // Verify successful login
  await expect(page).toHaveURL(/dashboard/, 
    {
      timeout: 30_000,
    });
  
    //3. Navigate to PIM
    await page.getByRole('link', { name: 'PIM' }).click();
    await expect(
      page.getByRole('heading', { name: 'Employee Information'})
    ).toBeVisible({ timeout: 30_000});

    //4.Navigate to Add Employee
    await page.getByRole('link', { name: 'Add Employee' }).click();
    await expect(page.getByRole('heading', { name: 'Add Employee' })).toBeVisible();

    //5.Enter employee details
    await page.getByPlaceholder('First Name').fill(firstName);
    await page.getByPlaceholder('Middle Name').fill(middleName);
    await page.getByPlaceholder('Last Name').fill(lastName);
    
    // Wait until genertaed Employee ID has finished loading
    const loader= page.locator('.oxd-form-loader');
    await expect(loader).toBeHidden({ timeout: 30_000});
 
    const employeeIdInput = page
    .locator('.oxd-input-group')
    .filter({ hasText: 'Employee Id' })
    .locator('input');

    await employeeIdInput.fill(employeeId);
    await expect(employeeIdInput).toHaveValue(employeeId);

    //6. Save employee
    await page.getByRole('button', { name: 'Save' }).click();

    await expect(
      page.getByText('Successfully Saved')
    ).toBeVisible({ timeout: 30_000 });

    //wait for employee details page after saving
     await expect(page).toHaveURL(/viewPersonalDetails/, { timeout: 30_000});
    
    // 7. Return to employee List
    await page.getByRole('link', { name: 'PIM' }).click(); 

    await expect( page.getByRole('heading', { name: 'Employee Information'})
    ).toBeVisible({ timeout: 30_000});
  
    //8. Search using the unique employee ID
    const EmployeeIdSearrchInput = page.locator('.oxd-input-group')
            .filter({ hasText: 'Employee Id'})
            .locator('input');

     await EmployeeIdSearrchInput.fill(employeeId); 
     
     await page.getByRole('button', { name: 'Search'}).click();

     //9. Verify the employee row
     const employeeRow= page.getByRole('row').filter
                        ({hasText: employeeId});
     
    await expect(employeeRow).toBeVisible();

    await expect(employeeRow).toContainText(firstName);
                 
});