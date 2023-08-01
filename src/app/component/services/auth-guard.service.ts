import { CanActivate, Router } from "@angular/router";
import { BackendService } from "./backend.service";

export class AuthGuard implements CanActivate {
    constructor(private router: Router) { }
  
    canActivate() {
      if (BackendService.isLoggedIn()) {
        return true;
      }
      else {
        this.router.navigate(["/login"]);
        return false;
      }
    }
}