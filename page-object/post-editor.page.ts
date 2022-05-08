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

    public get eleScheduleBtn() {
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

    public get eleScheduleTime() {
        const scheduleTimeInput = this.page.$("div.gh-date-time-picker-time input");
        if(scheduleTimeInput != null) {
            return scheduleTimeInput;
        } else {
            throw new Error("No scheduleTimeInput element");
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

    public async clickScheduleButton(){
        const publishButton = await this.eleScheduleBtn;
        await publishButton?.click();
    }

    public async clickPostsLink(){
        const postsLink = await this.elePostsLink;
        await postsLink?.click();
    }

    public async updateTimeToPublish() {
        await this.page.waitForSelector("div.gh-date-time-picker-time input");
        const scheduleTime = await this.eleScheduleTime;
        let currentDate = new Date();
        let hour = currentDate.getHours();
        let min = currentDate.getMinutes();
        let minToPublish = min  + 5;
        console.log("published for: " + hour + ":" + minToPublish);
        await scheduleTime?.click();
        await scheduleTime?.fill(hour + ":" + minToPublish);
        await this.clickScheduleButton();
    }

}