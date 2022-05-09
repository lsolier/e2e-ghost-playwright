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

    public get eleLeaveButton() {
        const postsLink = this.page.$("//button[@class='gh-btn gh-btn-red']");
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

    public get eleSettingButton() {
        const settingButton = this.page.$("//button[@title='Settings']");
        if(settingButton != null) {
            return settingButton;
        } else {
            throw new Error("No SettingButton element");
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
        const viewPost = this.page.$("//span[@class='gh-notification-actions']//a[1]");
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

    public get eleTagComboBoxInput() {
        const tagComboBox = this.page.$("div.ember-basic-dropdown-trigger--in-place.ember-power-select-multiple-trigger");
        if(tagComboBox != null) {
            return tagComboBox;
        } else {
            throw new Error("No tagComboBox element");
        }
    }

    public get tagList() {
        const tagComboBox = this.page.$$("div ul li");
        if(tagComboBox != null) {
            return tagComboBox;
        } else {
            throw new Error("No tagComboBox element");
        }
    }

    public get eleCloseSetting() {
        const closeSetting = this.page.$("button[aria-label='Close']");
        if(closeSetting != null) {
            return closeSetting;
        } else {
            throw new Error("No closeSetting element");
        }
    }

    public get eleDeletePostButton() {
        const deletePost = this.page.$("button.gh-btn.gh-btn-hover-red.settings-menu-delete-button");
        if(deletePost != null) {
            return deletePost;
        } else {
            throw new Error("No DeletePostButton element");
        }
    }

    public get eleConfirmationDeletePostButton() {
        const confirmationDeletePost = this.page.$("button.gh-btn.gh-btn-red");
        if(confirmationDeletePost != null) {
            return confirmationDeletePost;
        } else {
            throw new Error("No ConfirmationDeletePostButton element");
        }
    }

    public get eleFormSetting() {
        const formSetting = this.page.$("div.settings-menu-container");
        if(formSetting != null) {
            return formSetting;
        } else {
            throw new Error("No FormSetting element");
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

    public async clickSettingButton(){
        const publishLink = await this.eleSettingButton;
        await publishLink?.click();
        await this.page.waitForSelector("//label[text()='Tags']")
    }

    public async clickPublishLink(){
        await this.page.waitForSelector(`//div[contains(@class, 'gh-btn gh-btn-outline gh-publishmenu-trigger')]`);
        const publishLink = await this.elePublishLink;
        await publishLink?.click();
    }

    public async clickPublishButton(){
        const publishButton = await this.elePublishBtn;
        await publishButton?.click();
        await this.page.waitForSelector("(//span[text()='Published'])[2]");
    }

    public async clickScheduleButton(){
        const publishButton = await this.eleScheduleBtn;
        await publishButton?.click();
    }

    public async clickPostsLink(){
        const postsLink = await this.elePostsLink;
        await postsLink?.click();
    }

    public async clickLeaveButton(){
        const postsLink = await this.eleLeaveButton;
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

    public async selectTagWithName(tagName: string) {
        const tagComboBoxInput = await this.eleTagComboBoxInput;
        await tagComboBoxInput?.click();
        await this.page.waitForSelector("//ul[@role='listbox']");
        const tagList = await this.tagList;
        console.log("Total tags: " + tagList.length);

        const allTagsInDropDown = await Promise.all(tagList
            .map(async (tag, i) => {
                const elementText = await tag.innerText();
                if(elementText.includes(tagName)) {
                    return tag;
                }
            })
        );

        const filteredAllTagsInDropDown = allTagsInDropDown.filter(elm => elm);
        console.log("ver: " + await filteredAllTagsInDropDown[0]?.innerText());
        await filteredAllTagsInDropDown[0]?.click();
        await this.page.waitForSelector("button[aria-label='Close']");
    }

    public async clickCloseSetting() {
        const closeSetting = await this.eleCloseSetting;
        await closeSetting?.click();
        const formSetting = await this.eleFormSetting;
        await formSetting?.evaluate(node => node.setAttribute("style", "display: none"));
        await this.page.waitForSelector("//span[text()='Publish']");
    }

    public async clickDeletePostButton() {
        const deleteButton = await this.eleDeletePostButton;
        await deleteButton?.click();
    }

    public async clickConfirmationDeletePostButton() {
        const deleteButton = await this.eleConfirmationDeletePostButton;
        await deleteButton?.click();
    }

    public async clickViewPostLink() {
        await this.page.waitForSelector("span.gh-notification-actions");
        const viewPostLink = await this.eleViewPost;
        await viewPostLink?.evaluate(node => node.removeAttribute("target"));
        return await viewPostLink?.click();
    }

}