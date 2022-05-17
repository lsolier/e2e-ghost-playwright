import Env from "./environment";

export default class Utilities {

    public scenarioName: string;

    constructor(scenarioName: string) {
        this.scenarioName = scenarioName;
    }

    public generateScreenshotPath(screenshotId:number) : string {
        if(screenshotId != null) {
            return Env.SCREENSHOT_FOLDER + this.scenarioName + "/" + screenshotId+".png";
        } else {
            throw new Error("No valid parameters");
        }
    }

}