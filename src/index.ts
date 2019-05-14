
import * as express  from 'express';
import axios from 'axios';




function hasAccess(user : any , config : any) {
    if(user.principal && user.principal.roles && user.principal.roles.bluesense) {
        if(user.principal.roles.bluesense.permission >= config.role) {
            return true;
        }
    }
    if(config.scope) {
        if(user.details.clientDetails.scope) {
            for(var i = 0; i < user.details.clientDetails.scope.length; i++) {
                if(config.scope === user.details.clientDetails.scope[i]) {
                    return true;
                }
            }
        }
    }
    return false;
}

function AuthMiddleware() {
    return (config: { scope? : string, role? : number }) => {
        return (req: express.Request, res: express.Response, next: express.NextFunction) => {
            if(!req.headers.authorization) {
                res.sendStatus(401);
            }
            (async () => {
                axios.get("http://auth-server:8765/uaa/users/current",{
                    headers : {
                        authorization : req.headers.authorization
                    }
                }).then(data => {
                    if(hasAccess(data.data,config)) {
                        next();
                    } else {
                        res.sendStatus(401);
                    }
                }).catch(err=> {
                    res.sendStatus(401);
                })
            })();
        };
    };
}

export const Auth = AuthMiddleware();

