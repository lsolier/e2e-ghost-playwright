import { Page } from "playwright";

export default class HomePage {

    private page: Page;

    constructor(page: Page) {
        this.page = page;
    }

    //selectores

    public get eleViewSiteLink() {
        const viewSiteLink = this.page.$("text='View site'");
        if(viewSiteLink != null) {
            return viewSiteLink;
        } else {
            throw new Error("No ViewSiteLink element");
        }
    }

    public get elePostsLink() {
        const postsLink = this.page.$("text='Posts'");
        if(postsLink != null) {
            return postsLink;
        } else {
            throw new Error("No postsLink element");
        }
    }

    public get elePagesLink() {
        const pagesLink = this.page.$("text='Pages'");
        if(pagesLink != null) {
            return pagesLink;
        } else {
            throw new Error("No pagesLink element");
        }
    }

    public get eleTagsLink() {
        const tagsLink = this.page.$("text='Tags'");
        if(tagsLink != null) {
            return tagsLink;
        } else {
            throw new Error("No tagsLink element");
        }
    }

    public get eleStaffLink() {
        const staffLink = this.page.$("text='Staff'");
        if(staffLink != null) {
            return staffLink;
        } else {
            throw new Error("No staffLink element");
        }
    }

    public get eleDesignLink() {
        const staffLink = this.page.$("text='Design'");
        if(staffLink != null) {
            return staffLink;
        } else {
            throw new Error("No staffLink element");
        }
    }

    public get eleUserMenu() {
        const menuDiv = this.page.$("div.gh-nav-bottom");
        if(menuDiv != null) {
            return menuDiv;
        } else {
            throw new Error("No user menu element");
        }
    }

    public get eleUserProfileLink() {
        const userProfileLink = this.page.$("//a[text()[normalize-space()='Your Profile']]");
        if(userProfileLink != null) {
            return userProfileLink;
        } else {
            throw new Error("No user profile link element");
        }
    }

    public get eleUserLogoutLink() {
        const userProfileLink = this.page.$("//a[text()[normalize-space()='Sign Out']]");
        if(userProfileLink != null) {
            return userProfileLink;
        } else {
            throw new Error("No user profile link element");
        }
    }

    //actuadores

    public async clickViewSiteLink() {
        const ele = await this.eleViewSiteLink;
        await ele?.click();
        await this.page.waitForURL('**/#/site');
    }

    public async clickPostsLink() {
        const ele = await this.elePostsLink;
        await ele?.click();
        await this.page.waitForURL('**/#/posts');
    }

    public async clickPagesLink() {
        const ele = await this.elePagesLink;
        await ele?.click();
        await this.page.waitForURL('**/#/pages');
    }

    public async clickTagsLink() {
        const ele = await this.eleTagsLink;
        await ele?.click();
        await this.page.waitForURL('**/#/tags');
    }

    public async clickStaffLink() {
        const ele = await this.eleStaffLink;
        await ele?.click();
        await this.page.waitForSelector("//span[text()='Invite people']");
    }

    public async clickDesignLink() {
        const ele = await this.eleDesignLink;
        await ele?.click();
        await this.page.waitForSelector("//div[text()='Theme Directory']");
    }

    public async clickUserMenu() {
        const ele = await this.eleUserMenu;
        await ele?.click();
    }

    public async clickUserProfileLink() {
        const ele = await this.eleUserProfileLink;
        await ele?.click();
    }

    public async clickSignoutLink() {
        const ele = await this.eleUserLogoutLink;
        await ele?.click();
    }
}