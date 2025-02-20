"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.LoggerFactory = void 0;
const Logger = __importStar(require("bunyan"));
const BunyanLoggly = require("bunyan-loggly");
const stream_correlation_id_decorator_1 = require("../middleware/stream-correlation-id-decorator");
//import { StreamCorrelationIdDecorator } from '..//middleware/stream-correlation-id-decorator'
const HTTPContext = __importStar(require("express-http-context"));
/**
 * Logger factory produces named logger instance based of an initial application level logger
 */
class LoggerFactory {
    /**
     * @constructor
     */
    constructor(configuration) {
        const options = {
            level: configuration.level,
            name: configuration.service,
            streams: [
                {
                    type: 'raw',
                    stream: this.getRawStream(configuration)
                }
            ]
        };
        this.logger = Logger.createLogger(options);
    }
    /**
     * Get a new named logger based off of the application level logger
     */
    getNamedLogger(loggerName) {
        return this.logger.child({ loggerName });
    }
    /**
     * Get a configured raw stream for bunyan to use
     */
    getRawStream(configuration) {
        const loggly = new BunyanLoggly({
            token: configuration.logglyToken,
            subdomain: configuration.logglySubdomain
        });
        return new stream_correlation_id_decorator_1.StreamCorrelationIdDecorator(loggly, HTTPContext.get);
    }
}
exports.LoggerFactory = LoggerFactory;
//# sourceMappingURL=logger-factory.js.map