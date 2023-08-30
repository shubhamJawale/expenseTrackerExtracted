import { inject, injectable } from "inversify";
import { Utility } from "../utility/utility";
import { CreditCardModuleService } from "./credit-card-module-service";
import { CreditCardLoanManagementService } from "./credit-card-loan-management-service";
import { FileUtility } from "../utility/fileUtility";
import TYPES from "../types";
import { CONSTANTS, fileTypes, loanStatus, tenureStatus, transactionCategory, typeOfCreditCardTransaction } from "../constants/constants";
import { CreditCardOverviewObject } from "../models/credit-card-overview-object";
import { Tenure } from "../models/tenure";
import { Loan } from "../models/loan";
import { CreditCardLoanCli } from "./credit-card-loan-cli-service";

@injectable()
export class CreditCardCLIService {
    private readonly utility: Utility;
    private readonly creditCardModuleService: CreditCardModuleService;
    private readonly creditCardLoanService: CreditCardLoanManagementService;
    private readonly fileUtility: FileUtility;
    private readonly creditCardLaonCLI: CreditCardLoanCli;
    constructor(@inject(TYPES.Utility) _utility: Utility, @inject(TYPES.CreditCardModuleService) _creditCardModuleService: CreditCardModuleService, @inject(TYPES.CreditCardLoanManagementService) _creditCardLoanService: CreditCardLoanManagementService, @inject(TYPES.FileUtility) _fileUtility: FileUtility, @inject(TYPES.CreditCardLoanCli) _creditCardLoanCli: CreditCardLoanCli) {
        this.creditCardLaonCLI = _creditCardLoanCli;
        this.creditCardLoanService = _creditCardLoanService;
        this.creditCardModuleService = _creditCardModuleService;
        this.fileUtility = _fileUtility;
        this.utility = _utility;
    }

    // methods 
    // 1. show menu
    // 2. add transaction
    // 3. add loan
    // 4. show overall details
    // 5. update loan tenures 
    // 6. update loan status
    // 7. update loan 
    // 8. show loan details menu ==> details menu will show following 
    //     1. show all loans ==> 1. select loan to show details ==> 1. update loan ==> will show menu to update property expect status,
    //                                                              2. update loan status,
    //                                                              3. update loan tenures => show tenures list =>
    //                                                                                                          1. update selected tenure => will show menu to update property, 
    //                                                                                                          2. update status of the tenure
    //                                                              4. update current month tenure status 
    //    2. show active loans

    // MAIN MENU
    public async showMenuCreditCardModuleMenu(accountName: string, rl: any) {

        let goMainMenuOption = 'n';
        do {
            console.log('===============Credit Card Menu===============')
            let choice = await rl.question(`1. add transaction on credit card \n2. show credit card overview \n3. add Loan to credit card \n4. Loan Menu \n5. show active Loans \n Select the Options from above : `);
            let intChoice = parseInt(choice);
            switch (intChoice) {
                case 1:
                    await this.addTransactionToCreditCard(rl, accountName);
                    break;
                case 2:
                    await this.showCreditCardOverview(accountName);
                    break;
                case 3:
                    await this.addLoanToCreditCard(rl, accountName);
                    break
                case 4:
                    await this.creditCardLaonCLI.loanMenu(rl, accountName)
                    break;
                case 5:
                    await this.creditCardLaonCLI.showLoanTableForStatus(accountName, loanStatus.active);
                    break;
            }
            console.log('==============================================')
            goMainMenuOption = await rl.question('do you want to go to the main menu ? "y/n" : ')
        } while (goMainMenuOption === 'n')
    }
    // FIRST OPTION
    private async addTransactionToCreditCard(rl: any, accountName: string) {
        //(accountName, new CreditCardCsvRow(uuid(), transactionName, amount, oldTotalExpnediture, details, transactionDate, transactionType, actualAmmountOfTransaction, Date.now(), needFlag))
        let transactionName = await rl.question('enter the transaction name : ');
        let transactionAmmount = await rl.question('enter transaction Ammount : ');
        let details = await rl.question('enter the details of the transaction : ');
        let transactionTypeNo = await rl.question('choose the transaction type : \n1. income \n2. expenditure : \n Enter the transaction type option no : ');
        let typeOfTransaction = ""
        if (parseInt(transactionTypeNo) === 1) {
            typeOfTransaction = typeOfCreditCardTransaction.billPayed;
        } else {
            typeOfTransaction = typeOfCreditCardTransaction.expenditure;
        }
        let actualAmmountOfTransaction = await rl.question('Enter the Actual ammount of the transaction : ');
        let needFlag = await rl.question('Is it really needed ? y/n : enter the charrecter :  ');
        needFlag = needFlag === 'y' ? true : false;
        await this.creditCardModuleService.addOrUpdateTheCardAccount(transactionName, parseInt(transactionAmmount), details, accountName, typeOfTransaction, parseInt(actualAmmountOfTransaction), needFlag);
    }

