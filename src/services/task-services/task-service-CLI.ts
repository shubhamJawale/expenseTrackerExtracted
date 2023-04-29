import { inject, injectable } from "inversify";
import { TaskService } from "./task-service";
import TYPES from "../../types";
import { Utility } from "../../utility/utility";
import * as readline from 'node:readline/promises';
import { Project } from "../../models/project";
import { TaskObject } from "../../models/task-object";
import { ColourForTransactionRow, TaskProgresses, subTaskPriority, subtasksProgresses } from "../../constants/constants";
import { Table, printTable } from "console-table-printer";
import { SubTask } from "../../models/subTask";
import { AccountService } from "../account-service";
@injectable()
export class TaskServiceClient {
    private readonly taskService: TaskService;
    private readonly utility: Utility;
    private readonly accountService : AccountService;
    constructor(@inject(TYPES.TaskService) _taskService: TaskService, @inject(TYPES.Utility) _utility: Utility, @inject(TYPES.AccountService) _accountService : AccountService) {
        this.accountService =_accountService;
        this.utility = _utility;
        this.taskService = _taskService;
    }
    public async logIn(rl : any){
        
        // let spacificAccount = "";
        let name =await rl.question('enter the name to log in : ');
        let accountList = await this.accountService.fetchAccountList();
        let spacificAccount = await this.accountService.fetchSpacificAccount(name,accountList);
        if(spacificAccount){
            await this.mainMethodToDriveTheTaskApp(spacificAccount.getname(),rl);
        }else {
            this.utility.writeNotesOnScreen('Account does Not Exists')
        }
        
    }
    public async mainMethodToDriveTheTaskApp(name: string, rl : any) {

        
        let quiteOption = 'n';
        do {
            let mainMenuOption =  await rl.question("Choose The Option Below : \n TASK MENU :- \n 1. Show The Project Tables \n 2. Add Project \n 3. Update Project \n 4. Delete Project  \n Enter the option From Above List  : => ");
            switch (parseInt(mainMenuOption)) {
                case 1:
                await    this.showProjectTable(name,rl);
                    break;
                case 2:
               await this.addNewProject(name,rl);
                    break;
                case 3:
                    await this.updateProject(name,rl);
                    break;
                case 4:
                    await this.deleteProject(name,rl);
                    break;
            }
            quiteOption = await rl.question('do you want to quit "y"/"n" ? ');

        } while (quiteOption === 'n');
        
    }
    public async deleteProject(name : string, rl: any   ){
      
        // this section will work with project 
        let projectList = await this.showTableForProject(name);
        // console.log('\n');
        let indexOfProject = await rl.question('Enter The Index Of The Project to delete : ');
        this.printLine(1);
        this.printLine(1)
        let selectedProject = projectList[parseInt(indexOfProject)];
        await this.taskService.deleteProject(selectedProject,name);
    }
    public async updateProject(name : string,rl :any){
      
        // this section will work with project 
        let projectList = await this.showTableForProject(name);
        // console.log('\n');
        let indexOfProject = await rl.question('Enter The Index Of The Project to update: ');
        this.printLine(1);
        console.log('You Can Only Update Project Name And Details For Task and SubTasks you Need to go to each update Window');
        this.printLine(1)
        let selectedProject = projectList[parseInt(indexOfProject)];

        let pnameBooleanNumber =await rl.question('Do you Really want to Update the project Name : \n 1. yes \n 2. no \n ==> Enter the option ==> ');
        let pname = selectedProject.getprojectName();
        if(await this.getBooleanOption(parseInt(pnameBooleanNumber))){
            pname = await rl.question('Enter the Name of Project : ');
        }

        
        let descriptionBooleanNumber =await rl.question('Do you Really want to Update the project description : \n 1. yes \n 2. no \n ==> Enter the option ==> ');
        let description = selectedProject.getdetails();
        if(await this.getBooleanOption(parseInt(descriptionBooleanNumber))){
            description = await rl.question('Enter the description of Project : ');
        }
        let newUpdatedProject = new Project(pname,description,selectedProject.gettaskList());

        await this.taskService.updateProjectDetails(selectedProject, newUpdatedProject, name);
      
    }
    public async addNewProject(name : string,rl :any){
     
        // new Project(name,details,taskList);
        let pname = await rl.question('Enter the project name : ');
        let details = await rl.question('Enter the project Details : ');
        let taskList : TaskObject[] =[];
        let newProject = new Project(pname,details,taskList);
        this.utility.writeNotesOnScreen('You Can Add Task Once the project is created');
        await this.taskService.addNewProjectToList(newProject,name);
    }
    public async showProjectTable(name: string,rl : any) {
       
        // this section will work with project 
        let projectList = await this.showTableForProject(name);
        // console.log('\n');
        let indexOfProject = await rl.question('Enter The Index Of The Project : ');
        this.printLine(1);
        console.log('The Table Will Appear shortly');
        this.printLine(1)
        let selectedProject = projectList[parseInt(indexOfProject)];

        //this section will work tasks
        let taskList: TaskObject[] = selectedProject.gettaskList();
        // new TaskObject(id, name, description,startdate, duedate, subtasklist, progress)
        let taskOptions = {
            columns: [
                { name: 'index', title: 'Index', alignment: 'left' },
                { name: 'id', title: 'Project Id', alignment: 'left' },
                { name: 'taskName', title: 'Task Name', alignment: 'left' },
                { name: 'taskDescription', title: 'Description', alignment: 'left' },
                { name: 'start_Date', title: 'Start Date', alignment: 'left' },
                { name: 'dueDate', title: 'Due Date', alignment: 'left' },
                { name: 'subTaskListExisted', title: 'have checklist ?', alignment: 'left' },
                { name: 'progress', title: 'Progression', alignment: 'left' } // with Title as separate Text
            ],
        }
        // creating task table
        let taskTable = new Table(taskOptions);

        //creating other tables
        let completedArray: TaskObject[] = [];
        let completeTable = new Table(taskOptions);
        let extendedArray: TaskObject[] = [];
        let extendedTable = new Table(taskOptions);
        let inProgressArray: TaskObject[] = [];
        let inProgressTable = new Table(taskOptions);
        let abortedArray: TaskObject[] = [];
        let abortedTable = new Table(taskOptions);
        let readyArray: TaskObject[] = [];
        let readyTable = new Table(taskOptions);
        let newArray: TaskObject[] = [];
        let newTable = new Table(taskOptions);

        let taskIndex = 0;
        for (let task of taskList) {
            let subTaskListFlag = task.getsubTaskList().length > 0 ? 'Yes' : 'No'
            taskTable.addRow({ index: taskIndex, id: task.getid(), taskName: task.getname(), taskDescription: task.getdescription(), start_Date: task.getstartDate(), dueDate: task.getdueDate(), subTaskListExisted: subTaskListFlag, progress: task.getProgress() });
            completedArray = this.addToTheComplimentryTables(TaskProgresses.completed, task, completedArray);
            extendedArray = this.addToTheComplimentryTables(TaskProgresses.extended, task, extendedArray);
            inProgressArray = this.addToTheComplimentryTables(TaskProgresses.inProgress, task, inProgressArray);
            abortedArray = this.addToTheComplimentryTables(TaskProgresses.terminated, task, abortedArray);
            readyArray = this.addToTheComplimentryTables(TaskProgresses.ready, task, readyArray);
            newArray = this.addToTheComplimentryTables(TaskProgresses.new,task,newArray);
            taskIndex++;
        }
        this.printLine(1);
        let TaskMenuQuiteOption = 'n'
        do {
            taskTable.printTable();
            let taskSwitchoption = await rl.question("choose the option to Perform the operation \n 1. Show Category wise Summary according To Progress \n 2. Enter into Task Window \n 3. add New Task : ");

            switch (parseInt(taskSwitchoption)) {
                case 1:
                    this.utility.writeNotesOnScreen('Completed Tasks');
                    completeTable = this.constructComplimentryTable(completeTable, completedArray);
                    completeTable.printTable();
                    this.printLine(3);


                    this.utility.writeNotesOnScreen('in-Progress Tasks');
                    inProgressTable = this.constructComplimentryTable(inProgressTable, inProgressArray);
                    inProgressTable.printTable();
                    this.printLine(3);


                    this.utility.writeNotesOnScreen('ready Tasks');
                    readyTable = this.constructComplimentryTable(readyTable, readyArray);
                    readyTable.printTable();
                    this.printLine(3);


                    this.utility.writeNotesOnScreen('abandned Tasks');
                    abortedTable = this.constructComplimentryTable(abortedTable, abortedArray);
                    abortedTable.printTable();
                    this.printLine(3);


                    this.utility.writeNotesOnScreen('extended Tasks');
                    extendedTable = this.constructComplimentryTable(extendedTable, extendedArray);
                    extendedTable.printTable();
                    this.printLine(3);

                    this.utility.writeNotesOnScreen('new Tasks');
                    extendedTable = this.constructComplimentryTable(newTable, newArray);
                    extendedTable.printTable();
                    this.printLine(3);
                    break;
                case 2:
                    let selectedTaskindex = await rl.question('Select the Task To View And Give the Access to various action \n Enter the index of Task : \t ==> ');

                    let selectedTask: TaskObject = taskList[parseInt(selectedTaskindex)];


                    // Printing task
                    this.printTaskTableSingle(selectedTask)

                    let taskMenuOption = await rl.question('Enter the Operation Choice You Want to Enter for the Task \n 1.update task \n 2. delete task \n 3. update progress of task \n 4. enter to the subtask menu for more Options For Subtasks \n Enter the Option : => ');
                    let projectName = selectedProject.getprojectName();
                    let taskId = selectedTask.getid();

                    switch (parseInt(taskMenuOption)) {
                        case 1:
                            this.utility.writeNotesOnScreen('Update the task');
                            //id: task.getid(), taskName: task.getname(), taskDescription: task.getdescription(), starDate: task.getstartDate(), dueDate: task.getdueDate(), subTaskListExisted: subTaskListFlag, progress: task.getProgress()
                            let objectTaskUpdated = await this.getOptionsToUpdateTask(rl, selectedTask);
                            this.taskService.updateTaskInExistingProject(name, projectName, selectedTask, objectTaskUpdated);
                            break;
                        case 2:
                            this.taskService.deleteTaskInExistingProject(name, projectName, selectedTask);
                            break;
                        case 3:
                            let progress = selectedTask.getProgress();

                            let progressNumber = await rl.question('Enter The progress Of the Task  \n 1. ready \n 2. inProgress \n 3.extended \n  4.abandond \n  5.completed => ');
                            progress = this.setTaskProgress(parseInt(progressNumber));
                            // console.log(progress);
                            let updateObject = new TaskObject(selectedTask.getid(), selectedTask.getname(), selectedTask.getdescription(), selectedTask.getstartDate(), selectedTask.getdueDate(), selectedTask.getsubTaskList(), progress);
                            // console.log(updateObject);
                            this.taskService.updateTaskInExistingProject(name, projectName, selectedTask, updateObject);
                            break;
                        case 4:
                          await  this.subTaskOperationMethod(selectedTask, projectName, rl, name);
                            break;

                    }
                    break;
                case 3:
                    //add new task
                    await this.addNewTask(selectedProject,rl,name);
                    break;
            }

            TaskMenuQuiteOption = ('do you want to quite the Task window : y/n \n \t ==> ')
        } while (TaskMenuQuiteOption === 'n')
    }

