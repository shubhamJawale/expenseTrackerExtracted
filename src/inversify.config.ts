import "reflect-metadata";
import { Container } from "inversify";

import { FSClient } from "./clients/fs-client";
import { ExpenseTrackerService } from "./services/expense-tracker-service";
import { FileSystemService } from "./services/file-system-service";
import TYPES from "./types";
import { LogWritter } from "./utility/logWritter";
import { Utility } from "./utility/utility";
import { AccountService } from "./services/account-service";
import { ExpenseAppCLIService } from "./services/expense-app-cli-service";
import { CommonService } from "./services/common-service";
import { DriverService } from "./services/driver-service";
import { LentBorrowTrackingService } from "./services/lentBorrow-tracking-service";
import { LentBorrowTrackingCLIService } from "./services/lentBorrow-tracking-CLI-service";

const container = new Container();
//container.bind<SERVICE>(TYPES.service).to(SERVICE).inSinglotonScope();
container.bind<FSClient>(TYPES.FSClient).to(FSClient).inSingletonScope();
container.bind<FileSystemService>(TYPES.FileSystemService).to(FileSystemService).inSingletonScope();
container.bind<LogWritter>(TYPES.LogWritter).to(LogWritter).inSingletonScope();
container.bind<ExpenseTrackerService>(TYPES.ExpenseTrackerService).to(ExpenseTrackerService).inSingletonScope();
container.bind<Utility>(TYPES.Utility).to(Utility).inSingletonScope();
container.bind<AccountService>(TYPES.AccountService).to(AccountService).inSingletonScope();
container.bind<ExpenseAppCLIService>(TYPES.ExpeneseAppCliService).to(ExpenseAppCLIService).inSingletonScope();
container.bind<CommonService>(TYPES.CommonService).to(CommonService).inSingletonScope();
container.bind<DriverService>(TYPES.DriverService).to(DriverService).inSingletonScope();
container.bind<LentBorrowTrackingService>(TYPES.LentBorrowTrackingService).to(LentBorrowTrackingService).inSingletonScope();
container.bind<LentBorrowTrackingCLIService>(TYPES.LentBorrowTrackingCLIService).to(LentBorrowTrackingCLIService).inSingletonScope();