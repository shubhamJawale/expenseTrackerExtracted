import { inject, injectable } from "inversify";
import { FileSystemService } from "../file-system-service";
import TYPES from "../../types";
import { CONSTANTS, appStatusCodes, filePrefix, fileTypes } from "../../constants/constants";
import { Project } from "../../models/project";
import { Utility } from "../../utility/utility";
import { LogWritter } from "../../utility/logWritter";
import { TaskObject } from "../../models/task-object";
import { SubTask } from "../../models/subTask";

@injectable()
export class TaskService {
    private readonly fileSystemService: FileSystemService;
    private readonly utility: Utility;
    private readonly logWritter: LogWritter;
    constructor(@inject(TYPES.FileSystemService) _fileSystemService: FileSystemService, @inject(TYPES.Utility) _utility: Utility, @inject(TYPES.LogWritter) _logwritter: LogWritter) {
        this.utility = _utility;
        this.fileSystemService = _fileSystemService;
        this.logWritter = _logwritter;
    }


    public async getTaskFileFromSystem(name: string) {
        let filePath = `${CONSTANTS.taskFilePath}`;
        let fileName = `${name}_${CONSTANTS.taskFileName}`;
        let response: any;
        if (await this.fileSystemService.checkFileExists(fileName, filePath, fileTypes.json)) {
            let projectListJsonArray = await this.fileSystemService.getJsonFromFile(fileName, filePath);
            let listOfProject = Project.fromJSON(projectListJsonArray);
            response = listOfProject;
        }
        else {
            response = { statusCode: appStatusCodes.fileNotFound, message: "file not found" };
        }
        return response;
    }

