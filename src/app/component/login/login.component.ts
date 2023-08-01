import { Component, OnInit, ViewChild, ElementRef } from "@angular/core";
import { alert, prompt} from "tns-core-modules/ui/dialogs";
import { Page } from "tns-core-modules/ui/page/page";
import { RouterExtensions } from "nativescript-angular/router";
import { Router } from "@angular/router";
import { User } from "../models/user.model";
import * as ApplicationSettings from "tns-core-modules/application-settings";
import { FirebaseService } from "../services/firebase.service";
import { Location } from "@angular/common";
import * as EmailValidator from 'email-validator';
import { BackendService } from "../services/backend.service";


@Component({
   selector:'ns-login',
   templateUrl:"./login.component.html",
   styleUrls:['./login.component.css'],
   moduleId: module.id

})
export class LoginComponent implements OnInit { 
	isAuthenticating = false;
	user;

	isLoggingIn = true;
 
	toggleDisplay() {
		this.isLoggingIn = !this.isLoggingIn;
	}

    public constructor(private location: Location,private router: RouterExtensions, private firebaseService: FirebaseService,private page: Page) {
		this.user = new User();
	}
	
    public ngOnInit() {
			this.page.actionBarHidden = true;
	}
	isValidEmail() {
		return EmailValidator.validate(this.user.email);
	  }
	  isPassword(){
		if(this.user.password.length>8 && this.user.password.length<16){
	   return true;
		}
	  }
	submit() {
		if (!this.isValidEmail()) {
			alert("Enter a valid email address.");
			return;
		}
		if(!this.isPassword()){
			alert("password should be between 8 and 16 length");
			return;
		}
		
		if (this.isLoggingIn) {
			this.login();
		} else {
			this.signUp();
		}
	}
    login() {
     this.firebaseService.login(this.user)
      .then((status) => {
		alert("Welcome");
        this.isAuthenticating = true;
		ApplicationSettings.setBoolean("authenticated", true);
        this.router.navigate(["/home"], { clearHistory: true } );
      })
      .catch((message:any) => {
		this.clearFields();
		alert("Please check you information.");
        this.isAuthenticating = false;
      });
  }

  public goBack() {
	this.location.back();
}
  signUp() {
this.firebaseService.register(this.user)
  .then(status => {
	this.isAuthenticating = false;
	this.location.back();
	alert("Your account was successfully created.");
	this.toggleDisplay();
	this.clearFields();
  })
  .catch((message:any) => {
	this.isAuthenticating = false;
	this.clearFields();
	alert("Unfortunately we were unable to create your account.")
  });
}
clearFields() {
	this.user.email = '';
	this.user.password = '';
	this.user.name='';
}


  forgotPassword() {
	  
  prompt({
    title: "Forgot Password",
    message: "Enter the email address you used to register for MyBusWay to reset your password.",
    defaultText: "",
    okButtonText: "Ok",
    cancelButtonText: "Cancel"
  }).then((data) => {
    if (data.result) {
	  // Call the backend to reset the password
	  this.firebaseService.passwordResetEmail(data.text.toString());
      alert({
        title: "BusWay",
        message: "Your password was successfully reset. Please check your email for instructions on choosing a new password.",
        okButtonText: "Ok"
      })
    }
  });
}


}