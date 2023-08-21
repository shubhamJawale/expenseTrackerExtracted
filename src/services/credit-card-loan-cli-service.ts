import { inject, injectable } from "inversify";
import { Utility } from "../utility/utility";
import { CreditCardModuleService } from "./credit-card-module-service";
import { CreditCardLoanManagementService } from "./credit-card-loan-management-service";
import { FileUtility } from "../utility/fileUtility";
import TYPES from "../types";
import { Loan } from "../models/loan";
import { CONSTANTS, loanStatus, months, tenureStatus } from "../constants/constants";
import { Tenure } from "../models/tenure";
import { CreditCardCLIService } from "./credit-card-modul-cli-service";

@injectable()
export class CreditCardLoanCli {
    private readonly utility: Utility;
    private readonly creditCardModuleService: CreditCardModuleService;
    private readonly creditCardLoanService: CreditCardLoanManagementService;
    private readonly fileUtility: FileUtility;


    constructor(@inject(TYPES.Utility) _utility: Utility, @inject(TYPES.CreditCardModuleService) _creditCardModuleService: CreditCardModuleService, @inject(TYPES.CreditCardLoanManagementService) _creditCardLoanService: CreditCardLoanManagementService, @inject(TYPES.FileUtility) _fileUtility: FileUtility) {

        this.creditCardLoanService = _creditCardLoanService;
        this.creditCardModuleService = _creditCardModuleService;
        this.fileUtility = _fileUtility;
        this.utility = _utility;
    }

    //  const { Table } = require('console-table-printer');
    // const { printTable } = require('console-table-printer');
    // let table = new Table();

    //architecture :- wiil show loan table 
    /**
     * 1. select loan
     * 2. after that update loan => only details and but not calculatory ammounts only static details
     * 3. update tenure  for current month only available for 1 to 10 of the month // include only status change
     * this will also affect the remaining ammount and paid ammount on the loan  also remaining tenures
     * 4. show tenures :-
     * 4.1 update tenure static info 
     * 4.2 
     */
    public async loanMenu(rl: any, accountName: string) {
        // show table
        let loanArray = await this.showLoanTableForStatus(accountName);
        let indexOfLoan = await rl.question('enter the index no of the loan to proceed with the other options : ')
        // select index 
        let loan = loanArray[parseInt(indexOfLoan)];
        // show loan details
        let tempLoan = Loan.singleLoanObjectFromJSON(JSON.parse(JSON.stringify(loan)));
        tempLoan.setTenures([]);
        console.log(tempLoan);
        // show loan sub menu
        await this.showLoanSubMenu(rl, accountName, loan);
    }

    public async showLoanTableForStatus(accountName: string, loanStatusInput?: string) {
        let loanArray = await this.creditCardLoanService.getLoanFileFromTheSytem(accountName);
        const { Table } = require('console-table-printer');
        const { printTable } = require('console-table-printer');
        let table = new Table();
        let index = 0;
        loanArray.forEach((loan: Loan) => {
            if (loanStatusInput) {
                if (loan.getLoanStatus() === loanStatusInput) {
                    table.addRow({ index: index, laonId: loan.getLoanId(), name: loan.getLoanName(), ammount: loan.getLoanAmmount(), bearer: loan.getLoanBearer(), loanSource: loan.getLoanSource(), Tenures: loan.getNoOfTenures(), remaining_Ammount: loan.getRemainingAmmount(), Interest: loan.getInterestOnLoan() });
                    index++;
                }
            } else {
                table.addRow({ index: index, laonId: loan.getLoanId(), name: loan.getLoanName(), ammount: loan.getLoanAmmount(), bearer: loan.getLoanBearer(), loanSource: loan.getLoanSource(), Tenures: loan.getNoOfTenures(), remaining_Ammount: loan.getRemainingAmmount(), Interest: loan.getInterestOnLoan() });
                index++;
            }
        })
        table.printTable();
        return loanArray;
    }

