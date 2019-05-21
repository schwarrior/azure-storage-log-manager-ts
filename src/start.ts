import { LogManager } from "./Managers/LogManager";

const logMgr = new LogManager()

//write to log file
logMgr.writeToLog("test.log", "Hello World")