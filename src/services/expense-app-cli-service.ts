import { inject, injectable } from "inversify";
import TYPES from "../types";
import { AccountService } from "./account-service";
import { DriverService } from "./driver-service";
import { ExpenseTrackerService } from "./expense-tracker-service";
import * as readline from 'node:readline/promises';
import { Account } from "../models/account";
import { transactionCategory, typeOfTransaction } from "../constants/constants";
import { Utility } from "../utility/utility";
@injectable()
export class ExpenseAppCLIService {
    private readonly utility: Utility;
    private readonly accountService: AccountService;
    private readonly driverService: DriverService;
    private readonly expenseTrackerService: ExpenseTrackerService;
    constructor(@inject(TYPES.AccountService) _accountService: AccountService, @inject(TYPES.DriverService) _driverService: DriverService, @inject(TYPES.ExpenseTrackerService) _expenseTrackerService: ExpenseTrackerService, @inject(TYPES.Utility) _utility: Utility) {
        this.accountService = _accountService;
        this.driverService = _driverService;
        this.expenseTrackerService = _expenseTrackerService;
        this.utility = _utility;
    }
    public async mainApplicationMethod(rl: any) {
        this.appTitle();
        await this.appChooseMenu(rl)
    }

    public appTitle() {
        console.log('++++++++++++++++++++++++++++++++++++++++++++++++++');
        console.log('++++++++++++++++++++++++++++++++++++++++++++++++++');
        console.log("+++++++++++++++++Expenditure Manager++++++++++++++");
        console.log('++++++++++++++++++++++++++++++++++++++++++++++++++');
        console.log('++++++++++++++++++++++++++++++++++++++++++++++++++');
    }

    public async appChooseMenu(rl: any) {

        console.log('++++++++++++++++++++++++++++++++++++++++++++++++++');

        let appChoose: string = "";
        appChoose = await rl.question('Choose The Service \n 1. Log In \n 2. Sign Up \n[dont get alerted if console takes double digits of choosen option] \n[Enter the option number of your prefernce] : => ');
        this.utility.writeNotesOnScreen('After Entering option or answer please press space and then backspace')
        // rl.close();
        switch (parseInt(appChoose)) {
            case 1:
                this.logIn(rl);
                break;
            case 2:
                this.signUp(rl)
                break;
        }
        // rl.close();
    }

    public async logIn(rl: any) {
        console.log('++++++++++++++++++++++++++++++++++++++++++++++++++');
        console.log('+++++++++++++++++++++Log In+++++++++++++++++++++++');
        console.log('++++++++++++++++++++++++++++++++++++++++++++++++++');
        this.utility.writeNotesOnScreen('After Entering option or answer please press space and then backspace')
        let accountName = await rl.question('Enter the Name ');
        let account: Account | any;
        try {
            account = await this.accountService.fetchSpacificAccount(accountName);
            // console.log(account);
            if (account) {
                console.log('hello ' + account.getname())

                this.AfterLogInMenu(account.getname(), rl, account)
            }
        } catch (e: any) {
            console.log("Error Occured")
        }
    }
    public async signUp(rl: any) {
        console.log('++++++++++++++++++++++++++++++++++++++++++++++++++');
        console.log('+++++++++++++++++++++sign up+++++++++++++++++++++++');
        console.log('++++++++++++++++++++++++++++++++++++++++++++++++++');
        this.utility.writeNotesOnScreen('After Entering option or answer please press space and then backspace')
        let accountName = await rl.question('Enter the Name ');
        let details = await rl.question('Enter the Details');
        let account: Account | any;
        try {
            account = await this.accountService.createOrUpdateAccount(accountName, details);
            this.logIn(rl)
        } catch (e) {
            console.log("Error Occured");
        }
    }
    public async AfterLogInMenu(accountName: any, rl: any, account: any) {
        let choiseToQuite = "n"
        do {
            console.log('++++++++++++++++++++++++++++++++++++++++++++++++++');
            console.log('1. Add Transaction : ');
            console.log('2. see profile Data : ');
            console.log('3. update profile data : ');
            console.log('4. show Account Balance : ');
            console.log('++++++++++++++++++++++++++++++++++++++++++++++++++');
            this.utility.writeNotesOnScreen('After Entering option or answer please press space and then backspace')
            let theOption = await rl.question('Choose The Option above  ');
            switch (parseInt(theOption)) {
                case 1:
                    let ammount = await rl.question('Enter the Amount : ');
                    let details = await rl.question('Enter the Details : ');
                    let transactionName = await rl.question('Enter the Transaction Name : ');
                    let transactionType = await this.getTransactionType(rl);
                    let category = await this.getTransactioncategory(rl)
                    await this.expenseTrackerService.AddTransactionToAnOldAccount(parseInt(ammount), transactionType, category, details, transactionName, accountName);
                    break;
                case 2:
                    await this.fetchAccountDetails(account);
                    break;
                case 3:
                    await this.signUp(rl);
                    break;
                case 4:
                    let accountJsonDetails = await this.accountService.fetchSapcificAccountDetails(accountName);
                    console.log(accountJsonDetails);
                    break;
            }
            choiseToQuite = await rl.question("DO YOU WANT TO QUITE (y/n) ?  : ")
        } while (choiseToQuite != "y")
    }

    private async getTransactionType(rl: any) {
        console.log('\n choose the transaction type : \n 1. Expenditure \n 2. Income ');
        let transactionTypeNo = await rl.question('Enter Transaction Type No : ');
        let type = "";
        switch (parseInt(transactionTypeNo)) {
            case 1:
                type = typeOfTransaction.expenditure;
                break;
            case 2:
                type = typeOfTransaction.income;
                break;

        }
        return type;
    }
    private async fetchAccountDetails(account: any) {
        //let account = await this.accountService.fetchSpacificAccount(name);
        console.log(account);
    }
    private async getTransactioncategory(rl: any) {
        let category = "";
        let categoryNo = await rl.question('Choose Category From List \n a. bills \n b. carOrBike \n c. exported \n d. food \n e. fuel \n f. healthCare \n g. imported \n  h. other \n i. otherHealthCare \n j. rent \n k. salary  Enter Transaction Category charecter : ')
        switch (categoryNo) {
            case 'a':
                category = transactionCategory.bills
                break;
            case 'b':
                category = transactionCategory.carOrBike
                break;
            case 'c':
                category = transactionCategory.exported
                break;
            case 'd':
                category = transactionCategory.food
                break;
            case 'e':
                category = transactionCategory.fuel
                break;
            case 'f':
                category = transactionCategory.helthCare
                break;
            case 'g':
                category = transactionCategory.imported
                break;
            case 'h':
                category = transactionCategory.other
                break;
            case 'i':
                category = transactionCategory.otherHealthCare
                break;
            case 'j':
                category = transactionCategory.rent
                break;
            case 'k':
                category = transactionCategory.salary
                break;

        }
        return category;
    }
}