import { Browser, BrowserContext, chromium, Page } from "playwright";
import HomePage from "../../page/home.page";
import LoginPage from "../../page/login.page";
import PostEditorPage from "../../page/post-editor.page";
import PostPage from "../../page/post.page";
import Env from "../../util/environment";

describe("Create a post", () => {

    let browser: Browser;
    let context: BrowserContext;
    let page: Page;

    //My page
    let login: LoginPage;
    let home: HomePage;
    let post: PostPage;
    let postEditor: PostEditorPage;

    beforeAll( async () => {
        browser = await chromium.launch({
            headless: Env.headless
        });
        context = await browser.newContext();
        page = await context.newPage();
        await page.goto(Env.baseUrl + Env.adminSection);
        //Instance pages
        login = new LoginPage(page);
        home = new HomePage(page);
        post = new PostPage(page);
        postEditor = new PostEditorPage(page);
    });

    test("shoul create a post - positive scenario", async () => {
        await login.signInWith(Env.user, Env.pass);
        await home.clickPostsLink();
        expect(page.url()).toBe("http://localhost:2368/ghost/#/posts");
        await post.clickNewPostLink();
        expect(page.url()).toBe("http://localhost:2368/ghost/#/editor/post");
        //await postEditor.
        await browser.close();
    });

});