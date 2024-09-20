import { PackageSearchResponseModel } from "./packageSearchResponseModel";

export class PackagesSearchResponseModel {
    packages: PackageSearchResponseModel[];
    issuerNames: string[];
    achievementTypes: string[];
    effectiveAtYears: number[];
    constructor() {
        this.packages = new Array<PackageSearchResponseModel>();
        this.issuerNames = new Array<string>();
        this.achievementTypes = new Array<string>();
        this.effectiveAtYears = new Array<number>();
    }
}
