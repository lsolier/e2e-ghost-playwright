import { Page } from "playwright"

export default class LoginPage {
    
    private page: Page;

    constructor(page: Page) {
        this.page = page;
    }

    //selectores

    public get eleEmailAddressTextField() {
        const emailAddressText = this.page.waitForSelector("input[name='identification']");
        if(emailAddressText != null) {
            return emailAddressText;
        } else {
            throw new Error("No emailAddressText element");
        }
    }

    public get elePasswordTextField() {
        const passwordText = this.page.waitForSelector("input[name='password']");
        if(passwordText != null) {
            return passwordText;
        } else {
            throw new Error("No passwordText element");
        }
    }

    
    public get eleLoginBtn() {
        const loginBtn = this.page.waitForSelector("//span[contains(.,'Sign in')]");
        if(loginBtn != null) {
            return loginBtn;
        } else {
            throw new Error("No loginBtn element");
        }
    }

    public get eleIncorrectPasswordText() {
        const incorrectPasswordP = this.page.locator('p', { hasText: 'Your password is incorrect' });
        if(incorrectPasswordP != null) {
            return incorrectPasswordP;
        } else {
            throw new Error("No such title with the name");
        }
    }

    public get eleInvalidUserText() {
        const invalidUserText = this.page.locator('p', { hasText: 'There is no user with that email address' });
        if(invalidUserText != null) {
            return invalidUserText;
        } else {
            throw new Error("No such title with the name");
        }
    }

    public get eleRetryBtn() {
        const loginBtn = this.page.waitForSelector("//span[text()[normalize-space()='Retry']]");
        if(loginBtn != null) {
            return loginBtn;
        } else {
            throw new Error("No retry button element");
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

    public async reenterEmailAddress(user:string) {
        const ele = await this.eleEmailAddressTextField;
        await ele?.fill('');
        await ele?.fill(user);
    }

    public async reenterPassword(password:string) {
        const ele = await this.elePasswordTextField;
        await ele?.fill('');
        await ele?.fill(password);
    }

    public async clickRetry() {
        const ele = await this.eleRetryBtn;
        await ele?.click();
        await this.page.waitForNavigation();
    }
}