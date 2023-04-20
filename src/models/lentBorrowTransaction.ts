export class LentBorrowTransaction {
    private name: string
    private type: string
    private ammount: number

    constructor(name: string, type: string, ammount: number) {
        this.name = name
        this.type = type
        this.ammount = ammount
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

    public static fromJson(jsonArray: any[]) {
        let ArrayToReturn: LentBorrowTransaction[] = [];
        for (let json of jsonArray) {
            let singleElement = new LentBorrowTransaction(json.name, json.type, json.ammount);
            ArrayToReturn.push(singleElement);
        }
        return ArrayToReturn;
    }
}