export interface IFsClient {

    saveCSV(jsonData: any, fileName: string, filePath: string): Promise<any>;
    getAllRecordsFromCSV(fileName: string, filePath: string): Promise<any>;
    saveJson(jsonData: any, fileName: any, filePath: any): Promise<any>;
    getDataFromJson(fileName: any, filePath: any): Promise<any>;
    appendLineToFile(fileName: any, filePath: any, lineData: any, fileFormat: string): Promise<any>;
    checkFileExistsOrNot(fileName: string, filePath: string, fileFormat: string): Promise<any>;
    createFolder(folderName: string, filePath: string): Promise<any>;
}