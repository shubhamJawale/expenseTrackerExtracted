import { inject, injectable } from "inversify";
import { LentBorrowTrackingService } from "./lentBorrow-tracking-service";
import TYPES from "../types";
import { LentBorrowTransaction } from "../models/lentBorrowTransaction";
import { ColourForTransactionRow, LentBorrowTransactionType } from "../constants/constants";

@injectable()
export class LentBorrowTrackingCLIService {
    private readonly lentBorrowTrackingService: LentBorrowTrackingService;
    constructor(@inject(TYPES.LentBorrowTrackingService) _lentBorrowTrackingService: LentBorrowTrackingService) {
        this.lentBorrowTrackingService = _lentBorrowTrackingService;
    }


    public async showTable(rl: any, name: string) {
        const { Table } = require('console-table-printer');
        const { printTable } = require('console-table-printer');
        let table = new Table();
        let index = 0;
        let allTransactions = await this.lentBorrowTrackingService.getLentBorrowAccountDetailsAll(name);
        let newMapAccordingTheColour = allTransactions.map((lentBorrowTransaction: LentBorrowTransaction) => {
            let colour = (lentBorrowTransaction.gettype() === LentBorrowTransactionType.borrow) ? ColourForTransactionRow.red : ColourForTransactionRow.green;
            table.addRow({ index: index, name: lentBorrowTransaction.getname(), type: lentBorrowTransaction.gettype(), ammount: lentBorrowTransaction.getammount() }, { color: colour });
            index++;
        });
        table.printTable();
        let selectedIndex = await rl.question('Enter The Index Of Transaction To Update : ');

        let transaction = allTransactions[selectedIndex];

        let ammount = await rl.question('Enter The Ammount of Transaction : ');
        let type = await rl.question('Select The Type : \n 1. lent \n 2. borrow \n \t Enter the Option : ');
        let selectedType = "";
        if (parseInt(type) == 1) {
            selectedType = LentBorrowTransactionType.lent;
        } else {
            // this is loop hole 
            selectedType = LentBorrowTransactionType.borrow;
        }
        // console.log(ammount);
        let details = await rl.question('Enter the Transaction Details : ');
        let response = await this.lentBorrowTrackingService.addOrUpdateLentBorrowAccount(name, transaction.getname(), selectedType, parseInt(ammount), details);
    }

    public async showLentBorrowMenu(rl: any, name: string) {
        console.log('++++++++++++Lent Borrow Transactions+++++++++++++')
        let option = await rl.question('Choose The Operation from Below : \n 1. Show Table And Update Indexed Transaction \n 2. add new Transaction \n 3. Show All Transaction with Summery \n CHOOSE THE OPTION ==> ');

        switch (parseInt(option)) {
            case 1:
                await this.showTable(rl, name);
                break;
            case 2:
                await this.addNewLentBorrowTransaction(rl, name);
                break;
            case 3:
                await this.showAllDetailsSummary(name);
                break;
        }
    }

    public async addNewLentBorrowTransaction(rl: any, name: string) {
        console.log("ADD NEW TRANSACTION [please Enter Below Information]");
        let accountName = await rl.question('Enter the Name of person On which you have to add transaction : ');
        let type = await rl.question('Select The Type : \n 1. lent \n 2. borrow \n \t Enter the Option : ');
        let selectedType = "";
        if (parseInt(type) == 1) {
            selectedType = LentBorrowTransactionType.lent;
        } else {
            // this is loop hole 
            selectedType = LentBorrowTransactionType.borrow;
        }
        let ammount = await rl.question('Enter the Ammount : ');
        let details = await rl.question('Enter the Transaction Details');
        let response = await this.lentBorrowTrackingService.addOrUpdateLentBorrowAccount(name, accountName, selectedType, parseInt(ammount), details)
    }

    public async showAllDetailsSummary(name: string) {
        const { Table } = require('console-table-printer');
        const { printTable } = require('console-table-printer');
        let fullData = await this.lentBorrowTrackingService.getLentBorrowAccountDetailsAll(name);
        let table = new Table();
        let index = 0;
        let totalLent = 0;
        let totalBorrow = 0;
        fullData.map((lentBorrowTransaction: LentBorrowTransaction) => {
            let colour = "";
            // (lentBorrowTransaction.gettype() === LentBorrowTransactionType.borrow) ? ColourForTransactionRow.red : ColourForTransactionRow.green;

            if (lentBorrowTransaction.gettype() === LentBorrowTransactionType.borrow) {
                colour = ColourForTransactionRow.red;
                totalBorrow = totalBorrow + lentBorrowTransaction.getammount();
            } else {
                colour = ColourForTransactionRow.green;
                totalLent = totalLent + (lentBorrowTransaction.getammount());
            }
            table.addRow({ index: index, name: lentBorrowTransaction.getname(), type: lentBorrowTransaction.gettype(), ammount: lentBorrowTransaction.getammount() }, { color: colour });
            index++;
        });
        table.printTable();
        let summaryTable = new Table({
            columns: [
                { name: 'transaction', title: 'Transaction Type', alignment: 'left' },
                { name: 'Ammount', alignment: 'left' }, // with Title as separate Text
            ],
        })

        summaryTable.addRow({ transaction: 'LENT', Ammount: totalLent }, { color: ColourForTransactionRow.green });
        summaryTable.addRow({ transaction: 'BORROW', Ammount: totalBorrow }, { color: ColourForTransactionRow.red });

        console.log('\n\n SUMMARY : \n\n');
        summaryTable.printTable();
    }
}
