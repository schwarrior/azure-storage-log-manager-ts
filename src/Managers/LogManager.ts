import { SharedKeyCredential, StorageURL, Models } from "@azure/storage-blob"
import { Aborter, AppendBlobURL, ContainerURL, ServiceURL} from "@azure/storage-blob"

import { SettingManager } from "./SettingManager";
import { DateManager } from "./DateManager";

export class LogManager {
    
    getLogLines = async (fileName: string) : Promise<Array<string>> => {
        const appendBlobUrl : AppendBlobURL = AppendBlobURL.fromContainerURL(this.containerUrl, fileName)
        const downloadResponse = await appendBlobUrl.download(this.azureStorageOpAborter, 0)
        const rawRead = await this.streamToString(downloadResponse.readableStreamBody)
        if (!rawRead) {
            console.log(`Read of ${fileName} resulted in null`)
            return new Array<string>()
        }
        let fullLog = rawRead.toString();
        if ( !fullLog ) { 
            console.log(`Read of ${fileName} resulted in empty string`)
            return new Array<string>() 
        }
        fullLog = fullLog.trim()
        if (fullLog.length === 0 ) { return new Array<string>() }
        const lines = fullLog.split("\r\n") 
        return lines
    }

    private readonly containerUrl : ContainerURL
    private readonly azureStorageOpAborter : Aborter

    private  _containerFiles : Array<string> = null;
    get containerFiles() : Promise<Array<string>> {
        return (async () => {
            if (this._containerFiles) {return this._containerFiles}
            this._containerFiles = new Array<string>()
            let azResponse : Models.ContainerListBlobFlatSegmentResponse
            let azMarker : string
            do {
                azResponse = await this.containerUrl.listBlobFlatSegment(this.azureStorageOpAborter);
                azMarker = azResponse.marker;
                for (const blob of azResponse.segment.blobItems) {
                    //omit files in subdirectories
                    if (blob.name.indexOf("/") > -1) {continue}
                    this._containerFiles.push(blob.name)
                }
            } while (azMarker);
            return this._containerFiles
        })();
    }

    constructor(private devMode? : boolean) {
        const storageaccount = SettingManager.getSetting("storageaccount")
        const storageaccesskey = SettingManager.getSetting("storageaccesskey")
        const storagecontainername = SettingManager.getSetting("storagecontainername")
        const credentials = new SharedKeyCredential(storageaccount, storageaccesskey);
        const pipeline = StorageURL.newPipeline(credentials);
        const serviceUrl = new ServiceURL(`https://${storageaccount}.blob.core.windows.net`, pipeline);
        this.containerUrl = ContainerURL.fromServiceURL(serviceUrl, storagecontainername);
        this.azureStorageOpAborter = Aborter.timeout(20 * 60 * 1000) // twenty mins
    }

    writeToLog = async (logFileName : string, message : string) => {
        try {
            const timeStampFormatted = DateManager.getUtcDateString()
            let logThis = `${timeStampFormatted}\t${message}`
            logThis += "\r\n"
    
            if (this.devMode) {
                console.log("DevMode is on. The following would written to log file if DevMode was off:")
            } else {
                const appendBlobUrl = await this.getFileRefAndCreateIfNotExists(logFileName)
                await appendBlobUrl.appendBlock(this.azureStorageOpAborter, logThis, logThis.length)
            }
            console.log(`${logFileName}: ${logThis.trim()}`)
        } catch (err) {
            console.error(err)
        }
        
    }

    private getFileRefAndCreateIfNotExists = async (fileName : string) : Promise<AppendBlobURL> => {
        const existingFiles = await this.containerFiles
        const appendBlobUrl : AppendBlobURL = AppendBlobURL.fromContainerURL(this.containerUrl, fileName)
        if (!existingFiles.includes(fileName)) {
            await appendBlobUrl.create(this.azureStorageOpAborter)
            //force refresh of container files array
            this._containerFiles = null;
        }
        return appendBlobUrl;
    }

    // A helper method used to read a Node.js readable stream into string
    // adapted from https://github.com/Azure/azure-storage-js
    private streamToString = async (readableStream : NodeJS.ReadableStream) : Promise<string> => {
        return new Promise((resolve, reject) => {
        const chunks = [];
        readableStream.on("data", data => {
            chunks.push(data.toString());
        });
        readableStream.on("end", () => {
            resolve(chunks.join(""));
        });
        readableStream.on("error", reject);
        });
    }


}