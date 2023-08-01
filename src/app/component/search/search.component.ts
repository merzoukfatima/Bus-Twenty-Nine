import { Component, OnInit } from "@angular/core";
import { Page, EventData, Observable} from "tns-core-modules/ui/page/page";
import { point } from "../models/point.model";
import { RouterExtensions } from "nativescript-angular/router";
import { SearchBar } from "tns-core-modules/ui/search-bar/search-bar";
import { ListView } from "tns-core-modules/ui/list-view";
import { BackendService } from "../services/backend.service";
import { firestore } from "nativescript-plugin-firebase";
import { FirebaseService } from "../services/firebase.service";
const firebase1 = require("nativescript-plugin-firebase/app");


@Component({
    selector:'ns-search',
    templateUrl:"./search.component.html",
    styleUrls:['./search.component.css'],
    moduleId: module.id
 
 })
 export class SearchComponent{
    points:point[]; 
    point:point[];
    isenable=false;
    Valuesearched:string=" ";
    count:number=-1;
    myItems = new Array();
    i:number=0;
    value:number;
    constructor(private page:Page,private router: RouterExtensions,private back:BackendService,private firebaseService: FirebaseService){ 
        this.points= new Array<point>();
        this.point= new Array<point>();

      }
enable(){
this.isenable=true;
        }

 async onSubmit() { 
    if(this.Valuesearched!=" "){
        try{
            await  this.search();
            
        console.log("valuesehharched"+this.Valuesearched);
        this.enable();}catch(e){}
            }
}
async search(){  this.myItems = new  Array()
    if(this.Valuesearched!=""){
     let A = await firebase1.firestore().collection("busstops")
     .where("address",">=",this.Valuesearched)
     .where("address","<=",this.Valuesearched+"\uf8ff")
     
        


       await A.get()
        .then((querySnapshot: firestore.QuerySnapshot) => {
          console.log("jdksjkljd",querySnapshot)
              querySnapshot.forEach(doc =>{  
                  this.count++
                  console.log("a",this.count)
                  console.log(doc.id,JSON.stringify(doc.data()));
                  this.points[this.count]={
                    latitude:doc.data().latitude,
                    longitude:doc.data().longitude,
                    address:doc.data().address,
                    road:doc.data().road,
                    first:doc.data().first,
                    last:doc.data().last}; 
                  if (this.points[this.count].address.indexOf(this.Valuesearched) !== -1) {
                    this.myItems.push(this.points[this.count].address);        
                 console.log("length"+this.points.length)
                 console.log(this.points[this.count]);
                 console.log(this.myItems[this.count])
               } });
            })
        .catch(err => console.log("Where-get failed, error: " + err));
return 0;}
}
  async onTextChanged(args){  
   //this.firebaseService.Query()
    var listview:ListView  = <ListView>this.page.getViewById("listviewid")
  const searchBar = args.object as SearchBar;
    this.count=-1
  console.log(`Input changed! New value: ${searchBar.text}`);
  this.Valuesearched=searchBar.text.toString();  
    try{
      await this.search();
  }catch(e){} 
}

 onClear(args){
  console.log("valuesehharched4"+this.Valuesearched);
    this.points= new Array<point>();
    const searchBar = args.object as SearchBar;
    searchBar.text="";
    this.count=-1;
    this.myItems = new  Array()
}
  onItemTap(args) {
    console.log("it works"+ args.index);
    this.value=args.index;
    this.router.navigate(["/home"], { clearHistory: false } );
this.setpoint();
  }
setpoint(){
return this.back.setpoint(this.points[this.value]);
}


}


























