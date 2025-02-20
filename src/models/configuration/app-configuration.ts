import { ServerConfiguration } from './server-configuration'
import { LoggerConfiguration } from './logger-configuration' 

/**
 * Representation of the application level configuration object
 */
interface AppConfiguration { 
  logger: LoggerConfiguration
  server: ServerConfiguration 
}

export { AppConfiguration }
