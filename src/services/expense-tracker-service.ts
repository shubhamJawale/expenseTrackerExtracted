import { inject } from "inversify/lib/annotation/inject";
import { injectable } from "inversify/lib/annotation/injectable";
import { appStatusCodes, CONSTANTS, filePrefix, fileTypes, typeOfTransaction } from "../constants/constants";
import TYPES from "../types";
import { FileSystemService } from "./file-system-service";
import { ExpeneseDetailsCsvRow } from "../models/expense-Details-csv-row";
import { LogWritter } from "../utility/logWritter";
import { ExpenseTrackerOverview } from "../models/expense-tracker-overview";
import { v4 as uuid } from 'uuid'
import { Utility } from "../utility/utility";
import { FileUtility } from "../utility/fileUtility";

@injectable()
export class ExpenseTrackerService {
    private readonly fileSystemService: FileSystemService;
    private readonly logWritter: LogWritter;
    private readonly utility: Utility;
    private readonly fileUtility: FileUtility;
    constructor(@inject(TYPES.FileSystemService) _fileSystemService: FileSystemService, @inject(TYPES.LogWritter) _logWritter: LogWritter, @inject(TYPES.Utility) _utility: Utility, @inject(TYPES.FileUtility) _fileUtility: FileUtility) {
        this.fileUtility = _fileUtility;
        this.utility = _utility;
        this.logWritter = _logWritter;
        this.fileSystemService = _fileSystemService;
    }

    public async checkAccountExistsOrNot() { }


    //two things will change first universal object
    //second the csv file will add line to it
    public async AddTransactionToAnOldAccount(ammount: number, transactionType: string, transactionCategory: string, transactionDetails: string, transactionName: string, accountName: string) {
        let jsonObject = await this.fileUtility.fetchJSONOrCSVFile(`${accountName}_${CONSTANTS.transctionObjectFileName}`, CONSTANTS.filePath, fileTypes.json);
        // console.log(jsonObject)
        let oldOverview = ExpenseTrackerOverview.fromJson(jsonObject);
        // console.log(oldOverview);
        let oldTotalIncome = oldOverview.gettotalIncome();
        let oldTotalIncomeForMonth = oldOverview.gettotalIncomeForMonth();
        let oldTotalExpenditure = oldOverview.gettotalExpenditure();
        let oldTotalExpenditureForMOnth = oldOverview.gettotalExpenditureForMonth();
        let oldAccountBalance = oldOverview.getaccountBalance();
        let oldRecordDate = oldOverview.getDateForTheRecord();
        //checking for currentmonth
        let currentMonthFlag = await this.utility.checkIsCurrentMonth(parseInt(oldRecordDate));
        oldOverview.SetDateForTheRecord((Date.now()).toString());
        if (transactionType == typeOfTransaction.expenditure) {
            oldOverview.setaccountBalance(/* (parseFloat( */oldAccountBalance/* ) */ - ammount/* s */);
            oldOverview.settotalExpenditure(oldTotalExpenditure + ammount);
            if (currentMonthFlag) {
                oldOverview.settotalExpenditureForMonth(oldTotalExpenditureForMOnth + ammount);
            } else {
                oldOverview.settotalExpenditureForMonth(ammount);
            }
        } else {
            oldOverview.setaccountBalance(/* (parseFloat( */oldAccountBalance/* ) */ + ammount)/* .toString() )*/;
            oldOverview.settotalIncome(oldTotalIncome + ammount);
            if (currentMonthFlag) {
                oldOverview.settotalIncomeForMonth(oldTotalIncomeForMonth + ammount);
            } else {
                oldOverview.settotalIncomeForMonth(ammount);
            }
        }

        let newTransactionRow = new ExpeneseDetailsCsvRow(uuid(), transactionName, transactionDetails, ammount.toString(), oldOverview.getaccountBalance().toString(), transactionCategory, transactionType, await this.utility.convertTimeStamp(Date.now()));
        // console.log(newTransactionRow)
        let responseToUpdateOverview = this.AddAccountOrUpdateAccount(oldOverview, accountName);
        let responseToSaveTransaction = this.addTransactionToCSV(newTransactionRow, accountName);
        return appStatusCodes.success;
    }

    //add or update account
    public async AddAccountOrUpdateAccount(expenseDetailsOverview: ExpenseTrackerOverview, name: string) {
        // console.log(`${name}_${CONSTANTS.transctionObjectFileName}`, CONSTANTS.filePath, expenseDetailsOverview)
        let response = await this.fileSystemService.saveJsonData(`${name}_${CONSTANTS.transctionObjectFileName}`, CONSTANTS.filePath, expenseDetailsOverview);
        await this.logWritter.writeLogs("the Transaction overall details are updated", filePrefix.transction)
        return response;
    }
    // fetching file

    //this is just the csv transaction change 
    // TODO : the csv changes should be done in this method
    public async addTransactionToCSV(expeneseDetailsCsvRow: ExpeneseDetailsCsvRow, accountName: string) {
        let currentTimeStamp: number = Date.now();
        let currentDate: Date = new Date(currentTimeStamp);
        let monthAndYearString: string;
        if (await this.utility.checkIsCurrentMonth(currentTimeStamp)) {
            monthAndYearString = this.utility.convertTheMonthFromNumberToSting(currentDate.getMonth()) + "-" + currentDate.getFullYear();
        }
        else {
            monthAndYearString = this.utility.convertTheMonthFromNumberToSting(currentDate.getMonth() + 1) + "-" + currentDate.getFullYear();
        }
        let response: any;
        let filename = `${accountName}_${CONSTANTS.csvFileName}_${monthAndYearString}`;
        let filePath = CONSTANTS.filePath;
        if (await this.fileSystemService.checkFileExists(filename, filePath, fileTypes.csv)) {
            let newRow = ['\n', expeneseDetailsCsvRow.getId(), ",", expeneseDetailsCsvRow.gettransactionName(), ",", expeneseDetailsCsvRow.getdetails(), ",", expeneseDetailsCsvRow.getammount(), ",", expeneseDetailsCsvRow.gettotalAccountBalance(), ",", expeneseDetailsCsvRow.getcategory(), ",", expeneseDetailsCsvRow.gettypeOfTransaction(), ",", expeneseDetailsCsvRow.getDateForTheTransaction()];
            // console.log(newRow);
            response = await this.fileSystemService.appendLineToFile(filename, filePath, newRow, fileTypes.csv);
            await this.logWritter.writeLogs("the Transaction is Added To Csv for id : " + expeneseDetailsCsvRow.getId(), filePrefix.transction);
            //console.log(`${accountName}:${CONSTANTS.csvFileName}`, CONSTANTS.filePath, newRow)
        } else {
            let newRow = expeneseDetailsCsvRow;
            let rowArray = [newRow]
            response = await this.fileSystemService.saveCSVData(filename, filePath, rowArray);
            await this.logWritter.writeLogs("the Transaction is Added To Csv for id : " + expeneseDetailsCsvRow.getId(), filePrefix.transction)
            //console.log(`${accountName}:${CONSTANTS.csvFileName}`, CONSTANTS.filePath, rowArray)
        }
        return response;
    }

}
