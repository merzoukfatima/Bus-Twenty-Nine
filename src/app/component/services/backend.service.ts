import { Injectable } from "@angular/core";
import {point} from "../models/point.model";
import { getString, setString } from "tns-core-modules/application-settings";
export class BackendService {
point:point;
yes:boolean=false;
    static isLoggedIn(): boolean {
        return !!getString("token");
    }

    static get token(): string {
        return getString("token");
    }

    static set token(theToken: string) {
        setString("token", theToken);
    }
    getpoint(){
        this.isyes()
    return this.point;
    }
    setpoint(point:point){
    this.point=point;
    }
    isyes(){this.yes=true;
    return this.yes;
    }
}
