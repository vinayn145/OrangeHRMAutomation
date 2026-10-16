import { test, expect } from '@playwright/test';


test('Retriev all Employee from table', async ({ page }) => {
    await page.goto('https://opensource-demo.orangehrmlive.com/web/index.php/auth/login');

    // Login
    await page.getByPlaceholder('Username').fill('Admin');
    await page.getByPlaceholder('Password').fill('admin123');
    await page.getByRole('button', { name: 'Login' }).click();

    // 2. Navigate to PIM
    await expect(page).toHaveURL(/dashboard/);
    await page.getByRole('link', { name: 'PIM' }).click();
    await expect(page.getByRole('heading', { name: 'Employee Information' })
    ).toBeVisible();

    //3. Counting the Employee table
    // const employeeName = page.locator(
    //     '.oxd-table-body .oxd-table-row .oxd-table-cell:nth-child(3)'
    // );
    const rows = page.locator('.oxd-table-body .oxd-table-row')
    await expect(rows.first()).toBeVisible();

    const count = await rows.count();


    for (let i = 0; i < count; i++) {
        const row=rows.nth(i);

        const employeeId = await row.locator('.oxd-table-cell')
                          .nth(1).textContent();
        
        const firstMiddleName= await row.locator('.oxd-table-cell')
                          .nth(2).textContent();

        const lastName= await row.locator('.oxd-table-cell')
                          .nth(3).textContent();
                          
        const fullName=`${firstMiddleName}${lastName}`.trim();
        
        console.log(
            `Employee ${i+1}:${employeeId} - ${fullName}`
        )
    }
});