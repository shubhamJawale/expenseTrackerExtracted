export class TaskObject {
    private id: number
    private name: string
    private description: string
    private startDate: string
    private dueDate: string
    private subTaskList: string[]

    constructor(id: number, name: string, description: string, startDate: string, dueDate: string, subTaskList: string[]) {
        this.id = id
        this.name = name
        this.description = description
        this.startDate = startDate
        this.dueDate = dueDate
        this.subTaskList = subTaskList
    }
    public getid() {
        return this.id
    }
    public setid(id: number) {
        this.id = id;
    }
    public getname() {
        return this.name
    }
    public setname(name: string) {
        this.name = name;
    }
    public getdescription() {
        return this.description
    }
    public setdescription(description: string) {
        this.description = description;
    }
    public getstartDate() {
        return this.startDate
    }
    public setstartDate(startDate: string) {
        this.startDate = startDate;
    }
    public getdueDate() {
        return this.dueDate
    }
    public setdueDate(dueDate: string) {
        this.dueDate = dueDate;
    }
    public getsubTaskList() {
        return this.subTaskList
    }
    public setsubTaskList(subTaskList: string[]) {
        this.subTaskList = subTaskList;
    }
}