    //other utility methods
    private async addNewTask(selectedProject : Project, rl: any, aname: string){
        //id: task.getid(), taskName: task.getname(), taskDescription: task.getdescription(), starDate: task.getstartDate(), dueDate: task.getdueDate(), subTaskListExisted: subTaskListFlag, progress: task.getProgress()
        let id = selectedProject.gettaskList().length +1;
        let name = await rl.question('Enter The Task Name : ');
        let description = await rl.question('Enter The Description of Task : ')
        let starDate = await rl.question('Enter the StartDate in Format as DD/MM/YYYY : ');
        let dueDate = await rl.question('Enter the DueDate in Format as DD/MM/YYYY : ');
        let subTaskList : SubTask[] = [];
        this.utility.writeNotesOnScreen('YOU CAN ADD SUBTASK AFTER The task is created');
        let progress = TaskProgresses.new;
        let newTask = new TaskObject(id,name,description,starDate,dueDate,subTaskList,progress);
        await this.taskService.addTaskInTheExistingProject(aname,selectedProject.getprojectName(),newTask);
    }
    private addToTheComplimentryTables(progress: string, task: TaskObject, array: TaskObject[]) {
        if (task.getProgress() === progress) {
            array.push(task);
        }
        return array;
    }
    private constructComplimentryTable(table: Table, array: TaskObject[]) {
        let index = 0;
        for (let task of array) {
            let subTaskListFlag = task.getsubTaskList().length > 0 ? 'Yes' : 'No'
            table.addRow({ index: index, id: task.getid(), taskName: task.getname(), taskDescription: task.getdescription(), start_Date: task.getstartDate(), dueDate: task.getdueDate(), subTaskListExisted: subTaskListFlag, progress: task.getProgress() });
            index++;
        }
        return table;
    }
    private printLine(number: number) {
        let string = '';
        for (let i = 0; i < number; i++) {
            string = string.concat('\n');
        }
        console.log(string);
    }
    private printTaskTableSingle(selectedTask: TaskObject) {
        let tempTaskTableArray = [{ id: selectedTask.getid(), taskName: selectedTask.getname(), taskDescription: selectedTask.getdescription(), starDate: selectedTask.getstartDate(), dueDate: selectedTask.getdueDate(), subTaskListExisted: selectedTask.getsubTaskList().length > 0 ? 'Yes' : 'No', progress: selectedTask.getProgress() }]
        this.utility.writeNotesOnScreen('Task :- ' + selectedTask.getid());

        printTable(tempTaskTableArray);

        let selectedTaskHasSubTasks = selectedTask.getsubTaskList().length > 0 ? true : false;
        // new SubTask(name, duedate, details, status);
        if (selectedTaskHasSubTasks) {
            let selectedTaskSubtaskList = selectedTask.getsubTaskList();
            // let returnArray: any[]= [];
            let tempTableSubataskArray: any[] = []
            selectedTaskSubtaskList.map((subtask: SubTask) => {
                let objectToPush = { name: subtask.getname(), details: subtask.getdetails(), dueDate: subtask.getdueDate(), priority: subtask.getpriority(), status: subtask.getstatus() }
                tempTableSubataskArray.push(objectToPush);
            })
            this.utility.writeNotesOnScreen("Sub Task Table ;");
            printTable(tempTableSubataskArray);
        } else {
            this.utility.writeNotesOnScreen('There is no subtask to show');
        }
    }

