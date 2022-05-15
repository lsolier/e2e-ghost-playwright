import { Browser, BrowserContext, chromium, Page } from "playwright";
import HomePage from "../page-object/home.page";
import LoginPage from "../page-object/login.page"
import PageGhostPage from "../page-object/page-ghost.page";
import PageEditorPage from "../page-object/page-editor.page";
import DesignPage from "../page-object/design.page";
import Env from "../util/environment";
import Util from "../util/util";

import { test, expect } from '@playwright/test';
import SitePage from "../page-object/site.page";

let screenshotNumber = 0;

test.describe("PA006 - ", () => {

    let browser: Browser;
    let context: BrowserContext;
    let page: Page;

    //My pageObjects
    let login: LoginPage;
    let home: HomePage;
    let pageGhost: PageGhostPage;
    let pageEditor: PageEditorPage;
    let design: DesignPage;
    let site: SitePage;

    test.beforeAll( async() => {
        browser = await chromium.launch({
            headless: Env.HEADLESS
        });
        context = await browser.newContext({ viewport: { width: 1200, height: 600 } });
        page = await context.newPage();

        //TODO GIVEN url tol login
        await page.goto(Env.BASE_URL + Env.ADMIN_SECTION);
        await page.screenshot({path: `${Env.SCREENSHOT_FOLDER}${Util.getScreenName(screenshotNumber++)}`});
        login = new LoginPage(page);
        home = new HomePage(page);
        pageGhost = new PageGhostPage(page);
        pageEditor = new PageEditorPage(page);
        design = new DesignPage(page);
        site = new SitePage(page);
    });

    test("should create a page, assign page to navbar, verify navbar work in home page, edit page title, edit navbar link and finally verify if home page show nav bar correctly - positive scenario", async () => {        //TODO WHEN I log in
        await login.signInWith(Env.USER, Env.PASS);
        //TODO WHEN I navigate to Page module
        await home.clickPagesLink();
        //TODO THEN I expected that url will updated
        expect(page.url()).toContain("/#/pages");

        //TODO WHEN I navigate to Page Editor
        await pageGhost.clickNewPageLink();
        expect(page.url()).toContain("/#/editor/page");

        //TODO WHEN I create a page
        await pageEditor.fillPageTitle("title-pa006");
        await pageEditor.fillPostContent("Contenido de pagina utilizando playwright");
        await pageEditor.clickPublishLink();
        await pageEditor.clickPublishButton();
        await pageEditor.clickPagesLink();
        //TODO THEN I expected is there the page in general list
        const linkCreatedPage = await pageGhost.findPageByTitle("title-pa006");
        expect(linkCreatedPage).not.toBeNull();

        //TODO WHEN I navigate to design page
        await home.clickDesignLink();

        //TODO WHEN I crate a navbar
        await design.fillLabelForNewNav("NAV PA006");
        await design.fillUrlForNewNav("title-pa006");
        await design.clickAddNewNavButton();
        await design.clickSaveButton();

        //TODO WHEN I navigate to home page in order to see the navbar work
        await home.clickViewSiteLink();
        const linkNavCreated = await site.findNavByTitle("NAV PA006");
        expect(linkNavCreated).not.toBeNull();
        await site.navigateToNavLink(linkNavCreated);
        expect(await site.isThereDescriptionWith("Contenido de pagina utilizando playwright")).toBe(true);

        //TODO WHEN I navigate to Page module
        await home.clickPagesLink();
        //TODO THEN I expected that url will updated
        expect(page.url()).toContain("/#/pages");

        //TODO THEN I expected is there the page in general list
        const linkCreatedPageSearch2 = await pageGhost.findPageByTitle("title-pa006");
        expect(linkCreatedPageSearch2).not.toBeNull();
        //TODO WHEN I edited the created page before
        await pageGhost.navigateToEditionLink(linkCreatedPageSearch2);
        await pageEditor.fillPageTitle("title-pa006-edited");
        //TODO EDIT page link
        await pageEditor.updatePageURLWith("title-pa006-edited");
        await pageEditor.clickUpdateLink();
        await pageEditor.clickUpdateButton();
        await pageEditor.clickPagesLink();
        //TODO THEN I expected is there the edited page in general list
        const linkEditedPage = await pageGhost.findPageByTitle("title-pa006-edited");
        expect(linkEditedPage).not.toBeNull();

        //TODO WHEN I navigate to design page
        await home.clickDesignLink();

        //TODO WHEN I edit the navbar created
        await design.updateNavBar("NAV PA006", "NAV PA006 EDITED",Env.BASE_URL+"/title-pa006-edited");

        //TODO WHEN I navigate to home page in order to see if navbar works
        await home.clickViewSiteLink();
        const linkNavEdited = await site.findNavByTitle("NAV PA006 EDITED");
        expect(linkNavEdited).not.toBeNull();
        await site.navigateToNavLink(linkNavEdited);

        //TODO THEN I navigate to home page in order to see the navbar work
        expect(await site.isThereDescriptionWith("Contenido de pagina utilizando playwright")).toBe(true);
    });

    test.afterAll(async () => {
        //TODO THEN I delete the created page
        await home.clickPagesLink();
        expect(page.url()).toContain("/#/pages");
        const linkCreatedPage = await pageGhost.findPageByTitle("title-pa006");
        expect(linkCreatedPage).not.toBeNull();
        await pageGhost.navigateToEditionLink(linkCreatedPage)
        await pageEditor.deletePage();

        //TODO THEN I delete the created page
        await home.clickDesignLink();
        await design.deleteNavBar("NAV PA006");

        await page.close();
        await context.close();
        await browser.close()
    })

});