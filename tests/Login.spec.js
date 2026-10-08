import {test, expect} from '@playwright/test';

test(' Login page', async ({ page }) =>{
    await page.goto("https://opensource-demo.orangehrmlive.com/web/index.php/auth/login");

    // Username
    await page.getByRole('textbox', { name: 'Username'}).fill('Admin');

    //Password
    await page.getByRole('textbox', { name: 'Password'}).fill('admin123');

    await page.getByRole('button', { name: 'Login'}).click();

    await expect(page).toHaveURL(/dashboard/);

    await expect(page.getByRole('heading', {name: 'Dashboard'})).toBeVisible();

})