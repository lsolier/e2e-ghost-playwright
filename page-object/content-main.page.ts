import { Page } from "playwright";

export default class ContentMainPage {

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

    public eleNavBarPageLink(resourceName:string) {
        const navBarPageLink = this.page.$(`//a[@href="http://localhost:2368/${resourceName}/"]`);
        if(navBarPageLink != null) {
            return navBarPageLink;
        } else {
            throw new Error("No navBar element with such a link");
        }
    }

    public async goToContentMainPage() {
        await this.page.goto('http://localhost:2368/');
    }

    public async clickNavBarLink(itemName:string) {
        const navBarLink = await this.eleNavBarPageLink(itemName);
        await navBarLink?.click();
    }


}