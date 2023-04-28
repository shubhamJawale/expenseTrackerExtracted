import { IFsClient } from "../interfaces/i-fs-client";
import * as csv from "csvtojson";
import * as fs from "fs/promises";
const objectToCsv = require('objects-to-csv');
import { StringDecoder } from "string_decoder";
import { injectable } from "inversify/lib/annotation/injectable";
import * as normalFs from "fs";
// low level fs bounding
@injectable()
export class FSClient implements IFsClient {
    constructor() { }
    async createFolder(folderName: string, filePath: string): Promise<any> {
        try {
            if (! await this.checkFileExistsOrNot(folderName, filePath)) {
                await fs.mkdir(`${filePath}/${folderName}`);
            } else {
                console.log('folder already exsisted')
            }
        } catch (e) {
            console.log(e);
            throw new Error("Method not implemented.");
        }
    }
    async saveCSV(jsonData: any, fileName: string, filePath: string): Promise<any> {
        let filePathUrl = `${filePath}${fileName}.csv`;
        try {
            let csv = new objectToCsv(jsonData);
            await csv.toDisk(`${filePathUrl}`);
            return "File Saved Successfully";
        } catch (e) {
            console.log(e);
            throw new Error('Error Occoured while writing csv file')
        }
    }
    async getAllRecordsFromCSV(fileName: string, filePath: string): Promise<any> {
        let filePathUrl = `${filePath}${fileName}.csv`;
        let jsonData: any[] = [];
        try {
            jsonData = await csv({ noheader: false, output: "csv" }).fromFile(filePathUrl);
            return jsonData;
        } catch (e) {
            console.log(e);
            throw new Error("Error while getting a file");
        }
    }
    async saveJson(jsonData: any, fileName: any, filePath: any): Promise<any> {
        let filePathUrl = `${filePath}${fileName}.json`;
        try {
            await fs.writeFile(filePathUrl, JSON.stringify(jsonData));
            return "file has been Saved Succefully";
        } catch (e) {
            console.log(e);
            throw new Error("Error while saving a file");
        }
    }
    async getDataFromJson(fileName: any, filePath: any): Promise<any> {
        let filePathUrl = `${filePath}${fileName}.json`;
        console.log(filePathUrl);
        const decoder = new StringDecoder('utf-8');
        try {
            let data = await fs.readFile(filePathUrl)
            let jsonData = decoder.write(data);
            return JSON.parse(jsonData);
        } catch (e) {
            console.log(e);
            throw new Error("error while getting data from file");
        }
    }
    async appendLineToFile(fileName: any, filePath: any, lineData: any, fileFormat: string): Promise<any> {
        let filePathUrl = `${filePath}${fileName}.${fileFormat}`;
        try {
            await fs.appendFile(filePathUrl, lineData);
            // console.log('line appended successfully')
        } catch (e) {
            console.log(e);
            throw new Error("Error occured during appending line");
        }
    }

    async checkFileExistsOrNot(fileName: string, filePath: string, fileFormat?: string): Promise<boolean> {
        let filePathUrl: string = "";
        if (fileFormat) {
            filePathUrl = `${filePath}${fileName}.${fileFormat}`;
        }
        else {
            filePathUrl = `${filePath}${fileName}`;
        }

        try {
            let fileFlag = await normalFs.existsSync(filePathUrl);
            return fileFlag;
        } catch (e) {
            console.log(e);
            throw new Error('error occured')
        }
    }


}