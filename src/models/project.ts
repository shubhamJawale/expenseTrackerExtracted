import { SubTask } from "./subTask"
import { TaskObject } from "./task-object"

export class Project {
    private projectName: string
    private details: string
    private taskList: TaskObject[]

    constructor(projectName: string, details: string, taskList: TaskObject[]) {
        this.projectName = projectName
        this.details = details
        this.taskList = taskList
    }
    public getprojectName() {
        return this.projectName
    }
    public setprojectName(projectName: string) {
        this.projectName = projectName;
    }
    public getdetails() {
        return this.details
    }
    public setdetails(details: string) {
        this.details = details;
    }
    public gettaskList() {
        return this.taskList
    }
    public settaskList(taskList: TaskObject[]) {
        this.taskList = taskList;
    }

    public static fromJSON(json: any) {
        let projectList: Project[] = [];
        for (let projectJson of json) {
            let taskArray: TaskObject[] = [];
            for (let task of projectJson.taskList) {
                let subtasksList: SubTask[] = [];
                for (let subTask of task.subTaskList) {
                    let subtasks = new SubTask(subTask.name, subTask.dueDate, subTask.details, subTask.priority, subTask.status);
                    subtasksList.push(subtasks)
                }
                let newTask = new TaskObject(task.id, task.name, task.description, task.startDate, task.dueDate, subtasksList, task.progress);
                taskArray.push(newTask);
            }
            let newProject = new Project(projectJson.projectName, projectJson.details, taskArray);
            projectList.push(newProject);
        }
        return projectList;
    }
}