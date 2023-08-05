
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
    taskFilePath: './resources/files/tasks/',
    taskFileName: 'taskFile',

    // day of the month to expect to change the month according to salary day
    dayOfSalary: 24
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
    transction: "transaction",
    task: 'task'
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
export const TaskProgresses = {
    new: 'new',
    ready: 'Ready',
    inProgress: 'InProgress',
    extended: 'Extended',
    terminated: 'Terminated',
    completed: 'Completed'
}
export const subtasksProgresses = {
    new: 'new',
    done: 'done',
    inProgress: 'inprogress',
    ready: 'ready'
}
export const subTaskPriority = {
    low: "low",
    mid: "mid",
    high: "high"
}


