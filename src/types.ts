const TYPES = {
    dummyService: Symbol.for('dummyService'),
    FSClient: Symbol.for('FSClient'),
    FileSystemService: Symbol.for('FileSystemService'),
    LogWritter: Symbol.for('LogWritter'),
    ExpenseTrackerService: Symbol.for('ExpenseTrackerService'),
    Utility: Symbol.for('Utility'),
    AccountService: Symbol.for('AccountService'),
    ExpeneseAppCliService: Symbol.for('ExpenseAppCLIService'),
    CommonService: Symbol.for('CommonService'),
    DriverService: Symbol.for('DriverService'),
    LentBorrowTrackingService: Symbol.for('LentBorrowTrackingService'),
    LentBorrowTrackingCLIService: Symbol.for('LentBorrowTrackingCLIService'),
    TaskService: Symbol.for('TaskService'),
    TaskServiceClient : Symbol.for('TaskServiceClient'),
}

export default TYPES;