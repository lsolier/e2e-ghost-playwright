import { Browser, BrowserContext, chromium, Page } from "playwright";
import HomePage from "../page-object/home.page";
import LoginPage from "../page-object/login.page";
import PostPage from "../page-object/post.page";
import PostEditorPage from "../page-object/post-editor.page";
import Env from "../util/environment";

import { test, expect } from '@playwright/test';

test.describe("PA013 - ", () => {

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
            headless: Env.headless,
        });
        context = await browser.newContext({ viewport: { width: 1200, height: 600 } });
        page = await context.newPage();

        //TODO GIVEN url tol login
        await page.goto(Env.baseUrl + Env.adminSection);
        login = new LoginPage(page);
        home = new HomePage(page);
        posts = new PostPage(page);
        postEditor = new PostEditorPage(page);
    });

    test("should create post , keep in draft and finally delete post - positive scenario", async () => {
        //TODO WHEN I log in
        await login.signInWith(Env.user, Env.pass);
        await home.clickPostsLink();
        expect(page.url()).toContain("/#/posts");
        await posts.clickNewPostLink();
        expect(page.url()).toContain("/#/editor/post");

        //TODO WHEN I create a post
        await postEditor.fillPostTitle("Titulo de post utilizando playwright");
        await postEditor.fillPostContent("Contenido de post utilizando playwright");

        //TODO WHEN I draft the post
        await postEditor.clickPostsLink();
        //await postEditor.clickLeaveButton();

        //TODO THEN I expected the post will be draft status
        const linkDraftPost = await posts.findPageByTitleAndStatus("Titulo de post utilizando playwright", "DRAFT");
        expect(linkDraftPost).not.toBeNull();

        //TODO WHEN I delete the post
        await posts.navigateToEditionLink(linkDraftPost);
        await postEditor.clickSettingButton();
        await postEditor.clickDeletePostButton();
        await postEditor.clickConfirmationDeletePostButton();

        //TODO THEN I expected the post will be deleted
        const linkDeletedPost = await posts.findPageByTitleAndStatus("Titulo de post utilizando playwright", "DRAFT");
        expect(linkDeletedPost).toBeUndefined();
    });

    test.afterAll(async () => {
        await page.close();
        await context.close();
        await browser.close()
    })

});