 
import { NextFunction, Request, Response } from 'express'
import { APIKey } from '../models/security/api-key'; 
import * as admin from 'firebase-admin'
/**
 * Security Middleware is responsible for authenticating all requests
 */
class SecurityMiddleware {
 
  /**
   * Get the middleware component
   */
 
  constructor(protected db: admin.firestore.Firestore){
  }

  public  getMiddleware() {
    return async(req: Request, res: Response, next: NextFunction) => {
      // if(req.path.includes('/link/')){
      //   next()
      // }else{
      // const apiKey = req.header("x-api-key");
      // if (!apiKey) {
      //   return res.status(401).send("Unauthorized");
      // }
  
      // const key = await this.apiRepo.findOne({ where:{
      //   apiKey:apiKey
      // } });

      // if (!key || !key.active) {
      //   return res.status(401).send("Unauthorized");
      // }

       
      
      

      next();
    }
  }
  
}

export { SecurityMiddleware }
