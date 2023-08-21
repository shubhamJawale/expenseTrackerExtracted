import { injectable } from "inversify";
import { CONSTANTS, months } from "../constants/constants";

@injectable()
export class Utility {
    constructor(message: string) {
        console.log('app Started')
    }
    public async convertTimeStamp(timeStamp: number) {
        let date = new Date(timeStamp);
        let timeString = `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()} : ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`;
        return timeString;
    }

    public async writeNotesOnScreen(message: string) {
        console.log(`[${message.toLocaleUpperCase()}]`)
    }

    public async checkIsCurrentMonth(timeStamp: number, day: number = CONSTANTS.dayOfSalary) {
        let oldDate = new Date(timeStamp);
        let oldMonth = oldDate.getMonth();
        let oldYear = oldDate.getFullYear();
        let oldDay = oldDate.getDate();
        let currentDate = new Date(Date.now());
        let currentMonth = currentDate.getMonth();
        let currentYear = currentDate.getFullYear();
        let currentDay = currentDate.getDate();
        let flag = false;
        // console.log('cy : ' + currentYear + " cM : " + currentMonth + " oldyear : " + oldYear + "oldmonth : " + oldMonth)
        if (currentYear == oldYear && currentMonth == oldMonth && currentDay <= day) {
            flag = true;
        }
        return flag;
    }

    public static getMonthAndYearFromStringWithDash(periodString: string) {
        // this method can be only used for the "month-year" pattern
        let indexOfDash = periodString.indexOf('-');
        let month = periodString.substring(0, indexOfDash);
        let year = periodString.substring(indexOfDash + 1);
        return {
            month: month,
            year: year
        }
    }

    public convertTheMonthFromNumberToSting(monthInNumber: number) {
        return months[monthInNumber];
    }

}