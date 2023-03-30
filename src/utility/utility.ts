import { injectable } from "inversify";

@injectable()
export class Utility {
    constructor() { }
    public async convertTimeStamp(timeStamp: number) {
        let date = new Date(timeStamp);
        let timeString = `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()} : ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`;
        return timeString;
    }
}