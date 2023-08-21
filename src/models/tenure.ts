export class Tenure {
    private indexOfTenure: number
    private periodOfTenure: string
    private ammountOfTenure: number
    private interestAmmount: number
    private statusOfTheTenure: string
    private AdditionalRemarks: string
    private details: string

    constructor(indexOfTenure: number, periodOfTenure: string, ammountOfTenure: number, interestAmmount: number, statusOfTheTenure: string, AdditionalRemarks: string, details: string) {
        this.indexOfTenure = indexOfTenure
        this.periodOfTenure = periodOfTenure
        this.ammountOfTenure = ammountOfTenure
        this.interestAmmount = interestAmmount
        this.statusOfTheTenure = statusOfTheTenure
        this.AdditionalRemarks = AdditionalRemarks
        this.details = details
    }
    public getIndexOfTenure() {
        return this.indexOfTenure
    }
    public setIndexOfTenure(indexOfTenure: number) {
        this.indexOfTenure = indexOfTenure;
    }
    public getPeriodOfTenure() {
        return this.periodOfTenure
    }
    public setPeriodOfTenure(periodOfTenure: string) {
        this.periodOfTenure = periodOfTenure;
    }
    public getAmmountOfTenure() {
        return this.ammountOfTenure
    }
    public setAmmountOfTenure(ammountOfTenure: number) {
        this.ammountOfTenure = ammountOfTenure;
    }
    public getInterestAmmount() {
        return this.interestAmmount
    }
    public setInterestAmmount(interestAmmount: number) {
        this.interestAmmount = interestAmmount;
    }
    public getStatusOfTheTenure() {
        return this.statusOfTheTenure
    }
    public setStatusOfTheTenure(statusOfTheTenure: string) {
        this.statusOfTheTenure = statusOfTheTenure;
    }
    public getAdditionalRemarks() {
        return this.AdditionalRemarks
    }
    public setAdditionalRemarks(AdditionalRemarks: string) {
        this.AdditionalRemarks = AdditionalRemarks;
    }
    public getDetails() {
        return this.details
    }
    public setDetails(details: string) {
        this.details = details;
    }
}