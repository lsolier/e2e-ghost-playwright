import { Page } from "playwright";

export default class PageGhostPage {

    private page: Page;

    constructor(page: Page) {
        this.page = page;
    }

    //selectores

    public get eleNewPageLink() {
        const newPageLink = this.page.$("text='New page'");
        if(newPageLink != null) {
            return newPageLink;
        } else {
            throw new Error("No newPostLink element");
        }
    }

    public async pagesList() {
        await this.page.waitForSelector(`section ol li`);
        const pages = await this.page.$$(`section ol li`);
        if(pages != null) {
            return pages;
        } else {
            throw new Error("No selectedPostTitle element");
        }
    }


    //actuadores

    public async clickNewPageLink() {
        const ele = await this.eleNewPageLink;
        await ele?.click();
        await this.page.waitForURL('**/#/editor/page');
    }

    public async findPageByTitle(pageTitle: string) {
        const pagesGhost = await this.pagesList();
        console.log("Total pages: " + pagesGhost.length);
        const allHref = await Promise.all(pagesGhost
            .map(async (pageGhost, i) => {
                const elementText = await pageGhost.innerText();
                if(elementText.includes(pageTitle)) {
                    return await pageGhost.$("a.gh-post-list-title");
                }
            })
        );

        const filteredAllHref = allHref.filter(elm => elm);
        return filteredAllHref[0];
    }

    public async navigateToEditionLink(link: any) {
        const href = await link.getAttribute("href");
        const formattedHref = href.substring(0,href.length-1)
        await link.click();
        await this.page.waitForURL(`**/${formattedHref}`);
    }

}