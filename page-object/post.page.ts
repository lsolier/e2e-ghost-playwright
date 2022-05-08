import { Page } from "playwright";

export default class PostPage {

    private page: Page;

    constructor(page: Page) {
        this.page = page;
    }

    //selectores

    public get eleNewPostLink() {
        const newPostLink = this.page.$("text='New post'");
        if(newPostLink != null) {
            return newPostLink;
        } else {
            throw new Error("No newPostLink element");
        }
    }

    public selectedPostTitle(postTitle:string) {
        const selectedPostTitle = this.page.$(`//*[contains(text(), '${postTitle}')]`);
        if(selectedPostTitle != null) {
            return selectedPostTitle;
        } else {
            throw new Error("No selectedPostTitle element");
        }
    }
    

    //actuadores

    public async clickNewPostLink() {
        const ele = await this.eleNewPostLink;
        await ele?.click();
        await this.page.waitForLoadState();
    }

    public async getElePostTitle(postTitle:string) {
        const selectedPostTitle = await this.selectedPostTitle(postTitle);
        return selectedPostTitle != null;
    }

}