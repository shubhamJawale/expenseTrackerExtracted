import { inject, injectable } from "inversify";
import { accountOperations, appStatusCodes, CONSTANTS, filePrefix, fileTypes, LentBorrowTransactionType, loanStatus, transactionCategory, typeOfCreditCardTransaction, typeOfTransaction } from "../constants/constants";
import { Account } from "../models/account";
import TYPES from "../types";
import { FileSystemService } from "./file-system-service";
import { v4 as uuid } from 'uuid'
import { ExpenseTrackerService } from "./expense-tracker-service";
import { ExpenseTrackerOverview } from "../models/expense-tracker-overview";
import { ExpeneseDetailsCsvRow } from "../models/expense-Details-csv-row";
import { Utility } from "../utility/utility";
import { LogWritter } from "../utility/logWritter";
import { LentBorrowTransaction } from "../models/lentBorrowTransaction";
import { LentBorrowTrackingService } from "./lentBorrow-tracking-service";
import { LentBorrowTransactionCsvRow } from "../models/lentBorrowTransactionCsvRow";
import { Loan } from "../models/loan";
import { CreditCardOverviewObject } from "../models/credit-card-overview-object";
import { CreditCardCsvRow } from "../models/credit-card-csv-row";
import { CreditCardModuleService } from "./credit-card-module-service";
import { CreditCardLoanManagementService } from "./credit-card-loan-management-service";


@injectable()
export class AccountService {

    private readonly fileSystemService: FileSystemService;
    private readonly expenseTrackerService: ExpenseTrackerService;
    private readonly utility: Utility;
    private readonly logWritter: LogWritter;
    private readonly lentBorrowTransctionService: LentBorrowTrackingService;
    private readonly creditCardModuleService: CreditCardModuleService;
    private readonly creditCardLoanManagementService: CreditCardLoanManagementService;
    constructor(@inject(TYPES.FileSystemService) _fileSystemService: FileSystemService, @inject(TYPES.ExpenseTrackerService) _expenseTrackerService: ExpenseTrackerService, @inject(TYPES.Utility) _utilty: Utility, @inject(TYPES.LogWritter) _logWritter: LogWritter, @inject(TYPES.LentBorrowTrackingService) _lentBorrowTransactionSetvice: LentBorrowTrackingService, @inject(TYPES.CreditCardModuleService) _creditCardModuleService: CreditCardModuleService, @inject(TYPES.CreditCardLoanManagementService) _creditCaradLaonManagementSerevice: CreditCardLoanManagementService) {
        this.creditCardLoanManagementService = _creditCaradLaonManagementSerevice;
        this.creditCardModuleService = _creditCardModuleService;
        this.lentBorrowTransctionService = _lentBorrowTransactionSetvice;
        this.logWritter = _logWritter;
        this.utility = _utilty;
        this.expenseTrackerService = _expenseTrackerService;
        this.fileSystemService = _fileSystemService;
    }
    public async fetchSpacificAccount(name: string, accountList?: Account[]) {
        if (accountList) {
            let account = accountList.find((element: Account) => element.getname() === name);
            return account;
        }
        else {
            let accountLists = await this.fetchAccountList();
            let account = accountLists.find((element: Account) => element.getname() === name);
            return account;
        }
    }

