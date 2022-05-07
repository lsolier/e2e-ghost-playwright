import { Page } from "playwright"

export default class LoginPage {
    
    private page: Page;

    constructor(page: Page) {
        this.page = page;
    }

    //selectores

    public get eleEmailAddressTextField() {
        const emailAddressText = this.page.waitForSelector("input[placeholder='Email Address']");
        if(emailAddressText != null) {
            return emailAddressText;
        } else {
            throw new Error("No emailAddressText element");
        }
    }

    public get elePasswordTextField() {
        const passwordText = this.page.waitForSelector("input[placeholder='Password']");
        if(passwordText != null) {
            return passwordText;
        } else {
            throw new Error("No passwordText element");
        }
    }

    
    public get eleLoginBtn() {
        const loginBtn = this.page.waitForSelector("//span[text()[normalize-space()='Sign in']]");
        if(loginBtn != null) {
            return loginBtn;
        } else {
            throw new Error("No loginBtn element");
        }
    }

    //actuadores

    public async enterEmailAddress(user:string) {
        const ele = await this.eleEmailAddressTextField;
        await ele?.fill(user);
    }

    public async enterPassword(pass:string) {
        const ele = await this.elePasswordTextField;
        await ele?.fill(pass);
    }

    public async clickSignIn() {
        const ele = await this.eleLoginBtn;
        await ele?.click();
    }

    public async signInWith(user:string, pass:string) {
        await this.enterEmailAddress(user);
        await this.enterPassword(pass);
        await this.clickSignIn();
        await this.page.waitForNavigation();
    }
}