    public async writeTaskJson(name: string, data: Project[]) {
        let filePath = `${CONSTANTS.taskFilePath}`;
        let fileName = `${name}_${CONSTANTS.taskFileName}`;
        // let response: any;
        try {
            let response = this.fileSystemService.saveJsonData(fileName, filePath, data);
            return {
                statusCode: appStatusCodes.success,
                message: "file Saved Succesfully"
            }
        } catch (e: any) {
            return {
                statusCode: 500,
                message: "Error Occured During Saving the json"

            }
        }
    }
    // from here the real methods which will impact the process has started
    // 1. add new project Empty project
    // 2. update project
    // 3. delete project
    // 4. add new task
    // 5. update task
    // 6. delete task
    // 7. add subtask
    // 8. update subtask
    // 9. delete subtask
    public async addNewProjectToList(project: Project, name: string) {
        let fileName = `${name}_${CONSTANTS.taskFileName}`;
        let filePath = `${CONSTANTS.taskFilePath}`;
        let oldProjectFileCheck = await this.fileSystemService.checkFileExists(fileName, filePath, fileTypes.json);
        if (oldProjectFileCheck) {
            let oldProjectFileObjectArray = await this.getTaskFileFromSystem(name);
            let projectIfExists = await oldProjectFileObjectArray.find((projectInFile: Project) => projectInFile.getprojectName() === project.getprojectName());
            if (projectIfExists) {
                let message: string = "project All-ready exist please Refer the project list and then add new Project"
                this.utility.writeNotesOnScreen(message);
            } else {
                oldProjectFileObjectArray.push(project);
                let message = project.getprojectName() + ' Project added to ' + filePath +"/"+fileName;
                this.logWritter.writeLogs(message, filePrefix.task);
                this.utility.writeNotesOnScreen(message);
            }
            this.fileSystemService.saveJsonData(fileName,filePath,oldProjectFileObjectArray);
        }
        else {
            let newProjectArray: Project[] = [];
            newProjectArray.push(project);
            let AddProjectResponse = await this.writeTaskJson(name, newProjectArray);
            let message: string = 'new file created with name ' + name + " and new project is created with name " + project.getprojectName();
            this.logWritter.writeLogs(message, filePrefix.task);
            this.utility.writeNotesOnScreen(message);
        }
    }
    public async updateProjectDetails(oldProject: Project, newproject: Project, name: string) {
        let fileName = `${name}_${CONSTANTS.taskFileName}`;
        let filePath = `${CONSTANTS.taskFilePath}`;
        let oldProjectFileCheck = await this.fileSystemService.checkFileExists(fileName, filePath, fileTypes.json);
        if (oldProjectFileCheck) {
            let oldProjectFileObjectArray: Project[] = await this.getTaskFileFromSystem(name);
            let projectIfExists = await oldProjectFileObjectArray.find((projectInFile: Project) => projectInFile.getprojectName() === oldProject.getprojectName());
            if (projectIfExists) {
                let indexOfOldProject = await oldProjectFileObjectArray.findIndex((projectToFound : Project)=> projectToFound.getprojectName()=== oldProject.getprojectName());
                oldProjectFileObjectArray[indexOfOldProject] = newproject;
                this.fileSystemService.saveJsonData(fileName,filePath, oldProjectFileObjectArray);
                let message = 'project update with name : ' + oldProject.getprojectName();
                this.logWritter.writeLogs(message, filePrefix.task);
                this.utility.writeNotesOnScreen(message);
            } else {
                this.utility.writeNotesOnScreen('the project does not exist');
            }
        }
    }
    public async deleteProject(project: Project, name: string) {
        let fileName = `${name}_${CONSTANTS.taskFileName}`;
        let filePath = `${CONSTANTS.taskFilePath}`;
        let oldProjectFileCheck = await this.fileSystemService.checkFileExists(fileName, filePath, fileTypes.json);
        if (oldProjectFileCheck) {
            let oldProjectFileObjectArray: Project[] = await this.getTaskFileFromSystem(name);
            let projectIfExists = await oldProjectFileObjectArray.find((projectInFile: Project) => projectInFile.getprojectName() === project.getprojectName());
            if (projectIfExists!=undefined) {
                let indexOfOldProject = await oldProjectFileObjectArray.findIndex((project: Project)=> project.getprojectName() == projectIfExists?.getprojectName());
                oldProjectFileObjectArray.splice(indexOfOldProject, 1);
                this.writeTaskJson(name, oldProjectFileObjectArray);
                let message = 'the project is deleted : ' + project.getprojectName();
                this.logWritter.writeLogs(message, filePrefix.task);
                this.utility.writeNotesOnScreen(message);
            } else {
                let message = 'the project does not exists';
                // this.logWritter.writeLogs(message,  filePrefix.task );
                this.utility.writeNotesOnScreen(message);
            }
        }

    }
    public async addTaskInTheExistingProject(name: string, projectName: string, task: TaskObject) {
        let fileName = `${name}_${CONSTANTS.taskFileName}`;
        let filePath = `${CONSTANTS.taskFilePath}`;
        let oldProjectFileCheck = await this.fileSystemService.checkFileExists(fileName, filePath, fileTypes.json);
        if (oldProjectFileCheck) {
            let oldProjectFileObjectArray: Project[] = await this.getTaskFileFromSystem(name);
            let projectIfExists = await oldProjectFileObjectArray.find((projectInFile: Project) => projectInFile.getprojectName() === projectName);
            if (projectIfExists) {
                let taskList = projectIfExists.gettaskList();
                taskList.push(task);
                projectIfExists.settaskList(taskList);
                let indexOfOldProject = await oldProjectFileObjectArray.indexOf(projectIfExists);
                oldProjectFileObjectArray[indexOfOldProject] = projectIfExists;
                this.writeTaskJson(name, oldProjectFileObjectArray);
                let message = "task added to project" + projectName;
                this.utility.writeNotesOnScreen(message);
                this.logWritter.writeLogs(message, filePrefix.task);
            }
            else {
                let message = "project does not exists" + projectName;
                this.utility.writeNotesOnScreen(message);
                // this.logWritter.writeLogs(message,filePrefix.task);
            }

        } else {
            let message = "project does not exists" + projectName;
            this.utility.writeNotesOnScreen(message);
        }
    }

