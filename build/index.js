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
const configuration_1 = require("./configuration");
const app_factory_1 = require("./factories/app-factory");
const logger_factory_1 = require("./factories/logger-factory");
const app_1 = require("firebase-admin/app");
const firestore_1 = require("firebase-admin/firestore");
const admin = __importStar(require("firebase-admin"));
const emergency_service_1 = require("./services/core/emergency-service");
const emergency_assist_controller_1 = require("./controllers/emergency-assist-controller");
const express_server_1 = require("./services/express-server");
const serviceAccount = require(`./${process.env.ENV}.json`);
/**
 * Start the HTTP service
 */
const startService = async () => {
    var _a;
    // Logging
    const env = (_a = process.env.ENV) !== null && _a !== void 0 ? _a : 'dev';
    let environment = 'sandbox';
    if (env === 'prod') {
        environment = 'production';
    }
    const loggerFactory = new logger_factory_1.LoggerFactory(configuration_1.configuration.logger);
    const processLogger = loggerFactory.getNamedLogger('gecko-api');
    // Firebase
    const firebase = (0, app_1.initializeApp)({
        credential: admin.credential.cert(serviceAccount),
        storageBucket: process.env.STORAGE_BUCKET,
    });
    const db = (0, firestore_1.getFirestore)(firebase);
    const assistService = new emergency_service_1.EmergencyService(db);
    // Controllers
    const assistController = new emergency_assist_controller_1.EmergencyAssistController(assistService, loggerFactory);
    // Application
    const app = app_factory_1.AppFactory.getInstance(assistController);
    console.log('Starting emergency assist server', firebase.name);
    const expressServer = new express_server_1.ExpressServer(app, loggerFactory, configuration_1.configuration.server);
    expressServer
        .run()
        .catch((error) => processLogger.error('Process error', { message: error.message }));
};
Promise.resolve()
    .then(startService)
    .catch(console.error);
//# sourceMappingURL=index.js.map