    // SECOND OPTION 
    private async showCreditCardOverview(accountName: string) {
        let filename = `${accountName}_${CONSTANTS.creditCardOverviewFile}`;
        let filePath = CONSTANTS.filePath;
        // fetching old credit card review file
        let oldJsonFile = await this.fileUtility.fetchJSONOrCSVFile(filename, filePath, fileTypes.json);
        let oldCreditCardOverviewObject: CreditCardOverviewObject = CreditCardOverviewObject.fromJson(oldJsonFile);
        console.log(oldCreditCardOverviewObject);
        // following code is temporary
        let creditLoanfilename = `${accountName}_${CONSTANTS.loanFileName}`;
        let creditLoanfilapath = CONSTANTS.filePath;
        let oldCreditLoanJsonFile = await this.fileUtility.fetchJSONOrCSVFile(creditLoanfilename, creditLoanfilapath, fileTypes.json);
        let loanArray = Loan.getLoanObjectFromJSON(oldCreditLoanJsonFile);
        let totalTenureBill = 0;
        let timpeStamp = Date.now();
        let date = new Date(timpeStamp);
        let month = date.getMonth();
        let monthString = this.utility.convertTheMonthFromNumberToSting(month);
        loanArray.forEach((loan: Loan) => {
            if (loan.getLoanStatus() === loanStatus.active) {
                let tennure = loan.getSpacificTenure(monthString, date.getFullYear().toString());
                if (typeof (tennure) === "object" && tennure.getPeriodOfTenure() != "" && tennure.getStatusOfTheTenure() === tenureStatus.pending) {
                    totalTenureBill = totalTenureBill + tennure.getAmmountOfTenure();
                }
            }
        })
        console.log('\n TOTAL CREDIT CARD MINIMUM TENURE DUE : ', totalTenureBill)
        console.log('\n TOTAL CREDIT CARD PAY DUE FOR MONTH : ', totalTenureBill + oldCreditCardOverviewObject.getBalanceBill());
    }

    //THIRD OPTION
    private async addLoanToCreditCard(rl: any, accountName: string) {
        // (loanId: string, loanName: string, loanSource: string, loanBearer: string, loanAmmount: number, interestOnLoan: number, remainingAmmount: number, paidAmmount: number, noOfTenures: number, lastTenureDetails: string, tenures: Tenure[], loanStatus: string, loanDetails: string, loanProcessingFee: number)
        let loanId = await rl.question('enter the loan id : ');
        let loanName = await rl.question('enter the loan name : ');
        let loanSource = await rl.question('enter the loan source on which the loan has been taken : ');
        let loanBearer = await rl.question('enter the loan bearer name : ');
        let loanAmmountInString = await rl.question('enter the loan total ammount : ');
        let loanAmmount = parseInt(loanAmmountInString);
        let interestOnLoanString = await rl.question('enter the loan total interest : ');
        let interestOnLoan = parseFloat(interestOnLoanString);
        let addPaidAmmountOrRemainingAmmount = await rl.question("do you want to enter the remaining and paid ammount \n y/n")
        let remainingAmmount = 0;
        let paidAmmount = 0;
        if (addPaidAmmountOrRemainingAmmount === 'y') {
            let remainingAmmountString = await rl.question('Enter the remaining loan ammount : ');
            let paidAmmountString = await rl.question('Enter the Paid ammount : ');
            remainingAmmount = parseInt(remainingAmmountString);
            paidAmmount = parseInt(paidAmmountString)
        }
        remainingAmmount = parseInt(loanAmmountInString)// need to check
        console.log("Enter the last tenure details : ")
        let lastTenureDetails = await this.creditCardLoanService.getTenurePeriodDetailsFromConsole(rl);
        let statusEditFlag = await rl.question('Do you want to add the status \n y/n : ');
        let loanStatuss = loanStatus.active;
        if (statusEditFlag === 'y') {
            let loanStatusString = await rl.question("enter the loan status from following list : \n 1. Active \n 2. Closed \n enter the option from above : ");
            parseInt(loanStatusString) === 1 ? loanStatuss === loanStatus.active : loanStatuss = loanStatus.cloased;
        }

        let loanDetails = await rl.question('enter the loan details : ');
        let loanProcessingFeeString = await rl.question('enter the loan processing fee : ');
        let loanProcessingFee = parseInt(loanProcessingFeeString);

        let noOfTenuresString = await rl.question("Enter the no of Tenures : ");
        let tenures: Tenure[] = [];
        let noOfTenures = parseInt(noOfTenuresString);
        for (let i = 0; i < noOfTenures; i++) {
            let index = i + 1;
            let tenure: Tenure = await this.getTenureWritten(rl, index);
            tenures.push(tenure);
        }

        let loan = new Loan(loanId, loanName, loanSource, loanBearer, loanAmmount, interestOnLoan, remainingAmmount, paidAmmount, noOfTenures, lastTenureDetails, tenures, loanStatuss, loanDetails, loanProcessingFee);

        await this.creditCardLoanService.addLoanToTheFile(accountName, loan);
        console.log('loan added succefully');

    }

    private async getTenureWritten(rl: any, indexOfTenure: number) {
        //indexOfTenure: number, periodOfTenure: string, ammountOfTenure: number, interestAmmount: number, statusOfTheTenure: string, AdditionalRemarks: string, details: string)
        let periodOfTenureInString = await this.creditCardLoanService.getTenurePeriodDetailsFromConsole(rl);
        let ammountOfTenureString = await rl.question('enter the ammount of the tenure : ');
        let interestAmmount = await rl.question('enter the ammount of the interest : ');
        let statusOfTheTenure = tenureStatus.pending;
        let statusFlag = await rl.question('Do you want to enter the status y/n : ');
        if (statusFlag === 'y') {
            let statusString = await rl.question('choose the status for the tenure expect pending \n 1. paid \n 2. paid but painding from borrower \n => ');
            parseInt(statusString) === 1 ? statusOfTheTenure = tenureStatus.paid : statusOfTheTenure = tenureStatus.pendingFromBorrower;
        }
        let AdditionalRemarks = await rl.question("enter the additional remarks : ");
        let details = await rl.question('enter the details of the tenure : ');
        return new Tenure(indexOfTenure, periodOfTenureInString, parseInt(ammountOfTenureString), parseInt(interestAmmount), statusOfTheTenure, AdditionalRemarks, details);
    }



}