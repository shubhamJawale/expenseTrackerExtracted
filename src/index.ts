import "reflect-metadata"; 1
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
import { FileUtility } from "./utility/fileUtility";
import { CreditCardLoanCli } from "./services/credit-card-loan-cli-service";
import { CreditCardModuleService } from "./services/credit-card-module-service";
import { CreditCardLoanManagementService } from "./services/credit-card-loan-management-service";
import { CreditCardCLIService } from "./services/credit-card-modul-cli-service";
let fsClient = new FSClient();
let utility = new Utility("started");
let logWritter = new LogWritter(fsClient, utility);
let driverService = new DriverService(utility);
let readLine = driverService.takeInput(readline);
let prompt = driverService.createPrompt(readLine);
let fileSystemService = new FileSystemService(fsClient, logWritter);
let fileUtility = new FileUtility(fileSystemService)
let expense = new ExpenseTrackerService(fileSystemService, logWritter, utility, fileUtility);
let lentBorrow = new LentBorrowTrackingService(fileSystemService, logWritter, utility);
let lentBorrowCLI = new LentBorrowTrackingCLIService(lentBorrow);
let creditCardModuleService = new CreditCardModuleService(fileSystemService, logWritter, fileUtility, utility);
let creditCardLoanService = new CreditCardLoanManagementService(fileSystemService, logWritter, fileUtility, utility);
let creditCardLoanCli = new CreditCardLoanCli(utility, creditCardModuleService, creditCardLoanService, fileUtility);
let creditCardCli = new CreditCardCLIService(utility, creditCardModuleService, creditCardLoanService, fileUtility, creditCardLoanCli);
let account = new AccountService(fileSystemService, expense, utility, logWritter, lentBorrow, creditCardModuleService, creditCardLoanService);
let erxpenseappclientsvc = new ExpenseAppCLIService(account, driverService, expense, utility, lentBorrowCLI, creditCardCli);
let common = new CommonService(account, driverService, erxpenseappclientsvc);
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