    public async updateTaskInExistingProject(name: string, projectName: string, oldTask: TaskObject, newTask: TaskObject) {
        let fileName = `${name}_${CONSTANTS.taskFileName}`;
        let filePath = `${CONSTANTS.taskFilePath}`;
        let oldProjectFileCheck = await this.fileSystemService.checkFileExists(fileName, filePath, fileTypes.json);
        if (oldProjectFileCheck) {
            let oldProjectFileObjectArray: Project[] = await this.getTaskFileFromSystem(name);
            let projectIfExists = await oldProjectFileObjectArray.find((projectInFile: Project) => projectInFile.getprojectName() === projectName);
            if (projectIfExists) {
                let taskList = projectIfExists.gettaskList();
                let IndexOfTask = taskList.findIndex((oldtaskToFound: TaskObject)=>  oldtaskToFound.getid() === oldTask.getid());
                taskList[IndexOfTask] = newTask;
                projectIfExists.settaskList(taskList);
                let indexOfOldProject = await oldProjectFileObjectArray.indexOf(projectIfExists);
                oldProjectFileObjectArray[indexOfOldProject] = projectIfExists;
                this.writeTaskJson(name, oldProjectFileObjectArray);
                let message = "task updated to project" + projectName;
                this.utility.writeNotesOnScreen(message);
                this.logWritter.writeLogs(message, filePrefix.task);
            } else {
                let message = "project does not exists" + projectName;
                this.utility.writeNotesOnScreen(message);
            }
        } else {
            let message = "project does not exists" + projectName;
            this.utility.writeNotesOnScreen(message);
        }
    }
    public async deleteTaskInExistingProject(name: string, projectName: string, oldTask: TaskObject) {
        let fileName = `${name}_${CONSTANTS.taskFileName}`;
        let filePath = `${CONSTANTS.taskFilePath}`;
        let oldProjectFileCheck = await this.fileSystemService.checkFileExists(fileName, filePath, fileTypes.json);
        if (oldProjectFileCheck) {
            let oldProjectFileObjectArray: Project[] = await this.getTaskFileFromSystem(name);
            let projectIfExists = await oldProjectFileObjectArray.find((projectInFile: Project) => projectInFile.getprojectName() === projectName);
            if (projectIfExists) {
                let taskList = projectIfExists.gettaskList();
                let IndexOfTask = taskList.indexOf(oldTask);
                // taskList[IndexOfTask] = newTask;
                taskList.splice(IndexOfTask, 1);
                projectIfExists.settaskList(taskList);
                let indexOfOldProject = await oldProjectFileObjectArray.indexOf(projectIfExists);
                oldProjectFileObjectArray[indexOfOldProject] = projectIfExists;
                this.writeTaskJson(name, oldProjectFileObjectArray);
                let message = "task updated to project" + projectName;
                this.utility.writeNotesOnScreen(message);
                this.logWritter.writeLogs(message, filePrefix.task);
            } else {
                let message = "project does not exists" + projectName;
                this.utility.writeNotesOnScreen(message);
            }
        } else {
            let message = "project does not exists" + projectName;
            this.utility.writeNotesOnScreen(message);
        }
    }
    public async AddSubTaskInTheExistingOrNewProject(name: string, projectName: string, taskid: number, subtask: SubTask[]) {
        let fileName = `${name}_${CONSTANTS.taskFileName}`;
        let filePath = `${CONSTANTS.taskFilePath}`;
        let oldProjectFileCheck = await this.fileSystemService.checkFileExists(fileName, filePath, fileTypes.json);
        if (oldProjectFileCheck) {
            let oldProjectFileObjectArray: Project[] = await this.getTaskFileFromSystem(name);
            let projectIfExists = await oldProjectFileObjectArray.find((projectInFile: Project) => projectInFile.getprojectName() === projectName);
            if (projectIfExists) {
                let taskList = projectIfExists.gettaskList();
                let spacificTask = await taskList.find((tasksInList: TaskObject) => tasksInList.getid() === taskid);
                if (spacificTask) {
                    let indexofOldTask = taskList.indexOf(spacificTask);
                    let subTaskList = spacificTask.getsubTaskList();
                    subTaskList.push(...subtask);
                    spacificTask.setsubTaskList(subTaskList);
                    taskList[indexofOldTask] = spacificTask;
                } else {
                    let message = "project does not exists" + projectName;
                    this.utility.writeNotesOnScreen(message);
                }
                projectIfExists.settaskList(taskList);
                let indexOfOldProject = await oldProjectFileObjectArray.indexOf(projectIfExists);
                oldProjectFileObjectArray[indexOfOldProject] = projectIfExists;
                this.writeTaskJson(name, oldProjectFileObjectArray);
                let message = "subtask added to project " + projectName + " and To the taskid  " + taskid;
                this.utility.writeNotesOnScreen(message);
                this.logWritter.writeLogs(message, filePrefix.task);
            } else {
                let message = "project does not exists" + projectName;
                this.utility.writeNotesOnScreen(message);
                // this.logWritter.writeLogs(message,filePrefix.task);
            }
        }
        else {
            let message = "project does not exists" + projectName;
            this.utility.writeNotesOnScreen(message);
        }
    }