    private async showLoanSubMenu(rl: any, accountHolderName: string, loan: Loan) {
        // 1. update loan
        // 2. update current month tenure availble only for 1 to 10 of months
        // 3. show tenures
        // 4.update tenure

        console.log("\n \n LOAN SUB MENU \n 1. update laon \n 2. update current month tenure \n 3. show tenures \n 4. update tenure details");
        let option = await rl.question('\n select the option from the above to proceed : ');
        switch (parseInt(option)) {
            case 1:
                await this.updateLaon(rl, accountHolderName, loan);
                break;
            case 2:
                if (this.toShowMenuFlag()) {
                    this.updateTheCurrentMonthTenure(rl, accountHolderName, loan)
                }
                else {
                    console.log('this option will available only between 1th and 10th of the month')
                }
                break;
            case 3:
                await this.showTenureTable(loan);
                break;
            case 4:
                await this.showTenureTable(loan);
                let tenureIndex = await rl.question('enter the tenure index which you want to update : ');
                let tenureToEdit: Tenure = loan.getTenures()[parseInt(tenureIndex) - 1];
                let tenureEdited: Tenure = await this.updateTenure(rl, tenureToEdit);
                await this.creditCardLoanService.updateLoanTenure(accountHolderName, loan, tenureEdited.getPeriodOfTenure(), tenureEdited);
                break;
        }
    }

    // update loan
    //(loanId: string, loanName: string, loanSource: string, loanBearer: string, loanAmmount: number, interestOnLoan: number, remainingAmmount: number, paidAmmount: number, noOfTenures: number, lastTenureDetails: string, tenures: Tenure[], loanStatus: string, loanDetails: string, loanProcessingFee: number)
    private async updateLaon(rl: any, accountName: string, loan: Loan) {
        console.log('you can update the multiple fields from the loan only static updating few information will affect the calculation so be cautios while updating some fields');
        //\n 5. change loan ammount
        // 7. change loan tenure numbers (you can change the tenure details from the tenure menu warning do not change the tenure no directly delete loan from file and add again)
        let option = await rl.question('choose the option below to update \n 1. change the loan id \n 2. change the laon name \n 3. change loan source \n 4. change loan bearer  \n 5. change interest on laon \n 6. change the loan details \n 7. change the loan processing fee \n enter the option => ');
        switch (parseInt(option)) {
            case 1:
                let id = await rl.question('enter the loan id : ');
                loan.setLoanId(id);
                break;
            case 2:
                let name = await rl.question('enter the loan name : ');
                loan.setLoanName(name);
                break;
            case 3:
                let loanSource = await rl.question('enter the loan source : ');
                loan.setLoanSource(loanSource);
                break;
            case 4:
                let loanBearer = await rl.question('enter the loan bearer : ');
                loan.setLoanBearer(loanBearer);
                break;
            // case 5:
            //     let loanAmmount = await rl.question('enter the loan ammount : ');
            //     loan.setLoanAmmount(parseInt(loanAmmount));
            //     break;
            case 5:
                let loanInterest = await rl.question('enter the loan Interest : ');
                loan.setInterestOnLoan(parseInt(loanInterest));
                break;
            // case 7:
            //     let loanTenures = await rl.question('enter the loan tenure no : ');
            //     loan.setNoOfTenures(parseInt(loanTenures));
            //     break;
            case 6:
                let loanDetails = await rl.question('enter the loan details : ');
                loan.setLoanDetails(loanDetails);
                break;
            case 7:
                let loanProcessingFee = await rl.question('enter the loan processing fee : ');
                loan.setLoanProcessingFee(parseInt(loanProcessingFee));
                break;
        }

        let confirmation = await rl.question('do you really want to change the above information ? \n y/n : ');
        if (confirmation === 'y') {
            await this.creditCardLoanService.updateLoan(accountName, loan);
            console.log('loan details has been updated')
        }
    }

    // update currunt month tenure 
    private async updateTheCurrentMonthTenure(rl: any, accountHolderName: string, loan: Loan) {
        let getCurrentMonthTenureStringDetails = this.getCurrentMonthTenure();
        let currentTenure = loan.getSpacificTenure(getCurrentMonthTenureStringDetails.month, getCurrentMonthTenureStringDetails.year.toString());
        if (typeof (currentTenure) != "string") {
            let tenureStatusString = await rl.question('enter the status \n 1. paid \n 2. paid by me but borrower pending \n :=> ');
            let status = tenureStatus.pending;
            parseInt(tenureStatusString) === 1 ? tenureStatus.paid : tenureStatus.pendingFromBorrower;
            currentTenure.setStatusOfTheTenure(status);
            loan.setPaidAmmount(loan.getPaidAmmount() + currentTenure.getAmmountOfTenure());
            loan.setRemainingAmmount(loan.getRemainingAmmount() - currentTenure.getAmmountOfTenure())
            await this.creditCardLoanService.updateLoan(accountHolderName, loan);
            console.log(`current month tenure is updated`)
        }
        else {
            console.log('there is no current month tenure due')
        }
    }

