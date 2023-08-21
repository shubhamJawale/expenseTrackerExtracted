import { inject, injectable } from "inversify";
import TYPES from "../types";
import { Utility } from "../utility/utility";

@injectable()
export class DriverService {
    private readonly utility: Utility;
    constructor(@inject(TYPES.Utility) _utility: Utility) {
        this.utility = _utility;
    }
    public takeInput(readline: any) {
        let rl = readline.createInterface({
            input: process.stdin,
            output: process.stdout
        });

        return rl;

    }
    public createPrompt(readline: any) {
        const prompt = (query: any) => new Promise((resolve) => readline.question(query, resolve));
        return prompt;
    }



};