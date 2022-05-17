import { Browser, BrowserContext, chromium, Page } from "playwright";
import HomePage from "../page-object/home.page";
import LoginPage from "../page-object/login.page"
import PageGhostPage from "../page-object/page-ghost.page";
import PageEditorPage from "../page-object/page-editor.page";
import Env from "../util/environment";

import { expect, test } from '@playwright/test';
import StaffEditorPage from "../page-object/staff-editor.page";
import Utilities from "../util/utilities";

let screenshotNumber = 1;

test.describe("PA015: Verificar cambio de contraseña exitoso", () => {

    let browser: Browser;
    let context: BrowserContext;
    let page: Page;
    let utilities: Utilities;

    //pageObject variables
    let login: LoginPage;
    let home: HomePage;
    let pageGhost: PageGhostPage;
    let pageEditor: PageEditorPage;
    let staffEditorPage: StaffEditorPage;

    test.beforeAll( async() => {
        browser = await chromium.launch({
            headless: Env.HEADLESS
        });
        context = await browser.newContext({ viewport: { width: 1200, height: 600 } });
        page = await context.newPage();
        utilities = new Utilities("PA015");

        //Given I navigate to admin module
        await page.goto(Env.BASE_URL + Env.ADMIN_SECTION);
        login = new LoginPage(page);
        home = new HomePage(page);
        pageGhost = new PageGhostPage(page);
        pageEditor = new PageEditorPage(page);
        staffEditorPage = new StaffEditorPage(page);
    });

    test("should go to user settings, change password, log out and then try to log in with old password, then with new password", async () => {
        await page.screenshot({path: utilities.generateScreenshotPath(screenshotNumber++)});
        //Given I log in
        await login.signInWith(Env.USER, Env.PASS);
        //When I enter the user profile settings
        await page.screenshot({path: utilities.generateScreenshotPath(screenshotNumber++)});
        await home.clickUserMenu();
        await page.screenshot({path: utilities.generateScreenshotPath(screenshotNumber++)});
        await home.clickUserProfileLink();
        await page.screenshot({path: utilities.generateScreenshotPath(screenshotNumber++)});
        await staffEditorPage.eleSaveButton;
        //When I change the password
        await staffEditorPage.fillCurrentPaswordInput(Env.PASS);
        await page.screenshot({path: utilities.generateScreenshotPath(screenshotNumber++)});
        await staffEditorPage.fillNewPasswordInput('WhatABeautifulDay123');
        await page.screenshot({path: utilities.generateScreenshotPath(screenshotNumber++)});
        await staffEditorPage.fillPasswordVerificationInput('WhatABeautifulDay123');
        await page.screenshot({path: utilities.generateScreenshotPath(screenshotNumber++)});
        await staffEditorPage.clickChangePasswordButton();
        //await new Promise(r => setTimeout(r, 1500));
        await page.screenshot({path: utilities.generateScreenshotPath(screenshotNumber++)});
        await staffEditorPage.clickCloseNotification();
        await page.screenshot({path: utilities.generateScreenshotPath(screenshotNumber++)});
        // When I log out
        await home.clickUserMenu();
        await page.screenshot({path: utilities.generateScreenshotPath(screenshotNumber++)});
        await home.clickSignoutLink();
        await page.screenshot({path: utilities.generateScreenshotPath(screenshotNumber++)});
        //Then the old password won't work
        await login.enterEmailAddress(Env.USER);
        await page.screenshot({path: utilities.generateScreenshotPath(screenshotNumber++)});
        await login.enterPassword(Env.PASS);
        await page.screenshot({path: utilities.generateScreenshotPath(screenshotNumber++)});
        await login.clickSignIn();
        //const errorNotification = 
        expect(await login.eleIncorrectPasswordText).toBeTruthy();
        await new Promise(r => setTimeout(r, 1000));
        await page.screenshot({path: utilities.generateScreenshotPath(screenshotNumber++)});
        //Then the new password will work
        await login.reenterEmailAddress(Env.USER);
        await page.screenshot({path: utilities.generateScreenshotPath(screenshotNumber++)});
        await login.reenterPassword('WhatABeautifulDay123');
        await page.screenshot({path: utilities.generateScreenshotPath(screenshotNumber++)});
        await login.clickRetry();
        await new Promise(r => setTimeout(r, 2000));
        await page.screenshot({path: utilities.generateScreenshotPath(screenshotNumber++)});
    });

    test.afterAll(async () => {
        await home.clickUserMenu();
        await home.clickUserProfileLink();
        await staffEditorPage.fillCurrentPaswordInput('WhatABeautifulDay123');
        await staffEditorPage.fillNewPasswordInput(Env.PASS);
        await staffEditorPage.fillPasswordVerificationInput(Env.PASS);
        await staffEditorPage.clickChangePasswordButton();
        await page.close();
        await context.close();
        await browser.close();
    })

});