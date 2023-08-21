export class CreditCardCsvRow {
    private transactionId: string;
    private transactionName: string;
    private ammount: number;
    private expenditureAmmount: number;
    private details: string;
    private date: string;
    private typeOfTransaction: string;
    private actualAmmountOfTransaction: number;
    private timestamp: number;
    private countInNeed: boolean;


    constructor(transactionId: string, transactionName: string, ammount: number, expenditureAmmount: number, details: string, date: string, typeofTransaction: string, actualAmmountOfTransaction: number, timeStamp: number, countInNeed: boolean) {
        this.transactionId = transactionId
        this.transactionName = transactionName
        this.ammount = ammount
        this.expenditureAmmount = expenditureAmmount
        this.details = details
        this.date = date
        this.typeOfTransaction = typeofTransaction;
        this.actualAmmountOfTransaction = actualAmmountOfTransaction;
        this.timestamp = timeStamp;
        this.countInNeed = countInNeed;
    }
    public getTransactionId() {
        return this.transactionId
    }
    public setTransactionId(transactionId: string) {
        this.transactionId = transactionId;
    }
    public getTransactionName() {
        return this.transactionName
    }
    public setTransactionName(typeOfTransaction: string) {
        this.typeOfTransaction = typeOfTransaction;
    }
    public getTransactionType() {
        return this.typeOfTransaction;
    }
    public setTransactionType(typeOfTransaction: string) {
        this.typeOfTransaction = typeOfTransaction;
    }
    public getAmmount() {
        return this.ammount
    }
    public setAmmount(ammount: number) {
        this.ammount = ammount;
    }
    public getExpenditureAmmount() {
        return this.expenditureAmmount
    }
    public setExpenditureAmmount(expenditureAmmount: number) {
        this.expenditureAmmount = expenditureAmmount;
    }
    public getDetails() {
        return this.details
    }
    public setDetails(details: string) {
        this.details = details;
    }
    public getDate() {
        return this.date
    }
    public setDate(date: string) {
        this.date = date;
    }
    public getActualAmmountOfTransaction() {
        return this.actualAmmountOfTransaction
    }
    public setActualAmmountOfTransaction(actualAmmountOfTransaction: number) {
        this.actualAmmountOfTransaction = actualAmmountOfTransaction;
    }
    public getTimeStamp() {
        return this.timestamp
    }
    public setTimeStamp(timestamp: number) {
        this.timestamp = timestamp;
    }
    public getCountInNeed() {
        return this.countInNeed
    }
    public setCountInNeed(countInNeed: boolean) {
        this.countInNeed = countInNeed;
    }
}