import { inject, injectable } from "inversify";
import { FileSystemService } from "./file-system-service";
import { LogWritter } from "../utility/logWritter";
import TYPES from "../types";
import { CreditCardCsvRow } from "../models/credit-card-csv-row";
import { CONSTANTS, filePrefix, fileTypes, loanStatus, typeOfCreditCardTransaction, typeOfTransaction } from "../constants/constants";
import { CreditCardOverviewObject } from "../models/credit-card-overview-object";
import { FileUtility } from "../utility/fileUtility";
import { Utility } from "../utility/utility";
import { v4 as uuid } from 'uuid'
import { Loan } from "../models/loan";

@injectable()
export class CreditCardModuleService {
    private readonly fileSystemService: FileSystemService;
    private readonly logWritter: LogWritter;
    private readonly fileUtility: FileUtility;
    private readonly utility: Utility;
    constructor(@inject(TYPES.FileSystemService) _fileSystemService: FileSystemService, @inject(TYPES.LogWritter) _logWritter: LogWritter, @inject(TYPES.FileUtility) _fileUtility: FileUtility, @inject(TYPES.Utility) _utility: Utility) {
        this.fileUtility = _fileUtility;
        this.logWritter = _logWritter;
        this.fileSystemService = _fileSystemService;
        this.utility = _utility;
    }
    // to change the overview object and append the csv file
    //(accountHolderName: string, totalExpenditureForMonthOnCard: number, totalBillPayedForMonthOnCard: number, totalBillPayed: number, totalExpenditure: number, timeStamp: number, balanceBill: number, totalDeflaction: number, noOfActiveLoans: number)
    // (transactionId: string, transactionName: string, ammount: number, expenditureAmmount: number, details: string, date: number)
    public async addOrUpdateTheCardAccount(transactionName: string, amount: number, details: string, accountName: string, transactionType: string, actualAmmountOfTransaction: number, needFlag: boolean) {
        let filename = `${accountName}_${CONSTANTS.creditCardOverviewFile}`;
        let filePath = CONSTANTS.filePath;
        // fetching old credit card review file
        let oldJsonFile = await this.fileUtility.fetchJSONOrCSVFile(filename, filePath, fileTypes.json);
        let oldCreditCardOverviewObject: CreditCardOverviewObject = CreditCardOverviewObject.fromJson(oldJsonFile);
        // fetching the old credit car loan object file
        let creditLoanfilename = `${accountName}_${CONSTANTS.loanFileName}`;
        let creditLoanfilapath = CONSTANTS.filePath;
        let oldCreditLoanJsonFile = await this.fileUtility.fetchJSONOrCSVFile(creditLoanfilename, creditLoanfilapath, fileTypes.json);
        let loanArray = Loan.getLoanObjectFromJSON(oldCreditLoanJsonFile);
        let activeLoanCount = 0;
        loanArray.forEach((loan: Loan) => {
            if (loan.getLoanStatus() === loanStatus.active) {
                activeLoanCount++;
            }
        })
        let oldMonthlyExpnediture = oldCreditCardOverviewObject.getTotalExpenditureForMonthOnCard();
        let oldMonthlyBillPayed = oldCreditCardOverviewObject.getTotalBillPayedForMonthOnCard();
        let oldTotalBillPayed = oldCreditCardOverviewObject.getTotalBillPayed();
        let oldTotalExpnediture = oldCreditCardOverviewObject.getTotalExpenditure();
        let oldBalanceBill = oldCreditCardOverviewObject.getBalanceBill();
        let oldTimeStamp = oldCreditCardOverviewObject.getTimeStamp();
        let oldDeflaction = oldCreditCardOverviewObject.getTotalDeflection();
        //will fech the active loans count from the file (credit loan)
        oldCreditCardOverviewObject.setNoOfActiveLoans(activeLoanCount);
        // let newtotalMonthlyExpendature = oldCreditCardOverviewObject.getTotalExpenditureForMonthOnCard();
        let checkIsCurrentMonth = await this.utility.checkIsCurrentMonth(oldTimeStamp)
        if (checkIsCurrentMonth) {

            if (typeOfCreditCardTransaction.expenditure === transactionType) {
                let deflection = actualAmmountOfTransaction - amount;
                let newtotalMonthlyExpendature = oldMonthlyExpnediture + amount;
                let newBalanceBill = oldBalanceBill + amount;
                let newTotalExpenditure = oldTotalExpnediture + amount;
                oldCreditCardOverviewObject.setBalanceBill(newBalanceBill);
                oldCreditCardOverviewObject.setTotalExpenditure(newTotalExpenditure);
                oldCreditCardOverviewObject.setTotalExpenditureForMonthOnCard(newtotalMonthlyExpendature);
                oldCreditCardOverviewObject.setTotalDeflection(oldDeflaction + deflection);
            } else {
                let newTotalBillPayed = oldTotalBillPayed + amount;
                let newTotalMonthlyBillPayed = oldMonthlyBillPayed + amount;
                let newTotalBalanceBill = oldBalanceBill - amount;
                oldCreditCardOverviewObject.setBalanceBill(newTotalBalanceBill);
                oldCreditCardOverviewObject.setTotalBillPayed(newTotalBillPayed);
                oldCreditCardOverviewObject.setTotalBillPayedForMonthOnCard(newTotalMonthlyBillPayed)
            }
        } else {
            if (transactionType == typeOfCreditCardTransaction.expenditure) {
                oldCreditCardOverviewObject.setBalanceBill(oldBalanceBill + amount);
                oldCreditCardOverviewObject.setTotalExpenditure(oldTotalExpnediture + amount);
                oldCreditCardOverviewObject.setTotalExpenditureForMonthOnCard(amount);
            } else {
                oldCreditCardOverviewObject.setBalanceBill(oldBalanceBill - amount);
                oldCreditCardOverviewObject.setTotalBillPayed(oldTotalBillPayed + amount);
                oldCreditCardOverviewObject.setTotalBillPayedForMonthOnCard(amount);
            }
        }
        oldCreditCardOverviewObject.setTimeStamp(Date.now());
        let updateOverview = await this.addOrUpdateCardOverviewAccount(accountName, oldCreditCardOverviewObject);
        let transactionDate = await this.utility.convertTimeStamp(Date.now());
        let updateCsvCreditCard = this.addTransactionToCSV(accountName, new CreditCardCsvRow(uuid(), transactionName, amount, oldCreditCardOverviewObject.getTotalExpenditureForMonthOnCard(), details, transactionDate, transactionType, actualAmmountOfTransaction, Date.now(), needFlag));

    }