    public async updateSubTaskInExistingProject(name: string, projectName: string, taskId: number, oldSubTask: SubTask, newSubTask: SubTask) {
        let fileName = `${name}_${CONSTANTS.taskFileName}`;
        let filePath = `${CONSTANTS.taskFilePath}`;
        let oldProjectFileCheck = await this.fileSystemService.checkFileExists(fileName, filePath, fileTypes.json);
        if (oldProjectFileCheck) {
            let oldProjectFileObjectArray: Project[] = await this.getTaskFileFromSystem(name);
            let projectIfExists = await oldProjectFileObjectArray.find((projectInFile: Project) => projectInFile.getprojectName() === projectName);
            if (projectIfExists) {
                let taskList = projectIfExists.gettaskList();
                let spacificTask = await taskList.find((tasksInList: TaskObject) => tasksInList.getid() === taskId);
                if (spacificTask) {
                    // console.log('spacific task',JSON.stringify(spacificTask));
                    let indexofOldTask = taskList.findIndex((task : TaskObject)=> spacificTask?.getid() == task.getid());
                    // console.log('inex of task',indexofOldTask);
                    let subTaskList = spacificTask.getsubTaskList();
                    // console.log('subtaskList',JSON.stringify(subTaskList));
                    // console.log('old sub task',JSON.stringify(oldSubTask));
                    let indexOfSubtask = subTaskList.findIndex((subtask : SubTask)=>oldSubTask.getname() == subtask.getname());
                    //    subTaskList.splice(indexOfSubtask,1);
                    // console.log('inex of subtask',indexOfSubtask);
                    subTaskList[indexOfSubtask] = newSubTask;
                    // console.log('after edit ',JSON.stringify(subTaskList));
                    spacificTask.setsubTaskList(subTaskList);
                    taskList[indexofOldTask] = spacificTask;
                    // console.log('after edit ',JSON.stringify(taskList));
                    // console.log('after edit spacific task',JSON.stringify(spacificTask));
                } else {
                    let message = "project does not exists" + projectName;
                    this.utility.writeNotesOnScreen(message);
                }
                projectIfExists.settaskList(taskList);
                let indexOfOldProject = await oldProjectFileObjectArray.findIndex((project : Project)=>projectIfExists?.getprojectName() === project.getprojectName());
                oldProjectFileObjectArray[indexOfOldProject] = projectIfExists;
                // console.log(JSON.stringify(oldProjectFileObjectArray));
                this.writeTaskJson(name, oldProjectFileObjectArray);
                let message = "subtask updated to project " + projectName + " and To the taskid  " + taskId;
                this.utility.writeNotesOnScreen(message);
                this.logWritter.writeLogs(message, filePrefix.task);
            } else {
                let message = "project does not exists" + projectName;
                this.utility.writeNotesOnScreen(message);
                // this.logWritter.writeLogs(message,filePrefix.task);
            }
        }
        else {
            let message = "project does not exists" + projectName;
            this.utility.writeNotesOnScreen(message);
        }
    }

    public async deleteSubTaskInExistingProject(name: string, projectName: string, taskId: number, oldSubTask: SubTask) {
        let fileName = `${name}_${CONSTANTS.taskFileName}`;
        let filePath = `${CONSTANTS.taskFilePath}`;
        let oldProjectFileCheck = await this.fileSystemService.checkFileExists(fileName, filePath, fileTypes.json);
        if (oldProjectFileCheck) {
            let oldProjectFileObjectArray: Project[] = await this.getTaskFileFromSystem(name);
            let projectIfExists = await oldProjectFileObjectArray.find((projectInFile: Project) => projectInFile.getprojectName() === projectName);
            if (projectIfExists) {
                let taskList = projectIfExists.gettaskList();
                let spacificTask = await taskList.find((tasksInList: TaskObject) => tasksInList.getid() === taskId);
                if (spacificTask) {
                    let indexofOldTask = taskList.indexOf(spacificTask);
                    let subTaskList = spacificTask.getsubTaskList();
                    let indexOfSubtask = subTaskList.indexOf(oldSubTask);
                    subTaskList.splice(indexOfSubtask, 1);
                    spacificTask.setsubTaskList(subTaskList);
                    taskList[indexofOldTask] = spacificTask;
                } else {
                    let message = "project does not exists" + projectName;
                    this.utility.writeNotesOnScreen(message);
                }
                projectIfExists.settaskList(taskList);
                let indexOfOldProject = await oldProjectFileObjectArray.indexOf(projectIfExists);
                oldProjectFileObjectArray[indexOfOldProject] = projectIfExists;
                this.writeTaskJson(name, oldProjectFileObjectArray);
                let message = "subtask deleted from project " + projectName + " and To the taskid  " + taskId;
                this.utility.writeNotesOnScreen(message);
                this.logWritter.writeLogs(message, filePrefix.task);
            } else {
                let message = "project does not exists" + projectName;
                this.utility.writeNotesOnScreen(message);
                // this.logWritter.writeLogs(message,filePrefix.task);
            }
        }
        else {
            let message = "project does not exists" + projectName;
            this.utility.writeNotesOnScreen(message);
        }
    }

}