    private async getOptionsToUpdateTask(rl: any, selectedTask: TaskObject) {
        //id: task.getid(), taskName: task.getname(), taskDescription: task.getdescription(), starDate: task.getstartDate(), dueDate: task.getdueDate(), subTaskListExisted: subTaskListFlag, progress: task.getProgress()
        let nameBooleaninput = await rl.question('Do You Want to Update name \n 1. yes \n 2. no \n Enter the option no : ');
        let name = selectedTask.getname();
        if (this.getBooleanOption(parseInt(nameBooleaninput))) {
            name =await rl.question('Enter The name Of the Task : ');
        }
        let descriptionBooleaninput = await rl.question('Do You Want to Update description \n 1. yes \n 2. no \n Enter the option no : ');
        let description = selectedTask.getdescription();
        if (this.getBooleanOption(parseInt(descriptionBooleaninput))) {
            description =await rl.question('Enter The description Of the Task :');
        }
        let startDateBooleaninput = await rl.question('Do You Want to Update startDate \n 1. yes \n 2. no \n Enter the option no : ');
        let startDate = selectedTask.getstartDate();
        if (this.getBooleanOption(parseInt(startDateBooleaninput))) {
            startDate =await rl.question('Enter The startDate Of the Task :');
        }
        let dueDateBooleaninput = await rl.question('Do You Want to Update dueDate \n 1. yes \n 2. no \n Enter the option no : ');
        let dueDate = selectedTask.getdueDate();
        if (this.getBooleanOption(parseInt(dueDateBooleaninput))) {
            dueDate = await rl.question('Enter The dueDate Of the Task : ');
        }
        // ready: 'Ready',
        // inProgress: 'InProgress',
        // extended: 'Extended',
        // terminated: 'Terminated',
        // completed: 'Completed'
        let progressBooleaninput = await rl.question('Do You Want to Update progress \n 1. yes \n 2. no \n Enter the option no : ');
        let progress = selectedTask.getProgress();
        if (this.getBooleanOption(parseInt(progressBooleaninput))) {
            let progressNumber = await rl.question('Enter The progress Of the Task  \n 1. ready \n 2. inProgress \n 3.extended \n  4.abandond \n  5.completed : ');
            progress = this.setTaskProgress(parseInt(progressNumber));
        }

        selectedTask.setname(name);
        selectedTask.setdescription(description);
        selectedTask.setstartDate(startDate);
        selectedTask.setdueDate(dueDate);
        selectedTask.setProgress(progress);
        return selectedTask;
    }
    private setTaskProgress(number: number) {
        let progress: string = "";
        if (number == 1) {
            progress = TaskProgresses.ready;
        }
        if (number == 2) {
            progress = TaskProgresses.inProgress;
        }
        if (number == 3) {
            progress = TaskProgresses.extended;
        }
        if (number == 4) {
            progress = TaskProgresses.terminated;
        }
        if (number == 5) {
            progress = TaskProgresses.completed;
        }
        return progress;
    }
    private getBooleanOption(number: number) {
        return number === 1 ? true : false;
    }
    private async showTableForProject(name: string) {
        const { Table } = require('console-table-printer');
        const { printTable } = require('console-table-printer');
        let table = new Table({
            columns: [
                { name: 'index', title: 'Index', alignment: 'left' },
                { name: 'projectName', title: 'Project Name', alignment: 'left' },
                { name: 'project_details', title: 'Project Details', alignment: 'left' } // with Title as separate Text
            ],
        });
        let index = 0;
        let projectList: Project[] = await this.taskService.getTaskFileFromSystem(name);
        for (let project of projectList) {
            table.addRow({ index: index, projectName: project.getprojectName(), project_details: project.getdetails() });
            index++;
        }

        this.printLine(3);
        // console.log('\n\n\n');
        table.printTable();
        this.printLine(1);
        return projectList;
    }
    private getColourForPriority(priority: string) {
        if (priority === subTaskPriority.low) {
            return ColourForTransactionRow.green;
        } else if (priority === subTaskPriority.mid) {
            return ColourForTransactionRow.yellow;
        } else {
            return ColourForTransactionRow.red;
        }
    }
    private async subTaskOperationMethod(selectedTask: TaskObject, projectName: string, rl: any, name: string) {
        let mainSubataskMenu = await rl.question('Choose From Following Options For Subtasks \n 1. add New subtask \n 2. show Table Of Subtask For more operation : ')
        let taskId = selectedTask.getid();
        switch (parseInt(mainSubataskMenu)) {
            case 1:
                await this.addNewSubtask(rl, name, projectName,taskId );
                break;
            case 2:
                let subTaskList = await this.genrateSubTaskTable(selectedTask);
                let indexOfSubTask = await rl.question('Select Index Of SubTask On Which you Want Perform Operation : ');
                let selectedSubTask = subTaskList[parseInt(indexOfSubTask)];
                let subTaskOptionMenu = await rl.question('Choose The Option Below \n 1. update  Sub Task \n 2. delete subtask \n 3. view subTask Table : ');
                switch (parseInt(subTaskOptionMenu)) {
                    case 1:
                        let taskToUpadate = new SubTask(selectedSubTask.getname(),selectedSubTask.getdueDate(),selectedSubTask.getdetails(),selectedSubTask.getpriority(),selectedSubTask.getstatus());
                        let updatedSubtask=await  this.updateTheSubTask(taskToUpadate,rl);
                        await this.taskService.updateSubTaskInExistingProject(name, projectName,taskId,selectedSubTask,updatedSubtask);
                        break;
                    case 2:
                        await this.taskService.deleteSubTaskInExistingProject(name,projectName,taskId,selectedSubTask);
                        break;
                    case 3:
                        let subTaskList = await this.genrateSubTaskTable(selectedTask);
                        break;
                }
                break;
        }
    }
    private async addNewSubtask(rl: any, aname: string, projectName: string, taskId: number) {
        // new SubTask(name,dueDate,details,priority,status)
        let name = await rl.question('Enter Name of SubTask : ');
        let dueDate = await rl.question('Enter Due Date In the Format Of DD/MM/YYYY : ');
        let details = await rl.question('Enter Details of the SubTasks : ');
        let prioritynumber = await rl.question('Choose The SubTask Priority : \n \t 1. low \n \t 2. mid \n \t 3. high : ');
        let priority = this.setSubTaskPriority(parseInt(prioritynumber));
        let status = subtasksProgresses.new;
        let subTask = new SubTask(name, dueDate, details, priority, status);
        this.taskService.AddSubTaskInTheExistingOrNewProject(aname, projectName, taskId, [subTask])
    }

