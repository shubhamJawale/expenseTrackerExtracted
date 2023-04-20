export class SubTask {
    private name: string
    private dueDate: string
    private details: string
    private priority: string
    private status: string

    constructor(name: string, dueDate: string, details: string, priority: string, status: string) {
        this.name = name
        this.dueDate = dueDate
        this.details = details
        this.priority = priority
        this.status = status
    }
    public getname() {
        return this.name
    }
    public setname(name: string) {
        this.name = name;
    }
    public getdueDate() {
        return this.dueDate
    }
    public setdueDate(dueDate: string) {
        this.dueDate = dueDate;
    }
    public getdetails() {
        return this.details
    }
    public setdetails(details: string) {
        this.details = details;
    }
    public getpriority() {
        return this.priority
    }
    public setpriority(priority: string) {
        this.priority = priority;
    }
    public getstatus() {
        return this.status
    }
    public setstatus(status: string) {
        this.status = status;
    }
}