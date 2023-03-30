export class ExpenseTrackerOverview {

    private name: string;
    private accountBalance: string;
    private totalExpenditureForMonth: number;
    private totalIncomeForMonth: number;
    private totalIncome: number;
    private totalExpenditure: number;
    private dateForRecords: string;


    constructor(name: string, accountBalance: string, totalExpenditureForMonth: number, totalIncome: number, totalIncomeForMonth: number, totalExpenditure: number, dateForRecords: string) {
        this.name = name;
        this.accountBalance = accountBalance;
        this.totalExpenditureForMonth = totalExpenditureForMonth;
        this.totalIncomeForMonth = totalIncomeForMonth;
        this.totalIncome = totalIncome;
        this.totalExpenditure = totalExpenditure;
        this.dateForRecords = dateForRecords;
    }

    public setName(name: string) {
        this.name = name;
    }
    public getName() {
        return this.name;
    }
    public setaccountBalance(accountBalance: string) {
        this.accountBalance = accountBalance;
    }
    public getaccountBalance() {
        return this.accountBalance;
    }
    public settotalExpenditureForMonth(totalExpenditureForMonth: number) {
        this.totalExpenditureForMonth = totalExpenditureForMonth;
    }
    public gettotalExpenditureForMonth() {
        return this.totalExpenditureForMonth;
    }
    public settotalIncomeForMonth(totalIncomeForMonth: number) {
        this.totalIncomeForMonth = totalIncomeForMonth;
    }
    public gettotalIncomeForMonth() {
        return this.totalIncomeForMonth;
    }
    public settotalExpenditure(totalExpenditure: number) {
        this.totalExpenditure = totalExpenditure;
    }
    public gettotalExpenditure() {
        return this.totalExpenditure;
    }
    public settotalIncome(totalIncome: number) {
        this.totalIncome = totalIncome;
    }
    public gettotalIncome() {
        return this.totalIncome;
    }

    public SetDateForTheRecord(dateForTheRecord: string) {
        this.dateForRecords = dateForTheRecord;
    }
    public getDateForTheRecord() {
        return this.dateForRecords;
    }

    public static fromJson(json: any) {
        let name = json.name;
        let accountBalance = json.accountBalance;
        let totalExpenditureForMonth = json.totalExpenditureForMonth;
        let totalIncomeForMonth = json.totalIncomeForMonth;
        let totalIncome = json.totalIncome;
        let totalExpenditure = json.totalExpenditure;
        let dateForRecords = json.dateForRecords;

        return new ExpenseTrackerOverview(name, accountBalance, totalExpenditureForMonth, totalIncome, totalIncomeForMonth, totalExpenditure, dateForRecords)
    }
}