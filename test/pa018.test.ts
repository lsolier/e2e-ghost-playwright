import { Browser, BrowserContext, chromium, Page } from "playwright";
import HomePage from "../page-object/home.page";
import LoginPage from "../page-object/login.page";
import Env from "../util/environment";
import StaffPage from "../page-object/staff.page";
import InviteNewUserPage from "../page-object/invite-new-user.page";

import { test, expect } from '@playwright/test';

test.describe("PA018 - ", () => {

    let browser: Browser;
    let context: BrowserContext;
    let page: Page;

    //My pageObjects
    let login: LoginPage;
    let home: HomePage;
    let staff: StaffPage;
    let inviteNewUser: InviteNewUserPage;

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
        inviteNewUser = new InviteNewUserPage(page);
    });

    test("should send invitation and see error message and revoke invitation - positive scenario", async () => {
        //TODO WHEN I log in
        await login.signInWith(Env.USER, Env.PASS);
        //TODO WHEN I navigate to Page module
        await home.clickStaffLink();
        //TODO THEN I expected that url will updated
        expect(page.url()).toContain("/#/staff");

        await staff.clickInvitePeopleButton();

        //TODO WHEN I complete data for new User and send invitation
        await inviteNewUser.fillEmailAddress("luis.solier@hotmail.com");
        await inviteNewUser.selectRoleByName("Editor");
        await inviteNewUser.clickSendInvitationButton();

        //TODO THEN I expected to see error message
        const isErrorMessage = await staff.validateErrorMessageContain("Error sending email!");
        expect(isErrorMessage).toBe(true);

        //TODO WHEN I navigate to View Site
        await home.clickViewSiteLink();
        //TODO WHEN I navigate to Page module
        await home.clickStaffLink();
        await staff.clickRevokeLinkOfEmail("luis.solier@hotmail.com");

        //TODO THEN I expected email invitation does not exist
        const invitationExist = await staff.validateIfIsThereInvitationWithEmail("luis.solier@hotmail.com");
        expect(invitationExist).toBe(false);
    });

    test.afterAll(async () => {
        await page.close();
        await context.close();
        await browser.close()
    })

});