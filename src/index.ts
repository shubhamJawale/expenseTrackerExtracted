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
let driverService = new DriverService();

let readLine = driverService.takeInput(readline);
let prompt = driverService.createPrompt(readLine);
let fsClient = new FSClient();
let utility = new Utility();
let logWritter = new LogWritter(fsClient, utility);
let fileSystemService = new FileSystemService(fsClient, logWritter);
let expense = new ExpenseTrackerService(fileSystemService, logWritter, utility);
let account = new AccountService(fileSystemService, expense, utility, logWritter);
let printName = async () => {
    // let response = await expense.AddTransactionToAnOldAccount(1000, typeOfTransaction.income, transactionCategory.other, "test transacton", "testing", 'shubham')
    //await account.createDefaultAccountFiles('shubham');
    let response = await account.createOrUpdateAccount("somnath", "my salaryAccount");
    console.log(response);
}

printName();