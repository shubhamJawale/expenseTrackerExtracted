export class ExpeneseDetailsCsvRow {
    private id: string;
    private transactionName: string;
    private details: string;
    private ammount: string;
    private totalAccountBalance: string;
    private category: string;
    private typeOfTransaction: string;
    private dateOfTransaction: string;
    constructor(id: string, transcationName: string, details: string, ammount: string, totalAccountBalance: string, category: string, typeOfTransaction: string, dateOfTransaction: string) {
        this.id = id;
        this.transactionName = transcationName;
        this.details = details;
        this.ammount = ammount;
        this.totalAccountBalance = totalAccountBalance;
        this.category = category;
        this.typeOfTransaction = typeOfTransaction;
        this.dateOfTransaction = dateOfTransaction;
    }
    public getId() {
        return this.id;
    }
    public setId(id: string) {
        this.id = id;
    }
    public gettransactionName() {
        return this.transactionName;
    }
    public settransactionName(transactionName: string) {
        this.transactionName = transactionName;
    }
    public getdetails() {
        return this.details;
    }
    public setdetails(details: string) {
        this.details = details;
    }
    public getammount() {
        return this.ammount;
    }
    public setammount(ammount: string) {
        this.ammount = ammount;
    } public gettotalAccountBalance() {
        return this.totalAccountBalance;
    }
    public settotalAccountBalance(totalAccountBalance: string) {
        this.totalAccountBalance = totalAccountBalance;
    } public getcategory() {
        return this.category;
    }
    public setcategory(category: string) {
        this.category = category;
    }
    public gettypeOfTransaction() {
        return this.typeOfTransaction;
    }
    public settypeOfTransaction(typeOfTransaction: string) {
        this.typeOfTransaction = typeOfTransaction;
    }

    public SetDateForTheTransaction(dateForTheRecord: string) {
        this.dateOfTransaction = dateForTheRecord;
    }
    public getDateForTheTransaction() {
        return this.dateOfTransaction;
    }

}