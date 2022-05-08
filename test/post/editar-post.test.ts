import { Browser, BrowserContext, chromium, Page } from "playwright";
import HomePage from "../../page-object/home.page";
import LoginPage from "../../page-object/login.page"
import PostEditorPage from "../../page-object/post-editor.page";
import PostPage from "../../page-object/post.page";
import Env from "../../util/environment";

import { test, expect } from '@playwright/test';

test.describe("Edit a post", () => {

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
            headless: Env.headless
        });
        context = await browser.newContext();
        page = await context.newPage();

        await page.goto(Env.baseUrl + Env.adminSection);
        login = new LoginPage(page);
        home = new HomePage(page);
        posts = new PostPage(page);
        postEditor = new PostEditorPage(page);
    });

    test("should edit a post - positive scenario", async () => {
        await login.signInWith(Env.user, Env.pass);
        await home.clickPostsLink();
        expect(page.url()).toBe("http://localhost:2368/ghost/#/posts");
        await posts.clickNewPostLink();
        expect(page.url()).toBe("http://localhost:2368/ghost/#/editor/post");
        await postEditor.fillPostTitle("Titulo de post utilizando playwright");
        await postEditor.fillPostContent("Contenido de post utilizando playwright");
        await postEditor.clickPublishLink();
        await postEditor.clickPublishButton();
        await postEditor.clickPostsLink();
        expect(await posts.getElePostTitle("Titulo de post utilizando playwright")).toBe(true);
        await browser.close();
    });

});