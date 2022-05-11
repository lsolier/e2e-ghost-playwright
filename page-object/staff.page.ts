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

    public get eleRevokeLink() {
        const errorMessageDiv = this.page.$("//a[text()[normalize-space()='Revoke']]");
        if(errorMessageDiv != null) {
            return errorMessageDiv;
        } else {
            throw new Error("No ErrorMessageDiv element");
        }
    }

    private async listInvitationsDiv() {
        await this.page.waitForSelector("//div[@class='apps-grid-cell']");
        const errorMessageDiv = this.page.$$("//div[@class='apps-grid-cell']");
        if(errorMessageDiv != null) {
            return errorMessageDiv;
        } else {
            throw new Error("No InvitationsDiv element");
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

    public async clickRevokeLinkOfEmail(email: string) {
        const listInvitations = await this.listInvitationsDiv();
        console.log("Total invitations: " + listInvitations.length);

        const allRevokes = await Promise.all(listInvitations
            .map(async (invitation, i) => {
                const elementText = await invitation.innerText();
                if(elementText.includes(email)) {
                    return await invitation.$("//a[text()[normalize-space()='Revoke']]");
                }
            })
        );

        const filteredAllRevokes = allRevokes.filter(elm => elm);
        if(filteredAllRevokes[0]?.getAttribute('onclick')!=null){
            await filteredAllRevokes[0]?.click();
            await this.page.waitForSelector("//span[text()='Invitation revoked']");
        }

    }

    public async validateInvitationDoesNotExistWithEmail(email: string) {
        const listInvitations = await this.listInvitationsDiv();

        const isInvitationFound = await Promise.all(listInvitations
            .map(async (invitation, i) => {
                const elementText = await invitation.innerText();
                return await elementText.includes(email);
            })
        );

        console.log("esto: "+ isInvitationFound);
        return isInvitationFound.some(ele => ele);
    }
}