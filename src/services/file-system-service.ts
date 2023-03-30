import { injectable } from "inversify";
import { inject } from "inversify/lib/annotation/inject";
import { FSClient } from "../clients/fs-client";
import { filePrefix, fileTypes } from "../constants/constants";
import TYPES from "../types";
import { LogWritter } from "../utility/logWritter";
@injectable()
export class FileSystemService {
    private fsClient: FSClient;
    private logWritter: LogWritter;
    constructor(@inject(TYPES.FSClient) _fsClient: FSClient, @inject(TYPES.LogWritter) _logWritter: LogWritter) {
        this.logWritter = _logWritter;
        this.fsClient = _fsClient;
    }
    public async getCSVDataFromFile(filePath: any, fileName: any) {
        let CSVData: any;
        if (await this.checkFileExists(fileName, filePath, fileTypes.csv)) {
            CSVData = await this.fsClient.getAllRecordsFromCSV(fileName, filePath);
            this.logWritter.writeLogs('csv is FETCHED', filePrefix.dev);
        } else {

            CSVData = "File Does Not Exists";
        }
        return CSVData;

    }
    public async saveCSVData(fileName: any, filePath: any, jsonData: any) {
        let response = await this.fsClient.saveCSV(jsonData, fileName, filePath);
        this.logWritter.writeLogs('csv is SAVED', filePrefix.dev);
        return response;
    }
    public async getJsonFromFile(fileName: any, filePath: any) {
        let response: any;
        if (await this.checkFileExists(fileName, filePath, fileTypes.json)) {
            response = await this.fsClient.getDataFromJson(fileName, filePath);
            this.logWritter.writeLogs('json is FETCHED', filePrefix.dev);
        }
        else {
            response = "File Does Not Exists";
        }
        return response;
    }
    public async saveJsonData(fileName: any, filePath: any, jsonData: any) {
        let jsonDataFromFile = await this.fsClient.saveJson(jsonData, fileName, filePath);
        this.logWritter.writeLogs('json is SAVED', filePrefix.dev);
        return jsonDataFromFile;
    }
    public async appendLineToFile(fileName: any, filePath: any, lineData: any, extentsion: string) {
        let response = await this.fsClient.appendLineToFile(fileName, filePath, lineData, extentsion);
        this.logWritter.writeLogs('appending file row', filePrefix.dev);
        return response;
    }
    public async checkFileExists(fileName: any, filePath: any, fileFormat?: any) {
        let fileCheckFlag: any;
        if (fileFormat) {
            fileCheckFlag = await this.fsClient.checkFileExistsOrNot(fileName, filePath, fileFormat);
        } else {
            fileCheckFlag = await this.fsClient.checkFileExistsOrNot(fileName, filePath);
        }
        this.logWritter.writeLogs('checking for file', filePrefix.dev);
        return fileCheckFlag;
    }
}