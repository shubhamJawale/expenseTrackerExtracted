export class Account {
    private id: string
    private name: string
    private details: string

    constructor(id: string, name: string, details: string) {
        this.id = id
        this.name = name
        this.details = details
    }
    public getid() {
        return this.id
    }
    public setid(id: string) {
        this.id = id;
    }
    public getname() {
        return this.name
    }
    public setname(name: string) {
        this.name = name;
    }
    public getdetails() {
        return this.details
    }
    public setdetails(details: string) {
        this.details = details;
    }


    public static fetchListObjectOfAccounts(json: any[]) {
        let arrayOfAccounts: Account[] = []
        arrayOfAccounts = json.map((element) => new Account(element.id, element.name, element.details));
        return arrayOfAccounts;
    }


}