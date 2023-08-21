import { Utility } from "../utility/utility"
import { Tenure } from "./tenure"

export class Loan {
    private loanId: string
    private loanName: string
    private loanSource: string
    private loanBearer: string
    private loanAmmount: number
    private interestOnLoan: number
    private remainingAmmount: number
    private paidAmmount: number
    private noOfTenures: number
    private lastTenureDetails: string
    private tenures: Tenure[]
    private loanStatus: string
    private loanDetails: string
    private loanProcessingFee: number

    constructor(loanId: string, loanName: string, loanSource: string, loanBearer: string, loanAmmount: number, interestOnLoan: number, remainingAmmount: number, paidAmmount: number, noOfTenures: number, lastTenureDetails: string, tenures: Tenure[], loanStatus: string, loanDetails: string, loanProcessingFee: number) {
        this.loanId = loanId
        this.loanName = loanName
        this.loanSource = loanSource
        this.loanBearer = loanBearer
        this.loanAmmount = loanAmmount
        this.interestOnLoan = interestOnLoan
        this.remainingAmmount = remainingAmmount
        this.paidAmmount = paidAmmount
        this.noOfTenures = noOfTenures
        this.lastTenureDetails = lastTenureDetails
        this.tenures = tenures
        this.loanStatus = loanStatus
        this.loanDetails = loanDetails;
        this.loanProcessingFee = loanProcessingFee;
    }
    public getLoanId() {
        return this.loanId
    }
    public setLoanId(loanId: string) {
        this.loanId = loanId;
    }
    public getLoanName() {
        return this.loanName
    }
    public setLoanName(loanName: string) {
        this.loanName = loanName;
    }
    public getLoanSource() {
        return this.loanSource
    }
    public setLoanSource(loanSource: string) {
        this.loanSource = loanSource;
    }
    public getLoanBearer() {
        return this.loanBearer
    }
    public setLoanBearer(loanBearer: string) {
        this.loanBearer = loanBearer;
    }
    public getLoanAmmount() {
        return this.loanAmmount
    }
    public setLoanAmmount(loanAmmount: number) {
        this.loanAmmount = loanAmmount;
    }
    public getInterestOnLoan() {
        return this.interestOnLoan
    }
    public setInterestOnLoan(interestOnLoan: number) {
        this.interestOnLoan = interestOnLoan;
    }
    public getRemainingAmmount() {
        return this.remainingAmmount
    }
    public setRemainingAmmount(remainingAmmount: number) {
        this.remainingAmmount = remainingAmmount;
    }
    public getPaidAmmount() {
        return this.paidAmmount
    }
    public setPaidAmmount(paidAmmount: number) {
        this.paidAmmount = paidAmmount;
    }
    public getNoOfTenures() {
        return this.noOfTenures
    }
    public setNoOfTenures(noOfTenures: number) {
        this.noOfTenures = noOfTenures;
    }
    public getLastTenureDetails() {
        return this.lastTenureDetails
    }
    public setLastTenureDetails(lastTenureDetails: string) {
        this.lastTenureDetails = lastTenureDetails;
    }
    public getTenures() {
        return this.tenures
    }
    public setTenures(tenures: Tenure[]) {
        this.tenures = tenures;
    }
    public getLoanStatus() {
        return this.loanStatus
    }
    public setLoanStatus(loanStatus: string) {
        this.loanStatus = loanStatus;
    }

    public getLoanDetails() {
        return this.loanDetails
    }
    public setLoanDetails(loanDetails: string) {
        this.loanDetails = loanDetails;
    }
    public getLoanProcessingFee() {
        return this.loanProcessingFee
    }
    public setLoanProcessingFee(loanProcessingFee: number) {
        this.loanProcessingFee = loanProcessingFee;
    }
    public static getLoanObjectFromJSON(json: any) {
        let loanArray: Array<Loan> = [];
        json.forEach((loanJson: any) => {
            let loan = Loan.singleLoanObjectFromJSON(loanJson);
            loanArray.push(loan);
        });
        return loanArray;
    }
    public static singleLoanObjectFromJSON(loanJson: any) {
        let tenures: Tenure[] = loanJson.tenures.map((tenureJson: any) => new Tenure(tenureJson.indexOfTenure, tenureJson.periodOfTenure, tenureJson.ammountOfTenure, tenureJson.interestAmmount, tenureJson.statusOfTheTenure, tenureJson.AdditionalRemarks, tenureJson.details))
        let loan: Loan = new Loan(loanJson.loanId, loanJson.loanName, loanJson.loanSource, loanJson.loanBearer, loanJson.loanAmmount, loanJson.interestOnLoan, loanJson.remainingAmmount, loanJson.paidAmmount, loanJson.noOfTenures, loanJson.lastTenureDetails, tenures, loanJson.loanStatus, loanJson.loanDetails, loanJson.loanProcessingFee);
        return loan;
    }
    public getSpacificTenure(month: string, year: string) {
        let tenureToReturn: Tenure = new Tenure(0, "", 0, 0, "", "", "");
        this.tenures.forEach((tenure: Tenure) => {
            let periodOfTenure: string = tenure.getPeriodOfTenure();
            let monthAndYear = Utility.getMonthAndYearFromStringWithDash(periodOfTenure);
            if (month === monthAndYear.month && year === monthAndYear.year) {
                tenureToReturn = tenure;
            } else {
                console.log('NO TENURE FOUND FOR SPACIFIED MONTH AND YEAR :- ' + month + "-" + year);
            }
        });
        return tenureToReturn;
    }
}