    // get currnet month in string
    private getCurrentMonthTenure() {
        let currentTimeStamp = Date.now();
        let date = new Date(currentTimeStamp);

        let monthOfTenure = this.utility.convertTheMonthFromNumberToSting(date.getMonth());
        let currentTenureDetails = monthOfTenure + '-' + date.getFullYear();
        return {
            month: monthOfTenure,
            year: date.getFullYear(),
            monthAndYearString: currentTenureDetails
        };
    }
    // (indexOfTenure: number, periodOfTenure: string, ammountOfTenure: number, interestAmmount: number, statusOfTheTenure: string, AdditionalRemarks: string, details: string)
    private showTenureTable(loan: Loan) {
        const { Table } = require('console-table-printer');
        const { printTable } = require('console-table-printer');
        let table = new Table();
        loan.getTenures().forEach((tenure: Tenure) => {

            let colour = 'green';
            if (tenure.getStatusOfTheTenure() === tenureStatus.paid)
                colour = 'green';
            else if (tenure.getStatusOfTheTenure() === tenureStatus.pendingFromBorrower)
                colour = 'yellow';
            else
                colour = 'red';
            table.addRow({ indexOfTenure: tenure.getIndexOfTenure(), dueDate: tenure.getPeriodOfTenure(), ammount: tenure.getAmmountOfTenure(), interestAmmount: tenure.getInterestAmmount(), status: tenure.getStatusOfTheTenure(), remarks: tenure.getAdditionalRemarks(), details: tenure.getDetails() }, { color: colour });
        })

        table.printTable();
    }
    private async updateTenure(rl: any, tenure: Tenure) {
        console.log('===============tenure update menu===============');
        console.log('choose the option from below to update: \n 1. change period Of Tenure \n 2. ammount \n 3. interest Ammount \n 4. status Of Tenure \n 5. additional remarks \n 6. details');
        let option = await rl.question('\n choose the option from the above to modify :  ');
        switch (parseInt(option)) {
            case 1:
                let periodOfTenure = await this.creditCardLoanService.getTenurePeriodDetailsFromConsole(rl);
                tenure.setPeriodOfTenure(periodOfTenure);
                break;
            case 2:
                let ammountString = await rl.question('enter the ammount : ');
                let ammount = parseInt(ammountString);
                tenure.setAmmountOfTenure(ammount);
                break;
            case 3:
                let interstAmmountString = await rl.question('enter the interst ammount : ');
                let interestAmmount = parseInt(interstAmmountString);
                tenure.setInterestAmmount(interestAmmount);
                break;
            case 4:
                let statusString = await rl.question('choose the status for the tenure expect pending \n 1. paid \n 2. paid but painding from borrower \n 3. pending\n => ');
                let statusOfTheTenure = tenureStatus.pending;
                parseInt(statusString) === 1 ? statusOfTheTenure = tenureStatus.paid : statusOfTheTenure = tenureStatus.pendingFromBorrower;
                if (parseInt(statusString) === 3)
                    statusOfTheTenure = tenureStatus.pending;
                tenure.setStatusOfTheTenure(statusOfTheTenure);
                break;
            case 5:
                let AdditionalRemarks = await rl.question("enter the additional remarks : ");
                tenure.setAdditionalRemarks(AdditionalRemarks);
                break;
            case 6:
                let details = await rl.question('enter the details of the tenure : ');
                tenure.setDetails(details);
                break;
        }
        return tenure;
    }

    public toShowMenuFlag() {
        let currentDateTimeStamp = Date.now();
        let currentDate = new Date(currentDateTimeStamp);
        let currentDay = currentDate.getDate();
        if (currentDay < CONSTANTS.lastDayToPayBill && currentDay >= CONSTANTS.firstDayOfMonth) {
            return true;
        } else {
            return false;
        }
    }
}