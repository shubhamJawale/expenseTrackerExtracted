import { inject, injectable } from "inversify";
import { FSClient } from "../clients/fs-client";
import { CONSTANTS } from "../constants/constants";
import { FileSystemService } from "../services/file-system-service";
import TYPES from "../types";
import { Utility } from "./utility";

@injectable()
export class LogWritter {
    private readonly fsClient: FSClient;
    private readonly utility: Utility;
    constructor(@inject(TYPES.FSClient) _fsClient: FSClient, @inject(TYPES.Utility) _utility: Utility) {
        this.fsClient = _fsClient;
        this.utility = _utility;
    }

    public async writeLogs(data: string, filePrefix: string) {
        try {
            let timeStamp = Date.now();
            let convertedTimeStamp = await this.utility.convertTimeStamp(timeStamp);
            await this.fsClient.appendLineToFile(filePrefix + CONSTANTS.loggerFileName, CONSTANTS.loggerFilePath, `\n ${convertedTimeStamp}  : ${data}`, CONSTANTS.loggerFileExtension);
            // console.log("logs written successfully");
        } catch (e) {
            console.log("error while writting a log", e);
        }
    }

}