import { NgModule } from "@angular/core";
import { NativeScriptRouterModule } from "nativescript-angular/router";
import { Routes } from "@angular/router";
import { LoginComponent } from "./component/login/login.component";
import { HomeComponent } from "./component/home/home.component";
import { SearchComponent } from "./component/search/search.component";
import { AuthGuard } from "./component/services/auth-guard.service";


const routes: Routes = [
    { path: "", redirectTo: "/search", pathMatch: "full" },
    { path: "login", component: LoginComponent },
    { path: "home", component:HomeComponent , canActivate: [AuthGuard] },
    { path: "search", component:SearchComponent}
];

@NgModule({
    imports: [NativeScriptRouterModule.forRoot(routes)],
    exports: [NativeScriptRouterModule]
})
export class AppRoutingModule { }