    public async getAccountBalance(name: any) {

    }
    public async deleteAccount(name: string) {
        const accountPath = CONSTANTS.filePath + CONSTANTS.accountPath;
        let fetchAccountList = await this.fetchAccountList();
        let fetchSpacificAccount = await this.fetchSpacificAccount(name, fetchAccountList);
        if (fetchSpacificAccount) {
            let indexOfAccount = fetchAccountList.indexOf(fetchSpacificAccount);
            fetchAccountList.splice(indexOfAccount, 1);
        }
        let response = await this.fileSystemService.saveJsonData(CONSTANTS.accountFileName, accountPath, fetchAccountList);
        return {
            statusCode: appStatusCodes.success,
            message: "account deleted Succefully, we will remove files While Cleaning"
        }

    }
    public async fetchAccountList() {
        const accountPath = CONSTANTS.filePath + CONSTANTS.accountPath;
        let accountListJson = await this.fileSystemService.getJsonFromFile(CONSTANTS.accountFileName, accountPath);
        // console.log(accountListJson);
        let AccountObjectList = Account.fetchListObjectOfAccounts(accountListJson);
        return AccountObjectList;
    }
    public async fetchSapcificAccountDetails(name: any) {
        const accountPath = CONSTANTS.filePath;
        let accountListJson = await this.fileSystemService.getJsonFromFile(`${name}_${CONSTANTS.transctionObjectFileName}`, accountPath);
        // console.log(accountListJson);
        let AccountObjectList = ExpenseTrackerOverview.fromJson(accountListJson);
        return AccountObjectList;
    }
    public async createOrUpdateAccount(name: string, email: string, details?: string, /* newName?: string */) {
        const accountPath = CONSTANTS.filePath + CONSTANTS.accountPath;
        let jsonDataToWriteForAccountArray: Account[] = [];
        let message: string = "";
        let statusCode: number = 0;
        let accountCheckFlag = await this.checkAccountIfExists();
        if (accountCheckFlag.statusCode == appStatusCodes.success) {

            let accountListObjectList = await this.fetchAccountList();
            // this method is for updating account
            let account = await this.fetchSpacificAccount(name, accountListObjectList);
            //accountListObjectList.find((accountElement: Account) => accountElement.getname() === name);
            if (account) {
                let UpdatedAccount: Account = new Account("", "", "", "");
                let id = account.getid() ? account.getid() : "";
                UpdatedAccount.setid(id);
                if (details) {
                    UpdatedAccount.setdetails(details);
                }
                // if (newName) {
                UpdatedAccount.setname(account.getname());
                // }
                UpdatedAccount.setEmail(email)
                let indexOfAccount = accountListObjectList.indexOf(account);
                if (indexOfAccount != -1) {
                    accountListObjectList[indexOfAccount] = UpdatedAccount;
                }
                jsonDataToWriteForAccountArray = accountListObjectList;
                message = "Account Updated";
                statusCode = appStatusCodes.success;
                this.logWritter.writeLogs('Account Updated ' + name, filePrefix.transction);
            } else {
                details = details ? details : "new account created for " + name;
                let account = new Account(uuid(), name, details, email);
                accountListObjectList.push(account);
                jsonDataToWriteForAccountArray = accountListObjectList;
                message = "Account Created";
                statusCode = appStatusCodes.success;
                await this.createDefaultAccountFiles(name);
                this.logWritter.writeLogs('Account Created ' + name, filePrefix.transction);
            }
        } else {
            details = details ? details : "";
            let account = new Account(uuid(), name, details, email);
            jsonDataToWriteForAccountArray = [account];
            statusCode = appStatusCodes.success;
            message = "Account Created";
            await this.createDefaultAccountFiles(name);
            this.logWritter.writeLogs('Account Created ' + name, filePrefix.transction);
        }
        let response = await this.fileSystemService.saveJsonData(CONSTANTS.accountFileName, accountPath, jsonDataToWriteForAccountArray);
        return {
            statusCode: statusCode,
            message: message
        }
    }
    public async createDefaultAccountFiles(name: string) {
        let expenseDetailsOverview = new ExpenseTrackerOverview(name, 0, 0, 0, 0, 0, (Date.now().toString()))
        await this.expenseTrackerService.AddAccountOrUpdateAccount(expenseDetailsOverview, name);
        let expenseTrackerCsvRow = new ExpeneseDetailsCsvRow(uuid(), "Opening Transaction", "Accont Opened", "0", "0", transactionCategory[10], typeOfTransaction.income, await this.utility.convertTimeStamp((Date.now())))
        await this.expenseTrackerService.addTransactionToCSV(expenseTrackerCsvRow, name);
        // let lentBorrowDetailsSingle = new LentBorrowTransaction(name, LentBorrowTransactionType.lent, 0);
        // await this.lentBorrowTransctionService.updateOrCreateLetBorrowAccountDetils(name, lentBorrowDetailsSingle, LentBorrowTransactionType.lent);
        // let lentBorrowTransactionCsvRow = new LentBorrowTransactionCsvRow(name, LentBorrowTransactionType.lent, 0, await this.utility.convertTimeStamp(Date.now()));
        // await this.lentBorrowTransctionService.addTransactionToLentBorrowCsv(name, lentBorrowTransactionCsvRow);
        await this.lentBorrowTransctionService.addOrUpdateLentBorrowAccount(name, 'initial transction', LentBorrowTransactionType.lent, 0, "first empty Transaction");
        let loan = new Loan("", "", "", "", 0, 0, 0, 0, 0, "", [], loanStatus.cloased, "first empty loan", 0);
        let creditCardOverviewFile = new CreditCardOverviewObject(name, 0, 0, 0, 0, Date.now(), 0, 0, 0);
        let creditCardCsv = new CreditCardCsvRow(uuid(), "initial transacation", 0, 0, "first empty transaction", "", typeOfCreditCardTransaction.billPayed, 0, Date.now(), true);
        await this.creditCardModuleService.addOrUpdateCardOverviewAccount(name, creditCardOverviewFile);
        await this.creditCardModuleService.addTransactionToCSV(name, creditCardCsv);
        await this.creditCardLoanManagementService.addLoanToTheFile(name, loan);
    }
    public async checkAccountIfExists() {
        const accountPath = CONSTANTS.filePath + CONSTANTS.accountPath;
        let accountListIfExistFlag = await this.fileSystemService.checkFileExists(CONSTANTS.accountFileName, accountPath, fileTypes.json);

        if (accountListIfExistFlag) {
            return {
                statusCode: appStatusCodes.success,
                message: "Account file Exists"
            }
        }
        else {
            return {
                statusCode: appStatusCodes.fileNotFound,
                message: "Account file Does Not Exists"
            };
        }
    }
}