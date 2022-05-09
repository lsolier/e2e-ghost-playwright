import { Page } from "playwright";

export default class PublicPostPage {

    private page: Page;

    constructor(page: Page) {
        this.page = page;
    }

    //selectores

    public get eleTagSection() {
        const postsLink = this.page.$("section.post-full-tags");
        if(postsLink != null) {
            return postsLink;
        } else {
            throw new Error("No postsLink element");
        }
    }

    public get eleTitleSection() {
        const pagesLink = this.page.$("h1.post-full-title");
        if(pagesLink != null) {
            return pagesLink;
        } else {
            throw new Error("No pagesLink element");
        }
    }

    public get eleDescriptionSection() {
        const tagsLink = this.page.$("section.post-full-content");
        if(tagsLink != null) {
            return tagsLink;
        } else {
            throw new Error("No tagsLink element");
        }
    }

    //actuadores

    public async validatePostInfoPublished(postTitle: string, postDescription: string, tagName: string) {
        await this.page.waitForSelector("section.post-full-tags");
        const titleSection = await this.eleTitleSection;
        const descriptionSection = await this.eleDescriptionSection;
        const tagSection = await this.eleTagSection;
        let x =  await titleSection?.innerText();
        console.log("title: " + x);
        console.log("description: " + await descriptionSection?.innerText())
        console.log("tag: " + await tagSection?.innerText())
        let titleCheck: boolean = (await titleSection?.innerText())?.trim() == postTitle;
        let descriptionCheck: boolean = (await descriptionSection?.innerText())?.trim() == postDescription;
        let tagCheck: boolean = (await tagSection?.innerText())?.trim() == tagName;
        console.log(titleCheck +" - "+ descriptionCheck + " - " + tagCheck)
        return titleCheck && descriptionCheck && tagCheck;
    }


}