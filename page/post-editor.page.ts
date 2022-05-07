import { Page } from "playwright";

export default class PostEditorPage {
    private page: Page;

    constructor(page: Page) {
        this.page = page;
    }

    public get eleTitle() {
        const title = this.page.$("textarea[placeholder='Post Title']");
        if(title != null) {
            return title;
        } else {
            throw new Error("No title element");
        }
    }

    public get eleDescription() {
        const description = this.page.$("div[data-kg='editor']");
        if(description != null) {
            return description;
        } else {
            throw new Error("No description element");
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
        const publishLink = this.page.$("//span[text()='Publish']");
        if(publishLink != null) {
            return publishLink;
        } else {
            throw new Error("No publishLink element");
        }
    }

    public get elePublishBtn() {
        const publishButton = this.page.$("button.gh-publishmenu-button");
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
}