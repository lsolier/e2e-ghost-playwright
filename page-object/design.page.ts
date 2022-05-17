import { Page } from "playwright";

export default class DesignPage {

    private page: Page;

    constructor(page: Page) {
        this.page = page;
    }

    //SELECTORES
    public get eleInputLabel() {
        const newDesignElement = this.page.$(`//div[@class='gh-blognav-item ember-view']/div/span[@class='gh-blognav-label ember-view']/input[@class='ember-text-field gh-input ember-view']`);
        if(newDesignElement != null) {
            return newDesignElement;
        } else {
            throw new Error("No newPostLink element");
        }
    }
    public get eleInputUrl() {
        const newDesignElement = this.page.$(`//div[@class='gh-blognav-item ember-view']/div/span[@class='gh-blognav-url ember-view']/input[@class='ember-text-field gh-input ember-view']`);
        if(newDesignElement != null) {
            return newDesignElement;
        } else {
            throw new Error("No newPostLink element");
        }
    }
    public get eleBtnAdd() {
        const newDesignElement = this.page.$(`//button[@class='gh-blognav-add']`);
        if(newDesignElement != null) {
            return newDesignElement;
        } else {
            throw new Error("No newPostLink element");
        }
    }
    public get eleBtnSave() {
        const newDesignElement = this.page.$(`//span[contains(., 'Save')]`);
        if(newDesignElement != null) {
            return newDesignElement;
        } else {
            throw new Error("No newPostLink element");
        }
    }

    /*public get eleClosePopup() {
        const loginBtn = this.page.waitForSelector("//button[@class='gh-notification-close']");
        if(loginBtn != null) {
            return loginBtn;
        } else {
            throw new Error("No eleClosePopup element");
        }
    }*/

    public get eleNewLabelInputField() {
        const newLabelInput = this.page.$("(//form[@id='settings-navigation']//input[@placeholder='Label'])[last()]");
        if(newLabelInput != null) {
            return newLabelInput;
        } else {
            throw new Error("No new label input element");
        }
    }

    public get eleNewLinkInputField() {
        const newLinkInput = this.page.$("(//form[@id='settings-navigation']//input)[last()]");
        if(newLinkInput != null) {
            return newLinkInput;
        } else {
            throw new Error("No new link input element");
        }
    }

    public get eleDeleteLastNavItemBtn() {
        const deleteLastNavItemBtn = this.page.$("(//form[@id='settings-navigation']//button[@class='gh-blognav-delete'])[last()]");
        if(deleteLastNavItemBtn != null) {
            return deleteLastNavItemBtn;
        } else {
            throw new Error("No Delete nav item button");
        }
    }


    //ACCIONADORES

    public async fillLabelForNewNav(title: string) {
        const ele = await this.eleInputLabel;
        await ele?.fill(title);
    }

    public async fillUrlForNewNav(url: string) {
        const ele = await this.eleInputUrl;
        await ele?.fill(url);
    }

    public async clickAddNewNavButton() {
        const ele = await this.eleBtnAdd;
        await ele?.click();
    }

    public async clickSaveButton() {
        const ele = await this.eleBtnSave;
        await ele?.click();
        await this.page.waitForSelector("//span[text()='Saved']");
    }

    public async findNavBarByTitle(targetTitle: string) {
        const navBarList = await this.page.$$("//section[@class='view-container' and ./div/text()='Navigation' ]//div//form/div//div[contains(@class,'js-draggableObject draggable-object')]");
        console.log("navBarList: " + await navBarList?.length);
        const navBarListFiltered = await Promise.all(navBarList
            .map(async (navBar, i) => {
                const inputTitle = await navBar.$("input[placeholder='Label']");
                const value = await inputTitle?.inputValue();
                console.log("navBar["+ i +"]: " + value);
                if(value?.includes(targetTitle)) {
                    return navBar;
                }
            })
        );

        const singletonNavBarList = navBarListFiltered.filter(elm => elm);
        return singletonNavBarList[0];
    }

    public async updateNavBar(targetTitle:string, newTitle: string, newURL: string) {
        const navBarFound = await this.findNavBarByTitle(targetTitle);
        const navBarTitle = await navBarFound?.$("input[placeholder='Label']");
        const navBarURL = await navBarFound?.$(`//span[@class='gh-blognav-url ember-view']/input[@class='ember-text-field gh-input ember-view']`);
        console.log("navBarTitle to edit: " + await navBarTitle?.inputValue());
        console.log("navBarURL to edit: " + await navBarURL?.inputValue());

        await navBarTitle?.fill(newTitle);
        await navBarURL?.fill(newURL);

        await this.clickSaveButton();
    }

    public async deleteNavBar(targetTitle:string) {
        const navBarFound = await this.findNavBarByTitle(targetTitle);
        const navBarTitle = await navBarFound?.$("input[placeholder='Label']");
        const navBarURL = await navBarFound?.$(`//span[@class='gh-blognav-url ember-view']/input[@class='ember-text-field gh-input ember-view']`);
        const removeButton = await navBarFound?.$("button.gh-blognav-delete");
        console.log("navBarTitle to delete: " + await navBarTitle?.inputValue());
        console.log("navBarURL to delete: " + await navBarURL?.inputValue());

        await removeButton?.click();

        await this.clickSaveButton();
    }

    public async fillNewLabelInput(labelName: string) {
        const newLabelInput = await this.eleNewLabelInputField;
        await newLabelInput?.fill(labelName);
    }

    public async fillNewLinkInput(linkPath: string) {
        const newLinkInput = await this.eleNewLinkInputField;
        await newLinkInput?.fill(linkPath);
    }

    /*public async clickClosePopup() {
        const ele = await this.eleClosePopup;
        await ele?.click();
    }*/

    public async clickDeleteLastNavItemButton() {
        const ele = await this.eleDeleteLastNavItemBtn;
        await ele?.click();
    }

}