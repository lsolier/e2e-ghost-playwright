import { Browser, BrowserContext, chromium, Page } from "playwright";
import HomePage from "../page-object/home.page";
import LoginPage from "../page-object/login.page";
import TagPage from "../page-object/tag.page";
import TagEditorPage from "../page-object/tag-editor.page";
import Env from "../util/environment";

import { test, expect } from '@playwright/test';
import Utilities from "../util/utilities";

let screenshotNumber = 1;

test.describe("PA010 - Creación y edición de tag", () => {

    let browser: Browser;
    let context: BrowserContext;
    let page: Page;
    let utilities: Utilities;

    //My pageObjects
    let login: LoginPage;
    let home: HomePage;
    let tags: TagPage;
    let tagEditor: TagEditorPage;

    test.beforeAll( async() => {
        browser = await chromium.launch({
            headless: Env.HEADLESS
        });
        context = await browser.newContext({ viewport: { width: 1200, height: 600 } });
        page = await context.newPage();
        utilities = new Utilities("PA010");

        //TODO GIVEN url tol login
        await page.goto(Env.BASE_URL + Env.ADMIN_SECTION);
        login = new LoginPage(page);
        home = new HomePage(page);
        tags = new TagPage(page);
        tagEditor = new TagEditorPage(page);
    });

    test("should create tag and edit tag - positive scenario", async () => {
        await page.screenshot({path: utilities.generateScreenshotPath(screenshotNumber++)});
        //TODO WHEN I log in
        await login.signInWith(Env.USER, Env.PASS);
        await page.screenshot({path: utilities.generateScreenshotPath(screenshotNumber++)});
        //TODO WHEN I navigate to Page module
        await home.clickTagsLink();
        //TODO THEN I expected that url will updated
        expect(page.url()).toContain("/#/tags");
        await page.screenshot({path: utilities.generateScreenshotPath(screenshotNumber++)});
        await tags.clickNewTagLink();
        expect(page.url()).toContain("/#/tags/new");
        await page.screenshot({path: utilities.generateScreenshotPath(screenshotNumber++)});
        await tagEditor.fillTagName("Nombre tag con playwright");
        await page.screenshot({path: utilities.generateScreenshotPath(screenshotNumber++)});
        await tagEditor.fillTagSlug("Slug utilizando playwright");
        await page.screenshot({path: utilities.generateScreenshotPath(screenshotNumber++)});
        await tagEditor.fillTagDescription("Descripcion utilizando playwright");
        await page.screenshot({path: utilities.generateScreenshotPath(screenshotNumber++)});
        await tagEditor.clickButtonSave();
        await page.screenshot({path: utilities.generateScreenshotPath(screenshotNumber++)});
        await tagEditor.clickTagsLink();
        expect(page.url()).toContain("/#/tags");
        await page.screenshot({path: utilities.generateScreenshotPath(screenshotNumber++)});
        const linkCreatedTag = await tags.findPageByTitle("Nombre tag con playwright");
        expect(linkCreatedTag).not.toBeNull();
        await tags.navigateToEditionLink(linkCreatedTag);
        await page.screenshot({path: utilities.generateScreenshotPath(screenshotNumber++)});
        await tagEditor.fillTagName("Nombre tag editado con playwright");
        await page.screenshot({path: utilities.generateScreenshotPath(screenshotNumber++)});
        await tagEditor.clickButtonSave();
        await page.screenshot({path: utilities.generateScreenshotPath(screenshotNumber++)});
        await tagEditor.clickTagsLink();
        const linkEditedPage = await tags.findPageByTitle("Nombre tag editado con playwright");
        expect(linkEditedPage).not.toBeNull();
        await page.screenshot({path: utilities.generateScreenshotPath(screenshotNumber++)});
    });

    test.afterAll(async () => {
        await page.close();
        await context.close();
        await browser.close()
    })

});