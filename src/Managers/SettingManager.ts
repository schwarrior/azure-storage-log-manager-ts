require("dotenv").config()

export class SettingManager {

    static getSetting = (name : string) : string => {
        //settings are read from the .env file at the root of application
        return process.env[name];
    }
}

