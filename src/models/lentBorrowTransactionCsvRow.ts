export class LentBorrowTransactionCsvRow {
    private name: string
    private type: string
    private ammount: number
    private date: string
    private details: string

    constructor(name: string, type: string, ammount: number, date: string, details: string) {
        this.name = name
        this.type = type
        this.ammount = ammount
        this.date = date
        this.details = details
    }
    public getname() {
        return this.name
    }
    public setname(name: string) {
        this.name = name;
    }
    public gettype() {
        return this.type
    }
    public settype(type: string) {
        this.type = type;
    }
    public getammount() {
        return this.ammount
    }
    public setammount(ammount: number) {
        this.ammount = ammount;
    }
    public getdate() {
        return this.date
    }
    public setdate(date: string) {
        this.date = date;
    }
    public getdetails() {
        return this.details
    }
    public setdetails(details: string) {
        this.details = details;
    }

    public static fromJson(jsonArray: any[]) {
        let ArrayToReturn: LentBorrowTransactionCsvRow[] = [];
        for (let json of jsonArray) {
            let singleElement = new LentBorrowTransactionCsvRow(json.name, json.type, json.ammount, json.date, json.details);
            ArrayToReturn.push(singleElement);
        }
        return ArrayToReturn;
    }
}