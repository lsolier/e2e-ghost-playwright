import { Browser, BrowserContext, chromium, Page } from "playwright";
import HomePage from "../page-object/home.page";
import LoginPage from "../page-object/login.page"
import PostPage from "../page-object/post.page";
import PostEditorPage from "../page-object/post-editor.page";
import Env from "../util/environment";

import { test, expect } from '@playwright/test';
import Utilities from "../util/utilities";

let screenshotNumber = 1;

test.describe("PA002 - Publicación programada de página", () => {

    let browser: Browser;
    let context: BrowserContext;
    let page: Page;
    let utilities: Utilities;

    //My pageObjects
    let login: LoginPage;
    let home: HomePage;
    let posts: PostPage;
    let postEditor: PostEditorPage;

    test.beforeAll( async() => {
        browser = await chromium.launch({
            headless: Env.HEADLESS
        });
        context = await browser.newContext({ viewport: { width: 1200, height: 600 } });
        page = await context.newPage();
        utilities = new Utilities("PA002");

        //TODO GIVEN url tol login
        await page.goto(Env.BASE_URL + Env.ADMIN_SECTION);
        await page.waitForSelector("input[name='identification']");
        login = new LoginPage(page);
        home = new HomePage(page);
        posts = new PostPage(page);
        postEditor = new PostEditorPage(page);
    });

    test("should schedule a post and validate the creation - positive scenario", async () => {
        await page.screenshot({path: utilities.generateScreenshotPath(screenshotNumber++)});
        await login.signInWith(Env.USER, Env.PASS);
        await page.screenshot({path: utilities.generateScreenshotPath(screenshotNumber++)});
        await home.clickPostsLink();
        expect(page.url()).toContain("/#/posts");
        await page.screenshot({path: utilities.generateScreenshotPath(screenshotNumber++)});
        await posts.clickNewPostLink();
        expect(page.url()).toContain("/#/editor/post");
        await page.screenshot({path: utilities.generateScreenshotPath(screenshotNumber++)});
        await postEditor.fillPostTitle("Titulo de post programado utilizando playwright");
        await postEditor.fillPostContent("Contenido de post programado utilizando playwright");
        await page.screenshot({path: utilities.generateScreenshotPath(screenshotNumber++)});
        await postEditor.clickPublishLink();
        await page.screenshot({path: utilities.generateScreenshotPath(screenshotNumber++)});
        await postEditor.updateTimeToPublish();
        await page.screenshot({path: utilities.generateScreenshotPath(screenshotNumber++)});
        await postEditor.clickPostsLink();
        await page.screenshot({path: utilities.generateScreenshotPath(screenshotNumber++)});
        const linkScheduledPost = await posts.findPostByTitleAndStatus("Titulo de post programado utilizando playwright", "SCHEDULED");
        expect(linkScheduledPost).not.toBeNull();
    });

    test.afterAll(async () => {
        //TODO WHEN I delete the post
        const linkScheduledPost = await posts.findPostByTitleAndStatus("Titulo de post programado utilizando playwright", "SCHEDULED");
        expect(linkScheduledPost).not.toBeNull();
        await posts.navigateToEditionLink(linkScheduledPost);
        await postEditor.clickSettingButton();
        await postEditor.clickDeletePostButton();
        await postEditor.clickConfirmationDeletePostButton();

        await page.close();
        await context.close();
        await browser.close()
    })

});