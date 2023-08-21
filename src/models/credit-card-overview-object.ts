export class CreditCardOverviewObject {
    private accountHolderName: string;
    private totalExpenditureForMonthOnCard: number;
    private totalBillPayedForMonthOnCard: number;
    private totalBillPayed: number;
    private totalExpenditure: number;
    private timeStamp: number;
    private balanceBill: number;
    private totalDeflaction: number;
    private noOfActiveLoans: number;
    constructor(accountHolderName: string, totalExpenditureForMonthOnCard: number, totalBillPayedForMonthOnCard: number, totalBillPayed: number, totalExpenditure: number, timeStamp: number, balanceBill: number, totalDeflaction: number, noOfActiveLoans: number) {
        this.accountHolderName = accountHolderName;
        this.totalExpenditureForMonthOnCard = totalExpenditureForMonthOnCard;
        this.totalBillPayedForMonthOnCard = totalBillPayedForMonthOnCard;
        this.totalBillPayed = totalBillPayed;
        this.totalExpenditure = totalExpenditure;
        this.timeStamp = timeStamp;
        this.balanceBill = balanceBill;
        this.totalDeflaction = totalDeflaction;
        this.noOfActiveLoans = noOfActiveLoans;

    }
    public getAccountHolderName() {
        return this.accountHolderName
    }
    public setAccountHolderName(accountHolderName: string) {
        this.accountHolderName = accountHolderName;
    }
    public getTotalExpenditureForMonthOnCard() {
        return this.totalExpenditureForMonthOnCard
    }
    public setTotalExpenditureForMonthOnCard(totalExpenditureForMonthOnCard: number) {
        this.totalExpenditureForMonthOnCard = totalExpenditureForMonthOnCard;
    }
    public getTotalBillPayedForMonthOnCard() {
        return this.totalBillPayedForMonthOnCard
    }
    public setTotalBillPayedForMonthOnCard(totalBillPayedForMonthOnCard: number) {
        this.totalBillPayedForMonthOnCard = totalBillPayedForMonthOnCard;
    }
    public getTotalBillPayed() {
        return this.totalBillPayed
    }
    public setTotalBillPayed(totalBillPayed: number) {
        this.totalBillPayed = totalBillPayed;
    }
    public getTotalExpenditure() {
        return this.totalExpenditure
    }
    public setTotalExpenditure(totalExpenditure: number) {
        this.totalExpenditure = totalExpenditure;
    }
    public getTimeStamp() {
        return this.timeStamp
    }
    public setTimeStamp(timeStamp: number) {
        this.timeStamp = timeStamp;
    }
    public getBalanceBill() {
        return this.balanceBill
    }
    public setBalanceBill(balanceBill: number) {
        this.balanceBill = balanceBill;
    }

    public getTotalDeflection() {
        return this.totalDeflaction
    }
    public setTotalDeflection(totalDeflaction: number) {
        this.totalDeflaction = totalDeflaction;
    }

    public getNoOfActiveLoans() {
        return this.noOfActiveLoans
    }
    public setNoOfActiveLoans(noOfActiveLoans: number) {
        this.noOfActiveLoans = noOfActiveLoans;
    }

    public static fromJson(json: any) {
        return new CreditCardOverviewObject(json.accountHolderName, json.totalExpenditureForMonthOnCard, json.totalBillPayedForMonthOnCard, json.totalBillPayed, json.totalExpenditure, json.timeStamp, json.balanceBill, json.totalDeflaction, json.noOfActiveLoans)
    }
}