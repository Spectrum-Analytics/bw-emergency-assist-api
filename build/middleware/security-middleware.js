"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SecurityMiddleware = void 0;
/**
 * Security Middleware is responsible for authenticating all requests
 */
class SecurityMiddleware {
    /**
     * Get the middleware component
     */
    constructor(db) {
        this.db = db;
    }
    getMiddleware() {
        return async (req, res, next) => {
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
        };
    }
}
exports.SecurityMiddleware = SecurityMiddleware;
//# sourceMappingURL=security-middleware.js.map