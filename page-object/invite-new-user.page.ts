import { Page } from "playwright";

export default class InviteNewUserPage {

    private page: Page;

    constructor(page: Page) {
        this.page = page;
    }

    //selectores
    public get eleEmailAddressInput() {
        const emailAddress = this.page.$("//input[@placeholder='Email Address']");
        if(emailAddress != null) {
            return emailAddress;
        } else {
            throw new Error("No EmailAddressInput element");
        }
    }

    public get eleRoleDropDown() {
        const roleDropDown = this.page.$("select[name='role']");
        if(roleDropDown != null) {
            return roleDropDown;
        } else {
            throw new Error("No RoleDropDown element");
        }
    }

    public get roleList() {
        const roleList = this.page.$$("span select option");
        if(roleList != null) {
            return roleList;
        } else {
            throw new Error("No roleList element");
        }
    }

    public get eleSendInvitationButton() {
        const sendInvitation = this.page.$("//span[text()='Send invitation now']");
        if(sendInvitation != null) {
            return sendInvitation;
        } else {
            throw new Error("No roleList element");
        }
    }

    //actuadores
    public async fillEmailAddress(emailAddress: string) {
        const ele = await this.eleEmailAddressInput;
        await ele?.fill(emailAddress);
    }

    public async selectRoleByName(roleName: string) {
        const roleDropDown = await this.eleRoleDropDown;
        await roleDropDown?.selectOption({ label: roleName });
    }

    public async clickSendInvitationButton() {
        const ele = await this.eleSendInvitationButton;
        await ele?.click();
    }
}