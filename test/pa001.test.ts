import { Browser, BrowserContext, chromium, Page } from "playwright";
import HomePage from "../page-object/home.page";
import LoginPage from "../page-object/login.page"
import PageGhostPage from "../page-object/page-ghost.page";
import PageEditorPage from "../page-object/page-editor.page";
import Env from "../util/environment";

import { test, expect } from '@playwright/test';
import Utilities from "../util/utilities";

let screenshotNumber = 1;

test.describe("PA001 - Edición de página", () => {

    let browser: Browser;
    let context: BrowserContext;
    let page: Page;
    let utilities: Utilities;

    //My pageObjects
    let login: LoginPage;
    let home: HomePage;
    let pageGhost: PageGhostPage;
    let pageEditor: PageEditorPage;

    test.beforeAll( async() => {
        browser = await chromium.launch({
            headless: Env.HEADLESS
        });
        context = await browser.newContext({ viewport: { width: 1200, height: 600 } });
        page = await context.newPage();
        utilities = new Utilities("PA001");

        //TODO GIVEN url tol login
        await page.goto(Env.BASE_URL + Env.ADMIN_SECTION);
        await page.waitForSelector("input[name='identification']");
        login = new LoginPage(page);
        home = new HomePage(page);
        pageGhost = new PageGhostPage(page);
        pageEditor = new PageEditorPage(page);
    });

    test("should create and edit a page - positive scenario", async () => {
        await page.screenshot({path: utilities.generateScreenshotPath(screenshotNumber++)});
        //TODO WHEN I log in
        await login.signInWith(Env.USER, Env.PASS);
        await page.screenshot({path: utilities.generateScreenshotPath(screenshotNumber++)});
        //TODO WHEN I navigate to Page module
        await home.clickPagesLink();
        await page.screenshot({path: utilities.generateScreenshotPath(screenshotNumber++)});
        //TODO THEN I expected that url will updated
        expect(page.url()).toContain("/#/pages");
        await pageGhost.clickNewPageLink();
        await page.screenshot({path: utilities.generateScreenshotPath(screenshotNumber++)});
        expect(page.url()).toContain("/#/editor/page");
        await pageEditor.fillPageTitle("Titulo de pagina utilizando playwright");
        await pageEditor.fillPostContent("Contenido de pagina utilizando playwright");
        await page.screenshot({path: utilities.generateScreenshotPath(screenshotNumber++)});
        await pageEditor.clickPublishLink();
        await pageEditor.clickPublishButton();
        await page.screenshot({path: utilities.generateScreenshotPath(screenshotNumber++)});
        await pageEditor.clickPagesLink();
        await page.screenshot({path: utilities.generateScreenshotPath(screenshotNumber++)});
        const linkCreatedPage = await pageGhost.findPageByTitle("Titulo de pagina utilizando playwright");
        expect(linkCreatedPage).not.toBeNull();
        await pageGhost.navigateToEditionLink(linkCreatedPage);
        await page.screenshot({path: utilities.generateScreenshotPath(screenshotNumber++)});
        await pageEditor.fillPageTitle("Titulo de pagina editado utilizando playwright");
        await pageEditor.fillPostContent("Contenido de pagina editado utilizando playwright");
        await page.screenshot({path: utilities.generateScreenshotPath(screenshotNumber++)});
        await pageEditor.clickUpdateLink();
        await pageEditor.clickUpdateButton();
        await page.screenshot({path: utilities.generateScreenshotPath(screenshotNumber++)});
        await pageEditor.clickPagesLink();
        await page.screenshot({path: utilities.generateScreenshotPath(screenshotNumber++)});
        const linkEditedPage = await pageGhost.findPageByTitle("Titulo de pagina editado utilizando playwright");
        expect(linkEditedPage).not.toBeNull();
    });

    test.afterAll(async () => {
        //TODO THEN I delete page in order to clean test
        const pageToDelete = await pageGhost.findPageByTitle("Titulo de pagina editado utilizando playwright");
        expect(pageToDelete).not.toBeNull();
        await pageGhost.navigateToEditionLink(pageToDelete);
        await pageEditor.deletePage();

        await page.close();
        await context.close();
        await browser.close()
    })

});