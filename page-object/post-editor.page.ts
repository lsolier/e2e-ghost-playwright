import { Page } from "playwright";

export default class PostEditorPage {
    private page: Page;

    constructor(page: Page) {
        this.page = page;
    }

    //selectores

    public get eleTitle() {
        const title = this.page.$("textarea[placeholder='Post Title']");
        if(title != null) {
            return title;
        } else {
            throw new Error("No title element");
        }
    }

    public get eleContent() {
        const description = this.page.$("div[data-placeholder='Begin writing your post...']");
        if(description != null) {
            return description;
        } else {
            throw new Error("No content element");
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

    public get elePublishLink() {
        const publishLink = this.page.locator(`//div[contains(@class, 'gh-btn gh-btn-outline gh-publishmenu-trigger')]`);
        if(publishLink != null) {
            return publishLink;
        } else {
            throw new Error("No publishLink element");
        }
    }

    public get elePublishBtn() {
        const publishButton = this.page.waitForSelector("button.gh-publishmenu-button");
        if(publishButton != null) {
            return publishButton;
        } else {
            throw new Error("No publishButton element");
        }
    }

    public get eleViewPost() {
        const viewPost = this.page.$("View Post");
        if(viewPost != null) {
            return viewPost;
        } else {
            throw new Error("No viewPost element");
        }
    }

    //actuadores
    public async fillPostTitle(title:string){
        const titleArea = await this.eleTitle;
        await titleArea?.fill(title);
    }

    public async fillPostContent(title:string){
        const contentArea = await this.eleContent;
        await contentArea?.fill(title);
    }

    public async clickPublishLink(){
        const publishLink = await this.elePublishLink;
        await publishLink?.click();
    }

    public async clickPublishButton(){
        const publishButton = await this.elePublishBtn;
        await publishButton?.click();
    }

    public async clickPostsLink(){
        const postsLink = await this.elePostsLink;
        await postsLink?.click();
    }

}