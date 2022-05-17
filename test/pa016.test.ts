import { Browser, BrowserContext, chromium, Page } from "playwright";
import HomePage from "../page-object/home.page";
import LoginPage from "../page-object/login.page"
import Env from "../util/environment";

import { expect, test } from '@playwright/test';
import StaffEditorPage from "../page-object/staff-editor.page";
import Utilities from "../util/utilities";

let screenshotNumber = 1;

test.describe("PA016: Verificar cambio de e-mail exitoso", () => {

    let browser: Browser;
    let context: BrowserContext;
    let page: Page;
    let utilities: Utilities;

    //pageObject variables
    let login: LoginPage;
    let home: HomePage;
    let staffEditorPage: StaffEditorPage;

    test.beforeAll( async() => {
        browser = await chromium.launch({
            headless: Env.HEADLESS
        });
        context = await browser.newContext({ viewport: { width: 1200, height: 600 } });
        page = await context.newPage();
        utilities = new Utilities("PA016");

        //Given I navigate to admin module
        await page.goto(Env.BASE_URL + Env.ADMIN_SECTION);
        login = new LoginPage(page);
        home = new HomePage(page);
        staffEditorPage = new StaffEditorPage(page);
    });

    test("should go to user settings, change email, log out and then try to log in with old email, then with new email", async () => {
        await page.screenshot({path: utilities.generateScreenshotPath(screenshotNumber++)});
        //Given I log in
        await login.signInWith(Env.USER, Env.PASS);
        await page.screenshot({path: utilities.generateScreenshotPath(screenshotNumber++)});
        //When I enter the user profile settings
        await home.clickUserMenu();
        await page.screenshot({path: utilities.generateScreenshotPath(screenshotNumber++)});
        await home.clickUserProfileLink();
        await staffEditorPage.eleSaveButton;
        await page.screenshot({path: utilities.generateScreenshotPath(screenshotNumber++)});
        await staffEditorPage.refillEmail('marcos@fakemail.co');
        await page.screenshot({path: utilities.generateScreenshotPath(screenshotNumber++)});
        await staffEditorPage.clickSaveButton();
        await new Promise(r => setTimeout(r, 1500));
        await page.screenshot({path: utilities.generateScreenshotPath(screenshotNumber++)});
        await staffEditorPage.clickCloseNotification();
        await page.screenshot({path: utilities.generateScreenshotPath(screenshotNumber++)});
       
        // When I log out
        await home.clickUserMenu();
        await page.screenshot({path: utilities.generateScreenshotPath(screenshotNumber++)});
        await home.clickSignoutLink();
        await page.screenshot({path: utilities.generateScreenshotPath(screenshotNumber++)});
        //Then the old email won't work
        await login.enterEmailAddress(Env.USER);
        await page.screenshot({path: utilities.generateScreenshotPath(screenshotNumber++)});
        await login.enterPassword(Env.PASS);
        await page.screenshot({path: utilities.generateScreenshotPath(screenshotNumber++)});
        await login.clickSignIn();
        expect(await login.eleInvalidUserText).toBeTruthy();
        await new Promise(r => setTimeout(r, 1000));
        await page.screenshot({path: utilities.generateScreenshotPath(screenshotNumber++)});
        //Then the new email will work
        await login.reenterEmailAddress('marcos@fakemail.co');
        await page.screenshot({path: utilities.generateScreenshotPath(screenshotNumber++)});
        await login.reenterPassword(Env.PASS);
        await page.screenshot({path: utilities.generateScreenshotPath(screenshotNumber++)});
        await login.clickRetry();
        await new Promise(r => setTimeout(r, 2000));
        await page.screenshot({path: utilities.generateScreenshotPath(screenshotNumber++)});
    });

    test.afterAll(async () => {
        await home.clickUserMenu();
        await home.clickUserProfileLink();
        await staffEditorPage.eleSaveButton;
        await staffEditorPage.refillEmail(Env.USER);
        await staffEditorPage.clickSaveButton();
        await page.close();
        await context.close();
        await browser.close();
    })

});