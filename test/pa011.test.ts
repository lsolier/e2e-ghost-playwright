import { Browser, BrowserContext, chromium, Page } from "playwright";
import HomePage from "../page-object/home.page";
import LoginPage from "../page-object/login.page";
import PostPage from "../page-object/post.page";
import PostEditorPage from "../page-object/post-editor.page";
import Env from "../util/environment";

import { test, expect } from '@playwright/test';

test.describe("PA011 - ", () => {

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
            headless: Env.HEADLESS,
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

    test("should create post and delete post - positive scenario", async () => {
        //TODO WHEN I log in
        await login.signInWith(Env.USER, Env.PASS);
        await home.clickPostsLink();
        expect(page.url()).toContain("/#/posts");
        await posts.clickNewPostLink();
        expect(page.url()).toContain("/#/editor/post");

        //TODO WHEN I create a post
        await postEditor.fillPostTitle("Titulo de post pa011 utilizando playwright");
        await postEditor.fillPostContent("Contenido de post utilizando playwright");
        await postEditor.clickPublishLink();
        await postEditor.clickPublishButton();

        //TODO WHEN I return to post list
        await postEditor.clickPostsLink();

        //TODO THEN I expected the post will be published
        const linkPublishedPost = await posts.findPostByTitleAndStatus("Titulo de post pa011 utilizando playwright", "PUBLISHED");
        expect(linkPublishedPost).not.toBeNull();

        //TODO WHEN I delete the post
        await posts.navigateToEditionLink(linkPublishedPost);
        await postEditor.clickSettingButton();
        await postEditor.clickDeletePostButton();
        await postEditor.clickConfirmationDeletePostButton();

        //TODO THEN I expected the post will be deleted
        const linkDeletedPost = await posts.findPostByTitleAndStatus("Titulo de post pa011 utilizando playwright", "PUBLISHED");
        expect(linkDeletedPost).toBeUndefined();
    });

    test.afterAll(async () => {
        await page.close();
        await context.close();
        await browser.close()
    })

});