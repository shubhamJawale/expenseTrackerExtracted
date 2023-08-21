import { inject } from "inversify";
import { FileSystemService } from "../services/file-system-service";
import TYPES from "../types";
import { fileTypes } from "../constants/constants";

export class FileUtility {
    private readonly fileSystemService: FileSystemService;
    constructor(@inject(TYPES.FileSystemService) _fileSystemService: FileSystemService) {
        this.fileSystemService = _fileSystemService;
    }

    public async fetchJSONOrCSVFile(fileName: string, filePath: string, fileType: string) {
        let fileData: any;
        if (fileType === fileTypes.csv) {
            fileData = await this.fileSystemService.getCSVDataFromFile(filePath, fileName)
        }
        else {
            fileData = await this.fileSystemService.getJsonFromFile(fileName, filePath);
        }
        return fileData;
    }
}