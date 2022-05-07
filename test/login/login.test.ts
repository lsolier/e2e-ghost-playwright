import { Browser, BrowserContext, chromium, Page } from "playwright";
import LoginPage from "../../page/login.page";
import Env from "../../util/environment";

describe("Login", () => {

    let browser: Browser;
    let context: BrowserContext;
    let page: Page;

    //My pages
    let login: LoginPage;

    beforeAll( async () => {
        browser = await chromium.launch({
            headless: Env.headless
        });
        context = await browser.newContext();
        page = await context.newPage();
        //GIVEN go to base url
        await page.goto(Env.baseUrl + Env.adminSection);
        login = new LoginPage(page);
    });

    test("should sing up - positive scenario", async () => {


        //WHEN type the user and password
        await login.singInWith(Env.user, Env.pass);

        //THEN I expected to see the site
        expect(page.url()).toBe("http://localhost:2368/ghost/#/site");
        await browser.close();
    });

});