export class LentBorrowTransactionCsvRow {
    private name: string
    private type: string
    private ammount: number
    private date: string
    // private status: string

    constructor(name: string, type: string, ammount: number, date: string, /* status: string */) {
        this.name = name
        this.type = type
        this.ammount = ammount
        this.date = date
        // this.status = status
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
    // public getstatus() {
    //     return this.status
    // }
    // public setstatus(status: string) {
    //     this.status = status;
    // }

    public static fromJson(jsonArray: any[]) {
        let ArrayToReturn: LentBorrowTransactionCsvRow[] = [];
        for (let json of jsonArray) {
            let singleElement = new LentBorrowTransactionCsvRow(json.name, json.type, json.ammount, json.date, /* json.status */);
            ArrayToReturn.push(singleElement);
        }
        return ArrayToReturn;
    }
}