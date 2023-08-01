import { NgModule, NO_ERRORS_SCHEMA } from "@angular/core";
import { NativeScriptModule } from "nativescript-angular/nativescript.module";

import { AppRoutingModule } from "./app-routing.module";
import { AppComponent } from "./app.component";
import { LoginComponent } from "./component/login/login.component";
import { FirebaseService } from "./component/services/firebase.service";
import { BackendService } from "./component/services/backend.service";
import {NativeScriptCommonModule} from "nativescript-angular/common";
// Uncomment and add to NgModule imports if you need to use two-way binding
import { NativeScriptFormsModule } from "nativescript-angular/forms";
import { HomeComponent } from "./component/home/home.component";
import { SearchComponent } from "./component/search/search.component";
import { AuthGuard } from "./component/services/auth-guard.service";
//import { TryComponent } from "./component/try/try.component";

// Uncomment and add to NgModule imports if you need to use the HttpClient wrapper
// import { NativeScriptHttpClientModule } from "nativescript-angular/http-client";

@NgModule({
    bootstrap: [
        AppComponent
    ],
    imports: [
        NativeScriptCommonModule,
        NativeScriptModule,
        AppRoutingModule,
        NativeScriptFormsModule,
    ],
    declarations: [
        AppComponent,
        LoginComponent,
        HomeComponent,
        SearchComponent,
    ],
    providers: [
        FirebaseService,
        BackendService,
        AuthGuard
    ],
    schemas: [
        NO_ERRORS_SCHEMA
    ]
})
/*
Pass your application module to the bootstrapModule function located in main.ts to start your app
*/
export class AppModule { }
