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

    public get invitedUserTitle() {
        const ele = this.page.$("//span[text()='Invited users']");
        if(ele != null) {
            return ele;
        } else {
            throw new Error("No invitedUserTitle element");
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

    private async activeUserListDiv() {
        await this.page.waitForSelector("//div[@class='apps-grid-cell tooltip-centered']");
        const elements = this.page.$$("//section[@class='apps-grid-container gh-active-users ' and ./span/text()='Active users' ]//div//div[@class='apps-grid-cell tooltip-centered']");
        if(elements != null) {
            return elements;
        } else {
            throw new Error("No InvitationsDiv element");
        }
    }

    private async suspendedUserListDiv() {
        await this.page.waitForSelector("//div[@class='apps-grid-cell tooltip-centered']");
        const errorMessageDiv = this.page.$$("//section[@class='apps-grid-container gh-active-users' and ./span/text()='Suspended users']//div//div[@class='apps-grid-cell tooltip-centered']");
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

    public async findUserWithName(name: string) {
        const userList = await this.activeUserListDiv();
        console.log("Total users: " + userList.length);

        const allUserLink = await Promise.all(userList
            .map(async (user, i) => {
                const elementText = await user.innerText();
                if(elementText.includes(name)) {
                    return await user.$("a");
                }
            })
        );

        const filteredAllUserLink = allUserLink.filter(elm => elm);
        console.log("User name link selected: " + filteredAllUserLink[0]);
        return filteredAllUserLink[0];
    }

    public async findUserWithNameAndStatus(name: string, status: string) {
        let userList: any;
        switch(status) {
            case 'SUSPENDED': {
                userList = await this.suspendedUserListDiv();
                break;
            }
            default: {
                userList = await this.activeUserListDiv();
                break;
            }
        }

        console.log("Total users name and status: " + userList.length);

        const allUserLink = await Promise.all(userList
            .map(async (user: any, i: any) => {
                const elementText = await user.innerText();
                if(elementText.includes(name) && elementText.includes(status)) {
                    return await user.$("a");
                }
            })
        );

        const filteredAllUserLink = allUserLink.filter(elm => elm);
        console.log("User  name and status link selected: " + filteredAllUserLink[0]);
        return filteredAllUserLink[0];
    }

    public async navigateToUserDetailWithLink(link: any) {
        const href = await link.getAttribute("href");
        const formattedHref = href.substring(0,href.length-1)
        await link.click();
        await this.page.waitForURL(`**/${formattedHref}`);
    }

    public async validateErrorMessageContain(text: string) {
        await this.page.waitForSelector("div.gh-alert-content");
        const errorMessageDiv = await this.eleErrorMessageDiv;
        const errorMessageText = await errorMessageDiv?.innerText();
        return errorMessageText?.includes(text);
    }

    public async clickRevokeLinkOfEmail(email: string) {
        await this.page.waitForSelector("//span[text()='Active users']");
        const invitedUserTitle = await this.invitedUserTitle;
        if(invitedUserTitle) {
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



    }

    public async validateIfIsThereInvitationWithEmail(email: string) {
        const invitedUserTitle = await this.invitedUserTitle;
        if (invitedUserTitle) {
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
        return false;

    }
}