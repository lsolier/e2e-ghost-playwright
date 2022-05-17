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

    public get eleSavedPasswordButton() {
        const ele = this.page.$("//button[text()='Saved']");
        if(ele != null) {
            return ele;
        } else {
            throw new Error("No Saved password element");
        }
    }

    public get eleChangePasswordButton() {
        const ele = this.page.$("//span[text()='Change Password']");
        //const ele = this.page.$("//button[text()[normalize-space()='Change Password']]");
        if(ele != null) {
            return ele;
        } else {
            throw new Error("No change password button element");
        }
    }

    public get eleCurrentPasswordInput() {
        const currentPasswordInput = this.page.$("//input[@autocomplete='current-password']");
        if(currentPasswordInput != null) {
            return currentPasswordInput;
        } else {
            throw new Error("No current password input element");
        }
    }

    public get eleNewPasswordInput() {
        const newPasswordInput = this.page.$("//input[@autocomplete='new-password']");
        if(newPasswordInput != null) {
            return newPasswordInput;
        } else {
            throw new Error("No new password input element");
        }
    }

    public get elePasswordVerificationInput() {
        const passwordVerificationInput = this.page.$("//input[@id='user-new-password-verification']");
        if(passwordVerificationInput != null) {
            return passwordVerificationInput;
        } else {
            throw new Error("No password verification input element");
        }
    }

    public get eleEmailInput() {
        //input[name*="email"]
        const emailInput = this.page.$("//input[@name='email']");
        if(emailInput != null) {
            return emailInput;
        } else {
            throw new Error("No email input element");
        }
    }

    public get eleNotificationCloseButton() {
        //cy.get('button[class*="gh-notification-close"]').click()
        const ele = this.page.$("//button[@class='gh-notification-close']");
        //const ele = this.page.$("//button[text()[normalize-space()='Change Password']]");
        if(ele != null) {
            return ele;
        } else {
            throw new Error("No Close notification button element");
        }
    }

    public get eleSaveButton() {
        const ele = this.page.$("//span[text()='Save']");
        if(ele != null) {
            return ele;
        } else {
            throw new Error("No Save button element");
        }
    }

    public get eleSavedButton() {
        const ele = this.page.$("//button[text()='Saved']");
        if(ele != null) {
            return ele;
        } else {
            throw new Error("No Saved button element");
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

    public async fillCurrentPaswordInput(password: string) {
        const currentPassInput = await this.eleCurrentPasswordInput;
        await currentPassInput?.fill(password);
    }

    public async fillNewPasswordInput(password: string) {
        //await new Promise(r => setTimeout(r, 500));
        const newPassInput = await this.eleNewPasswordInput;
        await newPassInput?.fill(password);
    }

    public async fillPasswordVerificationInput(password: string) {
        //await new Promise(r => setTimeout(r, 500));
        const passVerificationInput = await this.elePasswordVerificationInput;
        await passVerificationInput?.fill(password);
    }

    public async clickChangePasswordButton() {
        //await new Promise(r => setTimeout(r, 500));
        const changePasswordButton = await this.eleChangePasswordButton;
        await changePasswordButton?.click();
        await this.eleSaveButton;
        await this.page.waitForSelector("//span[text()='Password updated']");
    }

    public async clickSaveButton() {
        const saveButton = await this.eleSaveButton;
        await saveButton?.click();
        await this.eleSavedButton;
    }

    public async refillEmail(email:string) {
        const emailInput = await this.eleEmailInput;
        await emailInput?.fill(email);
    }

    public async clickCloseNotification() {
        const notificationCloseBtn = await this.eleNotificationCloseButton;
        await notificationCloseBtn?.click();
    }

}