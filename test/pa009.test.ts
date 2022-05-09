import { Browser, BrowserContext, chromium, Page } from "playwright";
import HomePage from "../page-object/home.page";
import LoginPage from "../page-object/login.page";
import TagPage from "../page-object/tag.page";
import TagEditorPage from "../page-object/tag-editor.page";
import Env from "../util/environment";

import { test, expect } from '@playwright/test';

test.describe("PA009 - ", () => {

    let browser: Browser;
    let context: BrowserContext;
    let page: Page;

    //My pageObjects
    let login: LoginPage;
    let home: HomePage;
    let tags: TagPage;
    let tagEditor: TagEditorPage;

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
        tags = new TagPage(page);
        tagEditor = new TagEditorPage(page);
    });

    test("should create tag and delete tag - positive scenario", async () => {
        //TODO WHEN I log in
        await login.signInWith(Env.user, Env.pass);
        //TODO WHEN I navigate to Page module
        await home.clickTagsLink();
        //TODO THEN I expected that url will updated
        expect(page.url()).toContain("/#/tags");

        await tags.clickNewTagLink();
        expect(page.url()).toContain("/#/tags/new");

        await tagEditor.fillTagName("Nombre tag pa009 con playwright");
        await tagEditor.fillTagSlug("Slug utilizando playwright");
        await tagEditor.fillTagDescription("Descripcion utilizando playwright");
        await tagEditor.clickButtonSave();
        await tagEditor.clickTagsLink();
        expect(page.url()).toContain("/#/tags");

        const linkCreatedTag = await tags.findPageByTitle("Nombre tag pa009 con playwright");
        expect(linkCreatedTag).not.toBeNull();

        await tags.navigateToEditionLink(linkCreatedTag);

        await tagEditor.clickDeleteButton();
        await tagEditor.clickConfirmationDeleteButton();
        expect(page.url()).toContain("/#/tags");

        const linkEditedPage = await tags.findPageByTitle("Nombre tag pa009 con playwright");
        expect(linkEditedPage).toBeUndefined();
    });

    test.afterAll(async () => {
        await page.close();
        await context.close();
        await browser.close()
    })

});