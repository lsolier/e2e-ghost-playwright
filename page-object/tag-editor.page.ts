import { Page } from "playwright";

export default class TagEditorPage {

    private page: Page;

    constructor(page: Page) {
        this.page = page;
    }

    //selectores

    public get eleName() {
        const name = this.page.$("input[name='name']");
        if(name != null) {
            return name;
        } else {
            throw new Error("No tag name element");
        }
    }

    public get eleSlug() {
        const slug = this.page.$("input[name='slug']");
        if(slug != null) {
            return slug;
        } else {
            throw new Error("No tag slug element");
        }
    }

    public get eleDescription() {
        const slug = this.page.$("textarea[name='description']");
        if(slug != null) {
            return slug;
        } else {
            throw new Error("No tag slug element");
        }
    }

    public get eleButtonSave() {
        const buttonSave = this.page.$("//span[text()='Save']");
        if(buttonSave != null) {
            return buttonSave;
        } else {
            throw new Error("No button save element");
        }
    }

    public get eleDeleteButton() {
        const buttonDelete = this.page.$("//span[text()='Delete tag']");
        if(buttonDelete != null) {
            return buttonDelete;
        } else {
            throw new Error("No button delete element");
        }
    }

    public get eleConfirmationDeleteButton() {
        const buttonDelete = this.page.$("//span[text()='Delete']");
        if(buttonDelete != null) {
            return buttonDelete;
        } else {
            throw new Error("No confirmation button delete element");
        }
    }

    public get eleLinkTags() {
        const buttonSave = this.page.$("a[href='#/tags/']");
        if(buttonSave != null) {
            return buttonSave;
        } else {
            throw new Error("No tag slug element");
        }
    }

    //actuadores

    public async fillTagName(tagName:string){
        const eleName = await this.eleName;
        await eleName?.fill(tagName);
    }

    public async fillTagSlug(tagSlug:string){
        const eleSlug = await this.eleSlug;
        await eleSlug?.fill(tagSlug);
    }

    public async fillTagDescription(tagDescription:string){
        const eleDescription = await this.eleDescription;
        await eleDescription?.fill(tagDescription);
    }

    public async clickButtonSave() {
        const buttonSave = await this.eleButtonSave;
        await buttonSave?.click();
        await this.page.waitForLoadState();
    }

    public async clickDeleteButton() {
        const buttonSave = await this.eleDeleteButton;
        await buttonSave?.click();
        await this.page.waitForLoadState();
    }

    public async clickConfirmationDeleteButton() {
        const buttonSave = await this.eleConfirmationDeleteButton;
        await buttonSave?.click();
        await this.page.waitForURL('**/#/tags');
    }

    public async clickTagsLink() {
        const buttonSave = await this.eleLinkTags;
        await buttonSave?.click();
        await this.page.waitForURL('**/#/tags');
    }

}