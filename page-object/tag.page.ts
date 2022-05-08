import { Page } from "playwright";

export default class TagPage {

    private page: Page;

    constructor(page: Page) {
        this.page = page;
    }

    //selectores

    public get eleNewTagLink() {
        const newPageLink = this.page.$("text='New tag'");
        if(newPageLink != null) {
            return newPageLink;
        } else {
            throw new Error("No newPostLink element");
        }
    }

    public async tagsList() {
        await this.page.waitForSelector(`section ol li`);
        const pages = await this.page.$$(`section ol li`);
        if(pages != null) {
            return pages;
        } else {
            throw new Error("No selectedPostTitle element");
        }
    }

    //actuadores

    public async clickNewTagLink() {
        const ele = await this.eleNewTagLink;
        await ele?.click();
        await this.page.waitForURL('**/#/tags/new');
    }

    public async findPageByTitle(pageTitle: string) {
        const tags = await this.tagsList();
        console.log("Total tags: " + (tags.length-1));
        const allHref = await Promise.all(tags
            .map(async (tag, i) => {
                const elementText = await tag.innerText();
                if(elementText.includes(pageTitle)) {
                    return await tag.$("a.gh-tag-list-title");
                }
            })
        );

        const filteredAllHref = allHref.filter(elm => elm);
        return filteredAllHref[0];
    }

    public async navigateToEditionLink(link: any) {
        const href = await link.getAttribute("href");
        const formattedHref = href.substring(0,href.length-1);
        await link.click();
        await this.page.waitForURL(`**/${formattedHref}`);
    }
}