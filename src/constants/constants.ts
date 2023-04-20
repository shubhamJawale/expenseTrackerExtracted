
export let CONSTANTS = {

    loggerFilePath: "./resources/log/",
    loggerFileName: "logger",
    loggerFileExtension: "txt",
    filePath: "./resources/files/",
    csvFileName: "transactionDetails",
    transctionObjectFileName: "expenseDetailsOverview",
    accountPath: "Account/",
    accountFileName: 'accountList',
    lentBorrowJsonFileName: 'LentBorrowDetails',
    // lentBorrowJsonFilePath: './resources/files'

}
export let accountOperations = {
    create: "create",
    update: "update",
    delete: "delete"
}
export let fileTypes = {
    json: 'json',
    csv: 'csv'
}

export let transactionCategory = {
    food: "Food",
    fuel: "Fuel",
    rent: "Rent",
    bills: "Bills",
    exported: "Exported",
    salary: 'Salary',
    imported: 'Imported',
    helthCare: 'HealthCare',
    otherHealthCare: "OtherHealthCare",
    carOrBike: "CarOrBike",
    other: "Other"
}

export const typeOfTransaction = {
    income: "Income",
    expenditure: "Expenditure"
}

export const filePrefix = {
    dev: "dev",
    transction: "transaction"
}

export const appStatusCodes = {
    'success': 200,
    'error': 500,
    'fileNotFound': 400,
    'fileAlreadyExsits': 424
}
export const LentBorrowTransactionType = {
    lent: "Lent",
    borrow: 'Borrow'
}

export const ColourForTransactionRow = {

    red: 'red',
    green: 'green',
    yellow: 'yellow'
}


