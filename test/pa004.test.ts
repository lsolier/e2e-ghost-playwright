import { Browser, BrowserContext, chromium, Page } from "playwright";
import HomePage from "../page-object/home.page";
import LoginPage from "../page-object/login.page"
import PageGhostPage from "../page-object/page-ghost.page";
import PageEditorPage from "../page-object/page-editor.page";
import Env from "../util/environment";

import { test, expect } from '@playwright/test';

test.describe("PA004 - ", () => {

    let browser: Browser;
    let context: BrowserContext;
    let page: Page;

    //My pageObjects
    let login: LoginPage;
    let home: HomePage;
    let pageGhost: PageGhostPage;
    let pageEditor: PageEditorPage;

    test.beforeAll( async() => {
        browser = await chromium.launch({
            headless: Env.headless
        });
        context = await browser.newContext({ viewport: { width: 1200, height: 600 } });
        page = await context.newPage();

        //TODO GIVEN url tol login
        await page.goto(Env.baseUrl + Env.adminSection);
        login = new LoginPage(page);
        home = new HomePage(page);
        pageGhost = new PageGhostPage(page);
        pageEditor = new PageEditorPage(page);
    });

    test("should create and edit a page - positive scenario", async () => {
        //TODO WHEN I log in
        await login.signInWith(Env.user, Env.pass);
        //TODO WHEN I navigate to Page module
        await home.clickPagesLink();
        //TODO THEN I expected that url will updated
        expect(page.url()).toContain("/#/pages");

        await pageGhost.clickNewPageLink();
        expect(page.url()).toContain("/#/editor/page");

        await pageEditor.fillPageTitle("Titulo de pagina con caracteres especiales @$@@$^&%$@#$@# utilizando playwright");
        expect(await pageEditor.findErrorMessage()).toBeNull();
        await pageEditor.fillPostContent("Contenido de pagina con caracteres especiales utilizando playwright");
        await pageEditor.clickPublishLink();
        await pageEditor.clickPublishButton();
        await pageEditor.clickPagesLink();
        const linkCreatedPage = await pageGhost.findPageByTitle("Titulo de pagina con caracteres especiales @$@@$^&%$@#$@# utilizando playwright");
        expect(linkCreatedPage).not.toBeNull();
    });

    test.afterAll(async () => {
        await page.close();
        await context.close();
        await browser.close()
    })

});