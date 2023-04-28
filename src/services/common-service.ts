import { inject, injectable } from "inversify";
import TYPES from "../types";
import { AccountService } from "./account-service";
import { DriverService } from "./driver-service";
import * as readline from 'node:readline/promises';
import { ExpenseAppCLIService } from "./expense-app-cli-service";
import { TaskServiceClient } from "./task-services/task-service-CLI";
@injectable()
export class CommonService {
    private readonly accountService: AccountService;
    private readonly driverService: DriverService;
    private readonly expenseClientService: ExpenseAppCLIService;
    private readonly taskServiceClientService : TaskServiceClient;
    constructor(@inject(TYPES.AccountService) _accountService: AccountService, @inject(TYPES.DriverService) _driverService: DriverService, @inject(TYPES.ExpeneseAppCliService) _expenseClientService: ExpenseAppCLIService, @inject(TYPES.TaskServiceClient) _taskServiceClient : TaskServiceClient) {
        this.expenseClientService = _expenseClientService;
        this.taskServiceClientService = _taskServiceClient;
        this.accountService = _accountService;
        this.driverService = _driverService;
    }


    public async getMainConsole() {


        // rl.close;
        // return prompt;
        // let prompt = this.driverService.tak(readLine);//this.driverService.createSyncPrompt();
        this.appTitle();
        await this.appChooseMenu();

    }

    public async appChooseMenu() {
        // let rl = this.driverService.takeInput(readline);
        let rl = readline.createInterface({
            input: process.stdin,
            output: process.stdout
        });
        console.log('++++++++++++++++++++++++++++++++++++++++++++++++++');

        let appChoose: string = "";
        appChoose = await rl.question('Choose The App \n 1. Expense Tracker \n 2. Task Manager \n[dont get alerted if console takes double digits of choosen option] \n[Enter the app number of your prefernce] : => ')
        switch (parseInt(appChoose)) {
            case 1:
              await  this.expenseClientService.mainApplicationMethod(rl)
                break;
            case 2:
              await this.taskServiceClientService.logIn(rl);
                break;
        }
        // const answer = await rl.question('What is your favorite food? ');
        // console.log(`Oh, so your favorite food is ${answer}`);
        // rl.close();
    }

    public appTitle() {
        console.log('++++++++++++++++++++++++++++++++++++++++++++++++++');
        console.log('++++++++++++++++++++++++++++++++++++++++++++++++++');
        console.log("+++++++++++Expenditure And Task Manager+++++++++++");
        console.log('++++++++++++++++++++++++++++++++++++++++++++++++++');
        console.log('++++++++++++++++++++++++++++++++++++++++++++++++++');
    }
}