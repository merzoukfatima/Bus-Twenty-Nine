// this import should be first in order to load some required settings (like globals and reflect-metadata)
import { platformNativeScriptDynamic } from "nativescript-angular/platform";

import { AppModule } from "./app/app.module";

// A traditional NativeScript application starts by initializing global objects,
// setting up global CSS rules, creating, and navigating to the main page.
// Angular applications need to take care of their own initialization:
// modules, components, directives, routes, DI providers.
// A NativeScript Angular app needs to make both paradigms work together,
// so we provide a wrapper platform object, platformNativeScriptDynamic,
// that sets up a NativeScript application and can bootstrap the Angular framework.
import { enableProdMode } from '@angular/core';
import * as firebase from"nativescript-plugin-firebase";
import { BackendService } from "../src/app/component/services/backend.service";

enableProdMode(); 
  
firebase.init({
    storageBucket:'gs://fatima-87595.appspot.com/',
    onAuthStateChanged: (data: any) => {
      console.log(JSON.stringify(data))
      if (data.loggedIn) {
        console.log("data.user.uid",data.loggedIn);
        BackendService.token = data.user.uid;
      }
      else {
        BackendService.token = "";
      }
    }
            }).then(
              instance => {
                console.log("firebase.init done");
              },
              error => {
                console.log(`firebase.init error: ${error}`);
              }
            );
 
            

platformNativeScriptDynamic({createFrameOnBootstrap: false}).bootstrapModule(AppModule);

