import { Browser, BrowserContext, chromium, Page } from "playwright";
import HomePage from "../page-object/home.page";
import LoginPage from "../page-object/login.page"
import PageGhostPage from "../page-object/page-ghost.page";
import PageEditorPage from "../page-object/page-editor.page";
import Env from "../util/environment";

import { test, expect } from '@playwright/test';
import DesignPage from "../page-object/design.page";
import ContentMainPage from "../page-object/content-main.page";
import ContentPagePage from "../page-object/content-page.page";
import Utilities from "../util/utilities";

let screenshotNumber = 1;

test.describe("PA005: Crear nueva página y enlazar con nuevo elemento navbar", () => {

    let browser: Browser;
    let context: BrowserContext;
    let page: Page;
    let utilities: Utilities;

    //pageObject variables
    let login: LoginPage;
    let home: HomePage;
    let pageGhost: PageGhostPage;
    let pageEditor: PageEditorPage;
    let design: DesignPage;
    let contentMain: ContentMainPage;
    let contentPage: ContentPagePage;

    test.beforeAll( async() => {
        browser = await chromium.launch({
            headless: Env.HEADLESS
        });
        context = await browser.newContext({ viewport: { width: 1200, height: 600 } });
        page = await context.newPage();
        utilities = new Utilities("PA005");

        //Given I navigate to admin module
        await page.goto(Env.BASE_URL + Env.ADMIN_SECTION);
        login = new LoginPage(page);
        home = new HomePage(page);
        pageGhost = new PageGhostPage(page);
        pageEditor = new PageEditorPage(page);
        design = new DesignPage(page);
        contentMain = new ContentMainPage(page);
        contentPage = new ContentPagePage(page);
    });

    test("should create a page and link to navbar item - Positive scenario", async () => {
        await page.screenshot({path: utilities.generateScreenshotPath(screenshotNumber++)});
        // Given I log in and navigate 
        await login.signInWith(Env.USER, Env.PASS);
        await page.screenshot({path: utilities.generateScreenshotPath(screenshotNumber++)});
        // Given I created my page to link
        await home.clickPagesLink();
        expect(page.url()).toContain("/#/pages");
        await page.screenshot({path: utilities.generateScreenshotPath(screenshotNumber++)});
        await pageGhost.clickNewPageLink();
        expect(page.url()).toContain("/#/editor/page");
        await page.screenshot({path: utilities.generateScreenshotPath(screenshotNumber++)});
        await pageEditor.fillPageTitle("PaginaAEnlazar");
        await page.screenshot({path: utilities.generateScreenshotPath(screenshotNumber++)});
        await pageEditor.fillPostContent("Érase una vez una página a enlazar");
        await page.screenshot({path: utilities.generateScreenshotPath(screenshotNumber++)});
        await pageEditor.clickPublishLink();
        await page.screenshot({path: utilities.generateScreenshotPath(screenshotNumber++)});
        await pageEditor.clickPublishButton();
        await page.screenshot({path: utilities.generateScreenshotPath(screenshotNumber++)});
        await pageEditor.clickPagesLink();
        const linkCreatedPage = await pageGhost.findPageByTitle("PaginaAEnlazar");
        expect(linkCreatedPage).not.toBeNull();
        await page.screenshot({path: utilities.generateScreenshotPath(screenshotNumber++)});
        // When I link the new page to a new nav item
        await home.clickDesignLink();
        await page.screenshot({path: utilities.generateScreenshotPath(screenshotNumber++)});
        await design.fillNewLabelInput("PaginaAEnlazar");
        await page.screenshot({path: utilities.generateScreenshotPath(screenshotNumber++)});
        await design.fillNewLinkInput("paginaAEnlazar");
        await page.screenshot({path: utilities.generateScreenshotPath(screenshotNumber++)});
        await design.clickSaveButton();
        await new Promise(r => setTimeout(r, 2000));
        await page.screenshot({path: utilities.generateScreenshotPath(screenshotNumber++)});
        
        // Then I can navigate to the new page through the navbar
        await page.goto(Env.BASE_URL);
        await page.screenshot({path: utilities.generateScreenshotPath(screenshotNumber++)});
        await contentMain.clickNavBarLink("paginaAEnlazar");
        await page.screenshot({path: utilities.generateScreenshotPath(screenshotNumber++)});
        await contentPage.elePageTitle("PaginaAEnlazar");
        await new Promise(r => setTimeout(r, 2000));
        await page.screenshot({path: utilities.generateScreenshotPath(screenshotNumber++)});
    });

    test.afterAll(async () => {
        await page.goto(Env.BASE_URL + Env.ADMIN_SECTION);
        await new Promise(r => setTimeout(r, 1500));
        await home.clickPagesLink();
        const linkCreatedPage = await pageGhost.findPageByTitle("PaginaAEnlazar");
        expect(linkCreatedPage).not.toBeNull();
        await pageGhost.navigateToEditionLink(linkCreatedPage);
        await pageEditor.clickSettingsButton();
        await pageEditor.clickDeleteButton();
        await pageEditor.clickConfirmDeleteButton();
        await page.waitForURL('**/#/pages');
        await home.clickDesignLink();
        await design.clickDeleteLastNavItemButton();
        await design.clickSaveButton();
        
        await page.close();
        await context.close();
        await browser.close();
    })

});