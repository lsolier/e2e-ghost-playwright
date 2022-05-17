import { Browser, BrowserContext, chromium, Page } from "playwright";
import HomePage from "../page-object/home.page";
import LoginPage from "../page-object/login.page";
import Env from "../util/environment";
import StaffPage from "../page-object/staff.page";
import StaffEditorPage from "../page-object/staff-editor.page";

import { test, expect } from '@playwright/test';
import Utilities from "../util/utilities";

let screenshotNumber = 1;

test.describe("PA019 - Suspender a un usuario activo", () => {

    let browser: Browser;
    let context: BrowserContext;
    let page: Page;
    let utilities: Utilities;

    //My pageObjects
    let login: LoginPage;
    let home: HomePage;
    let staff: StaffPage;
    let staffEditor: StaffEditorPage;

    test.beforeAll( async() => {
        browser = await chromium.launch({
            headless: Env.HEADLESS,
        });
        context = await browser.newContext({ viewport: { width: 1200, height: 600 } });
        page = await context.newPage();
        utilities = new Utilities("PA019");

        //TODO GIVEN url tol login
        await page.goto(Env.BASE_URL + Env.ADMIN_SECTION);
        await page.waitForSelector("input[name='identification']");
        login = new LoginPage(page);
        home = new HomePage(page);
        staff = new StaffPage(page);
        staffEditor = new StaffEditorPage(page);
    });

    test.beforeEach( async() => {
        await page.screenshot({path: utilities.generateScreenshotPath(screenshotNumber++)});
        //TODO WHEN I log in
        await login.signInWith(Env.USER, Env.PASS);
        await page.screenshot({path: utilities.generateScreenshotPath(screenshotNumber++)});
        //TODO WHEN I navigate to Page module
        await home.clickStaffLink();
        //TODO THEN I expected that url will updated
        expect(page.url()).toContain("/#/staff");
        await page.screenshot({path: utilities.generateScreenshotPath(screenshotNumber++)});

        const userSuspendedLinkFound = await staff.findUserWithNameAndStatus("Ghost", "SUSPENDED");
        if ( !(typeof userSuspendedLinkFound === 'undefined')) {
            //TODO WHEN I navigate to user detail to suspend
            await staff.navigateToUserDetailWithLink(userSuspendedLinkFound);
            await page.screenshot({path: utilities.generateScreenshotPath(screenshotNumber++)});

            //TODO WHEN I suspend user
            await staffEditor.clickUserUnSuspendConfigurationButton();
            await page.screenshot({path: utilities.generateScreenshotPath(screenshotNumber++)});
            await staffEditor.clickUnSuspendUserButton();
            await page.screenshot({path: utilities.generateScreenshotPath(screenshotNumber++)});
            await staffEditor.clickUnSuspendUserConfirmationButton();
            await page.screenshot({path: utilities.generateScreenshotPath(screenshotNumber++)});

            //TODO WHEN I navigate to Page module
            await home.clickStaffLink();
            await page.screenshot({path: utilities.generateScreenshotPath(screenshotNumber++)});

        }
    } )

    test("should suspend user and verify if user is suspended - positive scenario", async () => {

        //TODO WHEN I select guest user and expect found it
        const userLinkFound = await staff.findUserWithName("Ghost");
        expect(userLinkFound).not.toBeUndefined();

        //TODO WHEN I navigate to user detail to suspend
        await staff.navigateToUserDetailWithLink(userLinkFound);
        await page.screenshot({path: utilities.generateScreenshotPath(screenshotNumber++)});

        //TODO WHEN I suspend user
        await staffEditor.clickUserSuspendConfigurationButton();
        await page.screenshot({path: utilities.generateScreenshotPath(screenshotNumber++)});
        await staffEditor.clickSuspendUserButton();
        await page.screenshot({path: utilities.generateScreenshotPath(screenshotNumber++)});
        await staffEditor.clickSuspendUserConfirmationButton();
        await page.screenshot({path: utilities.generateScreenshotPath(screenshotNumber++)});

        //TODO WHEN I navigate to Page module
        await home.clickStaffLink();

        //TODO THEN I expected to found user suspended
        const userSuspendedLinkFound = await staff.findUserWithNameAndStatus("Ghost", "SUSPENDED");
        expect(userSuspendedLinkFound).not.toBeUndefined();
    });

    test.afterEach(async() => {
        const userSuspendedLinkFound = await staff.findUserWithNameAndStatus("Ghost", "SUSPENDED");
        if ( !(typeof userSuspendedLinkFound === 'undefined')) {
            //TODO WHEN I navigate to user detail to suspend
            await staff.navigateToUserDetailWithLink(userSuspendedLinkFound);
            await page.screenshot({path: utilities.generateScreenshotPath(screenshotNumber++)});

            //TODO WHEN I suspend user
            await staffEditor.clickUserUnSuspendConfigurationButton();
            await page.screenshot({path: utilities.generateScreenshotPath(screenshotNumber++)});
            await staffEditor.clickUnSuspendUserButton();
            await page.screenshot({path: utilities.generateScreenshotPath(screenshotNumber++)});
            await staffEditor.clickUnSuspendUserConfirmationButton();
            await page.screenshot({path: utilities.generateScreenshotPath(screenshotNumber++)});

            //TODO WHEN I navigate to Page module
            await home.clickStaffLink();
            await page.screenshot({path: utilities.generateScreenshotPath(screenshotNumber++)});

        }
    })

    test.afterAll(async () => {
        await page.close();
        await context.close();
        await browser.close()
    })

});