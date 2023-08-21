import { inject, injectable } from "inversify";
import { FileSystemService } from "./file-system-service";
import { LogWritter } from "../utility/logWritter";
import { Utility } from "../utility/utility";
import { FileUtility } from "../utility/fileUtility";
import TYPES from "../types";
import { Loan } from "../models/loan";
import { CONSTANTS, filePrefix, fileTypes } from "../constants/constants";
import { Tenure } from "../models/tenure";

@injectable()
export class CreditCardLoanManagementService {
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

    // loanId: string, loanName: string, loanSource: string, loanBearer: string, loanAmmount: number, interestOnLoan: number, remainingAmmount: number, paidAmmount: number, noOfTenures: number, lastTenureDetails: string, tenures: Tenure[], loanStatus: string
    public async addLoanToTheFile(accountName: string, loan: Loan) {
        let fileName = `${accountName}_${CONSTANTS.loanFileName}`;
        let filePath = `${CONSTANTS.filePath}`
        if (await this.fileSystemService.checkFileExists(fileName, filePath, fileTypes.json)) {
            let loanArray = await this.getLoanFileFromTheSytem(accountName);
            loanArray.push(loan);
            await this.fileSystemService.saveJsonData(fileName, filePath, loanArray);
            this.logWritter.writeLogs(`loan has been added to the file ${loan.getLoanId()}`, filePrefix.transction);
        } else {
            await this.fileSystemService.saveJsonData(fileName, filePath, [loan]);
            this.logWritter.writeLogs(`loan has been added to the file ${loan.getLoanId()}`, filePrefix.transction);
        }
    }

    public async updateLoan(accountName: string, loan: Loan) {
        let fileName = `${accountName}_${CONSTANTS.loanFileName}`;
        let filePath = `${CONSTANTS.filePath}`
        let loanArray = await this.getLoanFileFromTheSytem(accountName);
        let indexOfLoan = loanArray.findIndex((loanElement: Loan) => loanElement.getLoanId() === loan.getLoanId());
        if (indexOfLoan === undefined || indexOfLoan === -1) {
            indexOfLoan = loanArray.findIndex((loanElement: Loan) => loanElement.getLoanName() === loan.getLoanName())
        }
        loanArray[indexOfLoan] = loan;
        await this.fileSystemService.saveJsonData(fileName, filePath, loanArray);
        this.logWritter.writeLogs(`loan has been updated to the file ${loan.getLoanId()}`, filePrefix.transction);
    }

    public async updateLoanTenure(accountName: string, loan: Loan, tenureMonthAndYear: string, tenure: Tenure) {
        let fileName = `${accountName}_${CONSTANTS.loanFileName}`;
        let filePath = `${CONSTANTS.filePath}`;
        let loanArray = await this.getLoanFileFromTheSytem(accountName);
        // let monthAndYearObjectFromString = Utility.getMonthAndYearFromStringWithDash(tenureMonthAndYear);
        let oldTenureIndex = loan.getTenures().findIndex((tenureElement: Tenure) => tenureElement.getPeriodOfTenure() == tenureMonthAndYear);
        let oldTenures = loan.getTenures();
        oldTenures[oldTenureIndex] = tenure;
        let loanIndex = loanArray.findIndex((loanElement: Loan) => loanElement.getLoanId() === loan.getLoanId());
        loanArray[loanIndex].setTenures(oldTenures);
        await this.fileSystemService.saveJsonData(fileName, filePath, loanArray);
        this.logWritter.writeLogs(`tenure has been updated to the file ${loan.getLoanId()} and tenure index ${tenure.getIndexOfTenure()}`, filePrefix.transction);
    }
    public async updateCurrentMonthLoanTenure(accountName: string, loanId: string, tenureStatus: string) {

    }
    public async getLoanFileFromTheSytem(accountName: string) {
        let fileName = `${accountName}_${CONSTANTS.loanFileName}`;
        let filePath = `${CONSTANTS.filePath}`
        let jsonLoanFile = await this.fileSystemService.getJsonFromFile(fileName, filePath);
        let loanArray = Loan.getLoanObjectFromJSON(jsonLoanFile);
        return loanArray;
    }

    public async getTenurePeriodDetailsFromConsole(rl: any) {
        let lastTenureDetailsMonthAndYear = await rl.question('enter the month and year of the tenure in the following format mm-yyyy ')
        let monthAndYearObjectOfLastTenure = Utility.getMonthAndYearFromStringWithDash(lastTenureDetailsMonthAndYear);
        let monthOfLastTenure = this.utility.convertTheMonthFromNumberToSting(parseInt(monthAndYearObjectOfLastTenure.month) - 1);
        let lastTenureDetails = monthOfLastTenure + '-' + monthAndYearObjectOfLastTenure.year;
        return lastTenureDetails;
    }
}