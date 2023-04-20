export class Account {
    private id: string;
    private name: string;
    private details: string;
    private email: string;

    constructor(id: string, name: string, details: string, email: string) {
        this.id = id
        this.name = name
        this.details = details
        this.email = email
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
    public setEmail(email: string) {
        this.email = email;
    }

    public getEmail() {
        return this.email;
    }

    public static fetchListObjectOfAccounts(json: any[]) {
        let arrayOfAccounts: Account[] = []
        arrayOfAccounts = json.map((element) => new Account(element.id, element.name, element.details, element.email));
        return arrayOfAccounts;
    }


}