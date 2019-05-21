require("dotenv").config()

export class SettingManager {

    static getSetting = (name : string) : string => {
        //in production, settings are read from the function app's application settings
        //when debugging locally useing the azure fuction emulator, 
        //settings are read from local.settings.json (node.js with 'func: host start' prelaunch)
        //when debugging locally, running manualstart.js with node.js (no func emulation), settings are read from the .env file
        return process.env[name];
    }
}

