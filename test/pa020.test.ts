import { Browser, BrowserContext, chromium, Page } from "playwright";
import HomePage from "../page-object/home.page";
import LoginPage from "../page-object/login.page";
import Env from "../util/environment";
import StaffPage from "../page-object/staff.page";
import StaffEditorPage from "../page-object/staff-editor.page";

import { test, expect } from '@playwright/test';

test.describe("PA020 - ", () => {

    let browser: Browser;
    let context: BrowserContext;
    let page: Page;

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

        //TODO GIVEN url tol login
        await page.goto(Env.BASE_URL + Env.ADMIN_SECTION);
        login = new LoginPage(page);
        home = new HomePage(page);
        staff = new StaffPage(page);
        staffEditor = new StaffEditorPage(page);
    });

    test.beforeEach( async() => {
        //TODO WHEN I log in
        await login.signInWith(Env.USER, Env.PASS);
        //TODO WHEN I navigate to Page module
        await home.clickStaffLink();
        //TODO THEN I expected that url will updated
        expect(page.url()).toContain("/#/staff");

        const userSuspendedLinkFound = await staff.findUserWithNameAndStatus("Ghost", "SUSPENDED");
        if ( !(typeof userSuspendedLinkFound === 'undefined')) {
            //TODO WHEN I navigate to user detail to suspend
            await staff.navigateToUserDetailWithLink(userSuspendedLinkFound);

            //TODO WHEN I suspend user
            await staffEditor.clickUserUnSuspendConfigurationButton();
            await staffEditor.clickUnSuspendUserButton()
            await staffEditor.clickUnSuspendUserConfirmationButton();

            //TODO WHEN I navigate to Page module
            await home.clickStaffLink();

        }
    } )

    test("should suspend user, verify if user is suspended and finally un-suspend the user - positive scenario", async () => {

        //TODO WHEN I select guest user and expect found it
        const userLinkFound = await staff.findUserWithName("Ghost");
        expect(userLinkFound).not.toBeUndefined();

        //TODO WHEN I navigate to user detail to suspend
        await staff.navigateToUserDetailWithLink(userLinkFound);

        //TODO WHEN I suspend user
        await staffEditor.clickUserSuspendConfigurationButton();
        await staffEditor.clickSuspendUserButton()
        await staffEditor.clickSuspendUserConfirmationButton();

        //TODO WHEN I navigate to Page module
        await home.clickStaffLink();

        //TODO THEN I expected to found user suspended
        const userSuspendedLinkFound = await staff.findUserWithNameAndStatus("Ghost", "SUSPENDED");
        expect(userSuspendedLinkFound).not.toBeUndefined();

        //TODO WHEN I navigate to user detail to suspend
        await staff.navigateToUserDetailWithLink(userSuspendedLinkFound);

        //TODO WHEN I suspend user
        await staffEditor.clickUserUnSuspendConfigurationButton();
        await staffEditor.clickUnSuspendUserButton()
        await staffEditor.clickUnSuspendUserConfirmationButton();

        //TODO WHEN I navigate to Page module
        await home.clickStaffLink();

        //TODO THEN I expected to found user suspended
        const userUnSuspendedLinkFound = await staff.findUserWithNameAndStatus("Ghost", "");
        expect(userUnSuspendedLinkFound).not.toBeUndefined();
    });

    test.afterAll(async () => {
        await page.close();
        await context.close();
        await browser.close()
    })

});