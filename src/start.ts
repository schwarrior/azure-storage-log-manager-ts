import { LogManager } from "./Managers/LogManager"

class TestLogManager {
    test = async () => {
        const logMgr = new LogManager()
        //azure storage account and container determined by settings in .env file
        const logFileName = "test.log"
        console.log(`${logFileName} test writes:`)
        //write to (a new) log file
        await logMgr.writeToLog(logFileName, "Hello World")
        //write again
        await logMgr.writeToLog(logFileName, "Hello World Again")
        //read it back
        const logLines = await logMgr.getLogLines("test.log")
        console.log(`${logFileName} contents:`)
        logLines.forEach(logLine => {
            console.log(logLine)
        });
    }
}

new TestLogManager().test()