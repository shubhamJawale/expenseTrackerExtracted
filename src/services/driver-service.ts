
export class DriverService {
    constructor() { }
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