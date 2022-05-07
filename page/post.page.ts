import { Page } from "playwright";

export default class PostPage {

    private page: Page;

    constructor(page: Page) {
        this.page = page;
    }

    public get eleNewPostLink() {
        const newPostLink = this.page.$("text='New post'");
        if(newPostLink != null) {
            return newPostLink;
        } else {
            throw new Error("No newPostLink element");
        }
    }

    public async clickNewPostLink() {
        const ele = await this.eleNewPostLink;
        await ele?.click();
        await this.page.waitForLoadState();
    }
}