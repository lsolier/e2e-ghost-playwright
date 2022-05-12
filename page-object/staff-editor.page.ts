import { Page } from "playwright";

export default class StaffEditorPage {

    private page: Page;

    constructor(page: Page) {
        this.page = page;
    }

    //selectores

    public get eleUserConfigurationButton() {
        const ele = this.page.$("button.gh-btn.gh-btn-white.gh-btn-icon.only-has-icon.user-actions-cog");
        if(ele != null) {
            return ele;
        } else {
            throw new Error("No UserConfigurationButton element");
        }
    }

    public get eleSuspendUserButton() {
        const ele = this.page.$("//button[text()[normalize-space()='Suspend User']]");
        if(ele != null) {
            return ele;
        } else {
            throw new Error("No SuspendUserButton element");
        }
    }

    public get eleSuspendUserConfirmationButton() {
        const ele = this.page.$("div.modal-footer button.gh-btn.gh-btn-red.gh-btn-icon.ember-view");
        if(ele != null) {
            return ele;
        } else {
            throw new Error("No SuspendUserConfirmationButton element");
        }
    }

    public get eleUnSuspendUserButton() {
        const ele = this.page.$("//button[text()[normalize-space()='Un-suspend User']]");
        if(ele != null) {
            return ele;
        } else {
            throw new Error("No UnSuspendUserButton element");
        }
    }

    public get eleUnSuspendUserConfirmationButton() {
        const ele = this.page.$("div.modal-footer button.gh-btn.gh-btn-red.gh-btn-icon.ember-view");
        if(ele != null) {
            return ele;
        } else {
            throw new Error("No UnSuspendUserConfirmationButton element");
        }
    }

    //actuadores

    public async clickUserSuspendConfigurationButton(){
        const userConfiguration = await this.eleUserConfigurationButton;
        await userConfiguration?.click();
        await this.page.waitForSelector("//button[text()[normalize-space()='Suspend User']]")
    }

    public async clickUserUnSuspendConfigurationButton(){
        const userConfiguration = await this.eleUserConfigurationButton;
        await userConfiguration?.click();
        await this.page.waitForSelector("//button[text()[normalize-space()='Un-suspend User']]")
    }

    public async clickSuspendUserButton(){
        const suspendUserBtn = await this.eleSuspendUserButton;
        await suspendUserBtn?.click();
        await this.page.waitForSelector("//button[contains(text(),'Suspend')]");
    }

    public async clickSuspendUserConfirmationButton(){
        const suspendUserConfirmationBtn = await this.eleSuspendUserConfirmationButton;
        await suspendUserConfirmationBtn?.click();
        await this.page.waitForSelector("//span[text()='Saved']")
    }

    public async clickUnSuspendUserButton(){
        const suspendUserBtn = await this.eleUnSuspendUserButton;
        await suspendUserBtn?.click();
        await this.page.waitForSelector("//button[contains(text(),'Un-suspend')]");
    }

    public async clickUnSuspendUserConfirmationButton(){
        const suspendUserConfirmationBtn = await this.eleUnSuspendUserConfirmationButton;
        await suspendUserConfirmationBtn?.click();
        await this.page.waitForSelector("//span[text()='Saved']")
    }

}