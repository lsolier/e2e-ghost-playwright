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

    public async postList() {
        await this.page.waitForSelector(`section ol li`);
        const pages = await this.page.$$(`section ol li`);
        if(pages != null) {
            return pages;
        } else {
            throw new Error("No selectedPostTitle element");
        }
    }
    

    //actuadores

    public async clickNewPostLink() {
        const ele = await this.eleNewPostLink;
        await ele?.click();
        await this.page.waitForURL('**/#/editor/post');
    }

    public async getElePostTitle(postTitle:string) {
        const selectedPostTitle = await this.selectedPostTitle(postTitle);
        return selectedPostTitle != null;
    }

    public async findPageByTitleAndStatus(pageTitle: string, status: string) {
        await this.page.waitForURL('**/#/posts');
        const postList = await this.postList();
        console.log("Total pages: " + postList.length);
        const allHref = await Promise.all(postList
            .map(async (post, i) => {
                const elementText = await post.innerText();
                if(elementText.includes(pageTitle) && elementText.includes(status)) {
                    return await post.$("a.gh-post-list-title");
                }
            })
        );

        const filteredAllHref = allHref.filter(elm => elm);
        console.log("ver: " + await filteredAllHref[0]?.innerText());
        return filteredAllHref[0];
    }

    public async navigateToEditionLink(link: any) {
        const href = await link.getAttribute("href");
        const formattedHref = href.substring(0,href.length-1)
        await link.click();
        await this.page.waitForURL(`**/${formattedHref}`);
    }

}