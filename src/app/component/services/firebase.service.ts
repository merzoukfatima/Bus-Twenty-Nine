import * as firebase from "nativescript-plugin-firebase";
import {Injectable, NgZone} from "@angular/core";
import {User} from '../models/user.model';
import { BackendService } from "./backend.service";
import { firestore, sendEmailVerification } from "nativescript-plugin-firebase";
const firebase1 = require("nativescript-plugin-firebase/app");


@Injectable()
export class FirebaseService {
  userCollection = firebase1.firestore().collection("user");
  busstopCollection = firebase1.firestore().collection("busstops");

  
  constructor(
    private ngZone: NgZone,
  ){
firebase1.initializeApp({
  persist: false
});

  }



  register(user: User) {let i=0
    return new Promise<Object>((resolve, reject) => {
   let A= firebase1.firestore().collection("user")
      .Where("email","==",user.email)
      .Where("name","==",user.name)
      .get()
.then((querySnapshot: firestore.QuerySnapshot) => {
  i++
  console.log("i",i)

})
 if(i!=0){ 
      firebase.createUser({
        email: user.email,
        password: user.password
      }).then(
            function (result:any) {            
               resolve({status: true });
       this.userCollection.add({
         name:user.name,
          email:user.email,
          })
          this.EmailVerification()
            },
            function (errorMessage:any) {
             // alert(errorMessage);
              reject({ status: false });
            }
        )
      }
      else{
        reject({ status: false })
      }
    }) 
  } 
  
  login(user: User) {
    return new Promise<Object>((resolve, reject) => {
    firebase.login({
      type: firebase.LoginType.PASSWORD,
      passwordOptions: {
        email: user.email,
        password: user.password
      }
    }).then((result: any) => {
      resolve({ status: true });
          return JSON.stringify(result);
      }, (errorMessage: any) => {
        /*alert(errorMessage);*/
        reject({ status: false });
      });
  });
} 


EmailVerification(){
firebase.sendEmailVerification({url: "https://www.google.com",
handleCodeInApp: true}).then(
  function () {
    console.log("Email verification sent");
  },
  function (error) {
    console.log("Error sending email verification: " + error);
  }
);}
passwordResetEmail(email:string){
firebase.sendPasswordResetEmail(email)
      .then(() => console.log("Password reset email sent"))
      .catch(error => console.log("Error sending password reset email: " + error));
}
}
