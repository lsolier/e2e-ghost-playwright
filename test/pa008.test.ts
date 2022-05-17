import { Browser, BrowserContext, chromium, Page } from "playwright";
import HomePage from "../page-object/home.page";
import LoginPage from "../page-object/login.page";
import TagPage from "../page-object/tag.page";
import TagEditorPage from "../page-object/tag-editor.page";
import PostPage from "../page-object/post.page";
import PostEditorPage from "../page-object/post-editor.page";
import Env from "../util/environment";

import { test, expect } from '@playwright/test';
import Utilities from "../util/utilities";

let screenshotNumber = 1;

test.describe("PA008 - Creación de tag y asignación a post", () => {

    let browser: Browser;
    let context: BrowserContext;
    let page: Page;
    let utilities: Utilities;

    //My pageObjects
    let login: LoginPage;
    let home: HomePage;
    let tags: TagPage;
    let tagEditor: TagEditorPage;
    let posts: PostPage;
    let postEditor: PostEditorPage;

    test.beforeAll( async() => {
        browser = await chromium.launch({
            headless: Env.HEADLESS
        });
        context = await browser.newContext({ viewport: { width: 1200, height: 600 } });
        page = await context.newPage();
        utilities = new Utilities("PA008");

        //TODO GIVEN url tol login
        await page.goto(Env.BASE_URL + Env.ADMIN_SECTION);
        await page.waitForSelector("input[name='identification']");
        login = new LoginPage(page);
        home = new HomePage(page);
        tags = new TagPage(page);
        tagEditor = new TagEditorPage(page);
        posts = new PostPage(page);
        postEditor = new PostEditorPage(page);
    });

    test("should create tag and assign tag to post - positive scenario", async () => {
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

        //TODO WHEN I create a tag
        await tagEditor.fillTagName("Nombre tag con playwright");
        await tagEditor.fillTagSlug("Slug utilizando playwright");
        await tagEditor.fillTagDescription("Descripcion utilizando playwright");
        await tagEditor.clickButtonSave();
        await page.screenshot({path: utilities.generateScreenshotPath(screenshotNumber++)});
        await tagEditor.clickTagsLink();
        expect(page.url()).toContain("/#/tags");
        await page.screenshot({path: utilities.generateScreenshotPath(screenshotNumber++)});

        const linkCreatedTag = await tags.findPageByTitle("Nombre tag con playwright");
        expect(linkCreatedTag).not.toBeNull();

        await home.clickPostsLink();
        expect(page.url()).toContain("/#/posts");
        await page.screenshot({path: utilities.generateScreenshotPath(screenshotNumber++)});
        await posts.clickNewPostLink();
        expect(page.url()).toContain("/#/editor/post");
        await page.screenshot({path: utilities.generateScreenshotPath(screenshotNumber++)});

        //TODO WHEN I create a post
        await postEditor.fillPostTitle("Titulo de post utilizando playwright");
        await postEditor.fillPostContent("Contenido de post utilizando playwright");
        await page.screenshot({path: utilities.generateScreenshotPath(screenshotNumber++)});

        //TODO WHEN I set tag
        await postEditor.clickSettingButton();
        await page.screenshot({path: utilities.generateScreenshotPath(screenshotNumber++)});
        await postEditor.selectTagWithName("Nombre tag con playwright");
        await page.screenshot({path: utilities.generateScreenshotPath(screenshotNumber++)});
        await postEditor.clickCloseSetting();
        await page.screenshot({path: utilities.generateScreenshotPath(screenshotNumber++)});

        //TODO WHEN I publish the post
        await postEditor.clickPublishLink();
        await page.screenshot({path: utilities.generateScreenshotPath(screenshotNumber++)});
        await postEditor.clickPublishButton();
        await page.screenshot({path: utilities.generateScreenshotPath(screenshotNumber++)});
        await postEditor.clickPostsLink();
        await page.screenshot({path: utilities.generateScreenshotPath(screenshotNumber++)});

        //TODO THEN I expected the post will be published
        const linkScheduledPost = await posts.findPostByTitleAndStatus("Titulo de post utilizando playwright", "PUBLISHED");
        expect(linkScheduledPost).not.toBeNull();
    });

    test.afterAll(async () => {
        await page.close();
        await context.close();
        await browser.close()
    })

});