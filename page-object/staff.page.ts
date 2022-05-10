import { Page } from "playwright";

export default class StaffPage {

    private page: Page;

    constructor(page: Page) {
        this.page = page;
    }

    //selectores
    public get eleInvitePeopleButton() {
        const invitePeople = this.page.$("//span[text()='Invite people']");
        if(invitePeople != null) {
            return invitePeople;
        } else {
            throw new Error("No InvitePeopleButton element");
        }
    }

    public get eleErrorMessageDiv() {
        const errorMessageDiv = this.page.$("div.gh-alert-content");
        if(errorMessageDiv != null) {
            return errorMessageDiv;
        } else {
            throw new Error("No ErrorMessageDiv element");
        }
    }

    //actuadores

    public async clickInvitePeopleButton() {
        const ele = await this.eleInvitePeopleButton;
        await ele?.click();
        await this.page.waitForSelector("//h1[text()='Invite a New User']");
    }

    public async validateErrorMessageContain(text: string) {
        await this.page.waitForSelector("div.gh-alert-content");
        const errorMessageDiv = await this.eleErrorMessageDiv;
        const errorMessageText = await errorMessageDiv?.innerText();
        return errorMessageText?.includes(text);
    }
}