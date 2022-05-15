import { Page } from "playwright";

export default class SitePage {

    private page: Page;

    constructor(page: Page) {
        this.page = page;
    }

    //SELECTORES
    public async navLinkList() {
        const locator = this.page.mainFrame().frameLocator('iframe#site-frame').locator("body header ul li a");
        if(locator != null) {
            return locator;
        } else {
            throw new Error("No navLinkList element");
        }
    }

    public async getElementFromFrameByText(description: string) {
        const locator = this.page.mainFrame().frameLocator('iframe#site-frame').locator(`//p[text()='${description}']`);
        if(locator != null) {
            return locator;
        } else {
            throw new Error("No text element");
        }
    }

    //ACCIONADORES
    public async findNavByTitle(title: string) {
        this.page.mainFrame().frameLocator('iframe#site-frame').locator(title);
        const navLinkList = await this.navLinkList();
        if(navLinkList != null) {
            const count = await navLinkList.count();
            console.log("Nav existentes: " + count);
            const allHref = [];
            for (let i = 0; i < count; ++i) {
                const elementText = await navLinkList.nth(i).textContent();
                if(elementText?.includes(title)) {
                    allHref.push(navLinkList.nth(i));
                }
            }
            const filteredAllHref = allHref.filter(elm => elm);
            return filteredAllHref[0];
        }

    }

    public async navigateToNavLink(link: any) {
        await link.click();
    }

    public async isThereDescriptionWith(description: string) {
        const ele = await this.getElementFromFrameByText(description);
        return !(ele === null);
    }

}