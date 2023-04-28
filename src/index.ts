import "reflect-metadata";
import { DriverService } from "./services/driver-service";
import * as readline from 'readline';
import { ExpenseTrackerService } from "./services/expense-tracker-service";
import { FileSystemService } from "./services/file-system-service";
import { FSClient } from "./clients/fs-client";
import { LogWritter } from "./utility/logWritter";
import { ExpeneseDetailsCsvRow } from "./models/expense-Details-csv-row";
import { CONSTANTS, fileTypes, transactionCategory, typeOfTransaction } from "./constants/constants";

// temp imports
import { Utility } from "./utility/utility";
import { AccountService } from "./services/account-service";
import { CommonService } from "./services/common-service";
import { ExpenseAppCLIService } from "./services/expense-app-cli-service";
import { Account } from "./models/account";
import { LentBorrowTrackingService } from "./services/lentBorrow-tracking-service";
import { LentBorrowTrackingCLIService } from "./services/lentBorrow-tracking-CLI-service";
import { TaskService } from "./services/task-services/task-service";
import { TaskServiceClient } from "./services/task-services/task-service-CLI";
let driverService = new DriverService();

let readLine = driverService.takeInput(readline);
let prompt = driverService.createPrompt(readLine);
let fsClient = new FSClient();
let utility = new Utility();
let logWritter = new LogWritter(fsClient, utility);
let fileSystemService = new FileSystemService(fsClient, logWritter);
let expense = new ExpenseTrackerService(fileSystemService, logWritter, utility);
let lentBorrow = new LentBorrowTrackingService(fileSystemService, logWritter, utility);
let lentBorrowCLI = new LentBorrowTrackingCLIService(lentBorrow);
let taskService = new TaskService(fileSystemService,utility,logWritter);
let account = new AccountService(fileSystemService, expense, utility, logWritter, lentBorrow,taskService);
let taskCli = new TaskServiceClient(taskService,utility,account);
let erxpenseappclientsvc = new ExpenseAppCLIService(account, driverService, expense, utility, lentBorrowCLI);
let common = new CommonService(account, driverService, erxpenseappclientsvc,taskCli);
let printName = async () => {
    // let response = await expense.AddTransactionToAnOldAccount(1000, typeOfTransaction.income, transactionCategory.other, "test transacton", "testing", 'shubham')
    //await account.createDefaultAccountFiles('shubham');
    //let response = await account.createOrUpdateAccount("somnath", "my salaryAccount");
    // console.log(response);
    common.getMainConsole(); // this is main methods
    // let rl = readline.createInterface({
    //     input: process.stdin,
    //     output: process.stdout
    // });
    // let account: Account = new Account('1', 'shubham', 'anything');
    // erxpenseappclientsvc.AfterLogInMenu('shubham', rl, account)
// taskCli.mainMethodToDriveTheTaskApp('shubham')
}

printName();