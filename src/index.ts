import { configuration } from './configuration';
import { AppFactory } from './factories/app-factory'; 
import { LoggerFactory } from './factories/logger-factory';
import { SecurityMiddleware } from './middleware/security-middleware';
import { initializeApp } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import * as admin from 'firebase-admin';  
import { EmergencyService } from './services/core/emergency-service';
import { EmergencyAssistController } from './controllers/emergency-assist-controller'; 
import { ExpressServer } from './services/express-server';

const serviceAccount = require(`./${process.env.ENV}.json`);

/**
 * Start the HTTP service
 */
const startService = async () => {
  // Logging
  const env = process.env.ENV ?? 'dev'
  let environment = 'sandbox';
  if (env === 'prod') {
    environment = 'production';
  }

  const loggerFactory = new LoggerFactory(configuration.logger);
  const processLogger = loggerFactory.getNamedLogger('gecko-api');

  // Firebase
  const firebase = initializeApp({
    credential: admin.credential.cert(serviceAccount),
    storageBucket: process.env.STORAGE_BUCKET,
  });
 
  const db = getFirestore(firebase); 
  const assistService = new EmergencyService(db);

   
  // Controllers
  const assistController = new EmergencyAssistController(assistService, loggerFactory)
  

  // Application
  const app = AppFactory.getInstance(
    assistController, 
  );

  console.log('Starting emergency assist server', firebase.name);
  const expressServer = new ExpressServer(app, loggerFactory, configuration.server);

  expressServer
    .run()
    .catch((error: Error) => processLogger.error('Process error', { message: error.message }));
};

Promise.resolve()
  .then(startService)
  .catch(console.error);
