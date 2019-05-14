"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const axios_1 = require("axios");
function hasAccess(user, config) {
    if (user.principal && user.principal.roles && user.principal.roles.bluesense) {
        if (user.principal.roles.bluesense.permission >= config.role) {
            return true;
        }
    }
    if (config.scope) {
        if (user.details.clientDetails.scope) {
            for (var i = 0; i < user.details.clientDetails.scope.length; i++) {
                if (config.scope === user.details.clientDetails.scope[i]) {
                    return true;
                }
            }
        }
    }
    return false;
}
function AuthMiddleware() {
    return (config) => {
        return (req, res, next) => {
            if (!req.headers.authorization) {
                res.sendStatus(401);
            }
            (() => __awaiter(this, void 0, void 0, function* () {
                axios_1.default.get("http://auth-server:8765/uaa/users/current", {
                    headers: {
                        authorization: req.headers.authorization
                    }
                }).then(data => {
                    if (hasAccess(data.data, config)) {
                        next();
                    }
                    else {
                        res.sendStatus(401);
                    }
                }).catch(err => {
                    res.sendStatus(401);
                });
            }))();
        };
    };
}
const Auth = AuthMiddleware();
exports.Auth = Auth;
