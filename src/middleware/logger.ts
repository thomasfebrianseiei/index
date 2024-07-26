import { ConsoleLogger, Injectable } from '@nestjs/common';
import { PRODUCTION } from 'src/core/constants';

@Injectable()
export class Logger {

    private logger = new ConsoleLogger(Logger.name)

    constructor() {
        this.logger.warn(process.env.NODE_ENV === PRODUCTION ? 'Production mode' : 'Development mode')
        this.logger.warn(`Running at port ${process.env.PORT}`)
    }

    static create(name: string): LoggerTypes {
        const util = require('util')
        const newLogger = new ConsoleLogger(name)
        const functions = {
            print: (...payload: any): any => {
                if (process.env.NODE_ENV !== PRODUCTION) {
                    newLogger.log(util.inspect(payload, { showHidden: false, depth: null, colors: true }))
                }
            },
            errPrint: (...payload: any): any => {
                newLogger.error(util.inspect(payload, { showHidden: false, depth: null, colors: true }))
            },
            log(...payload: any): any {
                newLogger.log(util.inspect(payload, { showHidden: false, depth: null, colors: true }))
            }
        }
        return functions
    }

}

export type LoggerTypes = {
    /** Will not appear on production, use log if needed on production instead */
    print(...toPrint: any): Function;
    errPrint(...toPrint: any): Function;
    log(...toPrint: any): Function;
}
