import { Page } from "playwright";

export default class HomePage {

    private page: Page;

    constructor(page: Page) {
        this.page = page;
    }

    //selectores

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

    //actuadores

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
}