import { inject, injectable } from "inversify";
import TYPES from "../types";
import { FileSystemService } from "./file-system-service";
import { CONSTANTS, LentBorrowTransactionType, filePrefix, fileTypes } from "../constants/constants";
import { LentBorrowTransaction } from "../models/lentBorrowTransaction";
import { LogWritter } from "../utility/logWritter";
import { LentBorrowTransactionCsvRow } from "../models/lentBorrowTransactionCsvRow";
import { Utility } from "../utility/utility";

@injectable()
export class LentBorrowTrackingService {
    private readonly fileSystemService;
    private readonly logWritter;
    private readonly utility;
    constructor(@inject(TYPES.FileSystemService) _fileSystemService: FileSystemService, @inject(TYPES.LogWritter) _logWritter: LogWritter, @inject(TYPES.Utility) _utility: Utility) {
        this.utility = _utility;
        this.logWritter = _logWritter;
        this.fileSystemService = _fileSystemService;
    }

    public async updateOrCreateLetBorrowAccountDetils(name: string, lentBorrowDetailsSingle: LentBorrowTransaction, type: string) {
        let fileName = `${name}_${CONSTANTS.lentBorrowJsonFileName}`;
        let oldJsonFile = await this.fileSystemService.getJsonFromFile(fileName, CONSTANTS.filePath);
        let jsonToSave: LentBorrowTransaction[] = [];
        // console.log(oldJsonFile);
        if (oldJsonFile !== 'File Does Not Exists') {
            let oldjson = LentBorrowTransaction.fromJson(oldJsonFile)
            let acName = lentBorrowDetailsSingle.getname();
            let DetailsOfAccountOld = oldjson.find((lentBorrowDetailsSingleOld: LentBorrowTransaction) => lentBorrowDetailsSingleOld.getname() === acName);
            if (DetailsOfAccountOld) {
                // console.log(DetailsOfAccountOld)
                let result = 0;
                let oldAmmount = DetailsOfAccountOld.getammount();
                let newAmmount = lentBorrowDetailsSingle.getammount();
                if (type === LentBorrowTransactionType.borrow) {
                    result = oldAmmount + (-newAmmount);
                    lentBorrowDetailsSingle.setammount(result)
                } else {
                    result = oldAmmount + (newAmmount);
                    lentBorrowDetailsSingle.setammount(result);
                }
                if (result >= 0) {
                    lentBorrowDetailsSingle.settype(LentBorrowTransactionType.lent);
                } else {
                    lentBorrowDetailsSingle.settype(LentBorrowTransactionType.borrow);
                }
                let indexOfOldAccount = oldjson.indexOf(DetailsOfAccountOld)
                // console.log(indexOfOldAccount);
                if (indexOfOldAccount || indexOfOldAccount == 0) {
                    // console.log('come')
                    oldjson[indexOfOldAccount] = lentBorrowDetailsSingle;
                    jsonToSave = oldjson;
                    let fileResponse = await this.fileSystemService.saveJsonData(fileName, CONSTANTS.filePath, jsonToSave);
                    await this.logWritter.writeLogs('LentBorrowAccountDetails updated', filePrefix.transction);
                }
            } else {
                let oldjson = LentBorrowTransaction.fromJson(oldJsonFile);
                let objectToPush = JSON.parse(JSON.stringify(oldjson));
                if (type === LentBorrowTransactionType.borrow) {
                    let ammount = 0 - lentBorrowDetailsSingle.getammount();
                    lentBorrowDetailsSingle.setammount(ammount);
                }
                objectToPush.push(lentBorrowDetailsSingle);
                // oldjson.push(lentBorrowDetailsSingle);
                // console.log(objectToPush);
                jsonToSave = objectToPush;
                let fileResponse = await this.fileSystemService.saveJsonData(fileName, CONSTANTS.filePath, jsonToSave);
                await this.logWritter.writeLogs('LentBorrowAccountDetails Added', filePrefix.transction);
            }
        }
        else {
            jsonToSave = [lentBorrowDetailsSingle];
            let fileResponse = await this.fileSystemService.saveJsonData(fileName, CONSTANTS.filePath, jsonToSave);
            await this.logWritter.writeLogs('LentBorrowAccountDetails Added', filePrefix.transction);
        }
    }

    public async getLentBorrowAccountDetailsAll(name: string) {
        let fileName = `${name}_${CONSTANTS.lentBorrowJsonFileName}`;
        let oldJsonFile = await this.fileSystemService.getJsonFromFile(fileName, CONSTANTS.filePath);
        let oldjson = LentBorrowTransaction.fromJson(oldJsonFile);
        return oldjson;
    }

    public async getLentBorrowDetailsSingle(name: string, accountDetailsName: string) {
        let fileName = `${name}_${CONSTANTS.lentBorrowJsonFileName}`;
        let oldJsonFile = await this.fileSystemService.getJsonFromFile(fileName, CONSTANTS.filePath);
        let oldjson = LentBorrowTransaction.fromJson(oldJsonFile);
        let account = oldjson.find((element: LentBorrowTransaction) => element.getname() === accountDetailsName)
        return account;
    }

    public async addTransactionToLentBorrowCsv(name: string, lentBorrowDetailsSingle: LentBorrowTransactionCsvRow) {
        let fileName = `${name}_${CONSTANTS.lentBorrowJsonFileName}`;
        let filePath = CONSTANTS.filePath;
        if (await this.fileSystemService.checkFileExists(fileName, filePath, fileTypes.csv)) {
            //let fileData = new LentBorrowTransaction(accountName, type, ammount);
            let newRow = ['\n', lentBorrowDetailsSingle.getname(), ", ", lentBorrowDetailsSingle.gettype(), ", ", lentBorrowDetailsSingle.getammount().toString(), ", ", lentBorrowDetailsSingle.getdate(), ", ", lentBorrowDetailsSingle.getdetails()]
            // console.log(newRow)
            await this.fileSystemService.appendLineToFile(fileName, filePath, newRow, fileTypes.csv);
        } else {
            let HeaderRow = [lentBorrowDetailsSingle];
            let response = await this.fileSystemService.saveCSVData(fileName, filePath, HeaderRow);
        }
    }

    // there should be methods that will add one transaction to csv and to add total conut object
    //update the transaction
    //show all transaction in the form of table
    // add progress --> task and moneyType --> for lent borrow constants
    public async addOrUpdateLentBorrowAccount(name: string, accountName: string, type: string, ammount: number, details: string) {
        // console.log('this method is called');
        let lentBorrowDetailsSingle = new LentBorrowTransaction(accountName, type, ammount);
        let lentBorrowDetailsSingleCSVRow = new LentBorrowTransactionCsvRow(accountName, type, ammount, await this.utility.convertTimeStamp(Date.now()), details);
        this.updateOrCreateLetBorrowAccountDetils(name, lentBorrowDetailsSingle, type);
        this.addTransactionToLentBorrowCsv(name, lentBorrowDetailsSingleCSVRow);
    }

}