    private async updateTheSubTask(selectedSubtask: SubTask , rl :any){
        let nameBooleaninput = await rl.question('Do you Want to Update Name \n 1. yes \n 2. no : ');
        let name = selectedSubtask.getname();
        if(this.getBooleanOption(parseInt(nameBooleaninput))){
            name = await rl.question('Enter the Name For SubTask : ');
        }
        let dueDateBooleaninput = await rl.question('Do you Want to Update dueDate \n 1. yes \n 2. no : ');
        let dueDate = selectedSubtask.getdueDate();
        if(this.getBooleanOption(parseInt(dueDateBooleaninput))){
            dueDate = await rl.question('Enter the dueDate For SubTask DD/MM/YYYY in format : ');
        }
        let descriptionBooleaninput = await rl.question('Do you Want to Update description \n 1. yes \n 2. no : ');
        let description = selectedSubtask.getdetails();
        if(this.getBooleanOption(parseInt(descriptionBooleaninput))){
            description =await rl.question('Enter the details For SubTask : ');
        }
        let priorityBooleaninput = await rl.question('Do you Want to Update priority \n 1. yes \n 2. no : ');
        let priority = selectedSubtask.getpriority();
        if(this.getBooleanOption(parseInt(priorityBooleaninput))){
           let priorityNumber = await rl.question('choose priority \n 1. low \n 2. mid \n 3. high Enter the priority option For SubTask : ');
           priority = this.setSubTaskPriority(parseInt(priorityNumber))
        }
        let statusBooleaninput = await rl.question('Do you Want to Update status \n 1. yes \n 2. no : ');
        let status = selectedSubtask.getstatus();
        if(this.getBooleanOption(parseInt(statusBooleaninput))){
            let statusNumber = await rl.question('Enter the option for status ofSubTask : \n 1.ready \n 2. inProgress \n3. done : ');
            status = this.setSubTaskStatus(parseInt(statusNumber));
        }
        selectedSubtask.setname(name);
        selectedSubtask.setdueDate(dueDate);
        selectedSubtask.setdetails(description);
        selectedSubtask.setpriority(priority);
        selectedSubtask.setstatus(status);
        return selectedSubtask;
    }
    private setSubTaskStatus(number: number) {
        if (number === 1) {
            return subtasksProgresses.ready;
        }
        else if (number == 2) {
            return subtasksProgresses.inProgress;
        }
        else {
            return subtasksProgresses.done;
        }

    }
    private setSubTaskPriority(number: number) {
        if (number == 1) {
            return subTaskPriority.low;
        }
        else if (number == 2) {
            return subTaskPriority.mid;
        } else {
            return subTaskPriority.high;
        }

    }
    private genrateSubTaskTable(selectedTask: TaskObject) {
        const { Table } = require('console-table-printer');
        const { printTable } = require('console-table-printer');
        // new SubTask(name,dueDate,details,priority,status)
        let table = new Table({
            columns: [
                { name: 'index', title: 'Index', alignment: 'left' },
                { name: 'name', title: 'Name', alignment: 'left' },
                { name: 'due_date', title: 'Due Date', alignment: 'left' },
                { name: 'details', title: 'Details', alignment: 'left' },
                { name: 'priority', title: 'Priority', alignment: 'left' },
                { name: 'status', title: 'Status', alignment: 'left' }  // with Title as separate Text
            ],
        });
        this.utility.writeNotesOnScreen('Subtask table for ' + selectedTask.getid())
        let subTasksList = selectedTask.getsubTaskList();
        let index = 0;
        for (let subTask of subTasksList) {
            let color = this.getColourForPriority(subTask.getpriority());
            table.addRow({ index: index, name: subTask.getname(), due_date: subTask.getdueDate(), details : subTask.getdetails() ,priority: subTask.getpriority(), status: subTask.getstatus() }, { color: color });
        }
        table.printTable();

        this.printLine(3);
        return subTasksList;
    }
}