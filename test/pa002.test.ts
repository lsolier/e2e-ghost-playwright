import { Browser, BrowserContext, chromium, Page } from "playwright";
import HomePage from "../page-object/home.page";
import LoginPage from "../page-object/login.page"
import PostPage from "../page-object/post.page";
import PostEditorPage from "../page-object/post-editor.page";
import Env from "../util/environment";

import { test, expect } from '@playwright/test';

test.describe("PA002 - ", () => {

    let browser: Browser;
    let context: BrowserContext;
    let page: Page;

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

        //TODO GIVEN url tol login
        await page.goto(Env.BASE_URL + Env.ADMIN_SECTION);
        login = new LoginPage(page);
        home = new HomePage(page);
        posts = new PostPage(page);
        postEditor = new PostEditorPage(page);
    });

    test("should schedule a post and validate the creation - positive scenario", async () => {
        await login.signInWith(Env.USER, Env.PASS);
        await home.clickPostsLink();
        expect(page.url()).toContain("/#/posts");
        await posts.clickNewPostLink();
        expect(page.url()).toContain("/#/editor/post");
        await postEditor.fillPostTitle("Titulo de post programado utilizando playwright");
        await postEditor.fillPostContent("Contenido de post programado utilizando playwright");
        await postEditor.clickPublishLink();
        await postEditor.updateTimeToPublish();
        await postEditor.clickPostsLink();
        const linkScheduledPost = await posts.findPostByTitleAndStatus("Titulo de post programado utilizando playwright", "SCHEDULED");
        expect(linkScheduledPost).not.toBeNull();
    });

    test.afterAll(async () => {
        await page.close();
        await context.close();
        await browser.close()
    })

});