    // (accountHolderName: string, totalExpenditureForMonthOnCard: number, totalBillPayedForMonthOnCard: number, totalBillPayed: number, totalExpenditure: number, timeStamp: number, balanceBill: number, totalDeflaction: number, noOfActiveLoans: number)
    public async addOrUpdateCardOverviewAccount(name: string, creditCardOverviewObject: CreditCardOverviewObject) {
        // console.log(`${name}_${CONSTANTS.creditCardOverviewFile}`, CONSTANTS.filePath, creditCardOverviewObject)
        let response = await this.fileSystemService.saveJsonData(`${name}_${CONSTANTS.creditCardOverviewFile}`, CONSTANTS.filePath, creditCardOverviewObject);
        await this.logWritter.writeLogs("the credit card transaction overall details are updated", filePrefix.transction)
        return response;
    }


    public async addTransactionToCSV(accountName: string, creditCardCsvRow: CreditCardCsvRow) {
        let response: any;
        let currentTimeStamp: number = Date.now();
        let currentDate: Date = new Date(currentTimeStamp);
        let monthAndYearString: string;
        if (await this.utility.checkIsCurrentMonth(currentTimeStamp, CONSTANTS.creditCardBillDay)) {
            monthAndYearString = this.utility.convertTheMonthFromNumberToSting(currentDate.getMonth()) + "-" + currentDate.getFullYear();
        }
        else {
            monthAndYearString = this.utility.convertTheMonthFromNumberToSting(currentDate.getMonth() + 1) + "-" + currentDate.getFullYear();
        }
        let filename = `${accountName}_${CONSTANTS.creditCardCsvFileName}_${monthAndYearString}`;
        let filePath = CONSTANTS.filePath;
        // (transactionId: string, transactionName: string, ammount: number, expenditureAmmount: number, details: string, date: string, typeofTransaction: string, actualAmmountOfTransaction: number, timeStamp: number, countInNeed: boolean)
        if (await this.fileSystemService.checkFileExists(filename, filePath, fileTypes.csv)) {
            let newRow = ['\n', creditCardCsvRow.getTransactionId(), ",", creditCardCsvRow.getTransactionName(), ",", creditCardCsvRow.getAmmount().toString(), ",", creditCardCsvRow.getExpenditureAmmount().toString(), ",", creditCardCsvRow.getDetails(), ",", creditCardCsvRow.getDate(), ",", creditCardCsvRow.getTransactionType(), ",", creditCardCsvRow.getActualAmmountOfTransaction().toString(), ",", creditCardCsvRow.getTimeStamp().toString(), ",", creditCardCsvRow.getCountInNeed().toString()]
            response = await this.fileSystemService.appendLineToFile(filename, filePath, newRow, fileTypes.csv);
            await this.logWritter.writeLogs("the credit card Transaction is Added To Csv for id : " + creditCardCsvRow.getTransactionId(), filePrefix.transction);
            //console.log(`${accountName}:${CONSTANTS.csvFileName}`, CONSTANTS.filePath, newRow)
        } else {
            let newRow = creditCardCsvRow;
            let rowArray = [newRow]
            response = await this.fileSystemService.saveCSVData(filename, filePath, rowArray);
            await this.logWritter.writeLogs("the credit card Transaction is Added To Csv for id : " + creditCardCsvRow.getTransactionId(), filePrefix.transction)
            //console.log(`${accountName}:${CONSTANTS.csvFileName}`, CONSTANTS.filePath, rowArray)
        }
        return response;
    }
}