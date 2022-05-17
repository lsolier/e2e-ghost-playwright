import { Page } from "playwright";

export default class ContentPagePage {

    private page: Page;

    constructor(page: Page) {
        this.page = page;
    }

    //selectores

    public eleNavBarPageLink(resourceName:string) {
        const navBarPageLink = this.page.$(`//a[@href="http://localhost:2368/${resourceName}/"]`);;
        if(navBarPageLink != null) {
            return navBarPageLink;
        } else {
            throw new Error("No navBar element with such a link");
        }
    }

    public elePageTitle(title:string) {
        const pageTitle = this.page.$(`//h1[text()='${title}']`);
        if(pageTitle != null) {
            return pageTitle;
        } else {
            throw new Error("No such title with the name");
        }
    }

    public elePageSomeContent(contentFragment:string) {
        const pageTitle = this.page.$(`//p[text()='${contentFragment}']`);
        if(pageTitle != null) {
            return pageTitle;
        } else {
            throw new Error("No such content fragment on the page");
        }
    }

    //actuadores

    public async goToContentMainPage() {
        await this.page.goto('http://localhost:2368/');
    }

    public async clickNavBarLink(itemName:string) {
        const navBarItem = await this.eleNavBarPageLink(itemName);
        await navBarItem?.click();
    }

}