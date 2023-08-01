import { Component, OnInit, ViewChild, ElementRef } from "@angular/core";
import * as geolocation from "nativescript-geolocation";
import { Accuracy } from 'tns-core-modules/ui/enums';  
import {registerElement} from "nativescript-angular/element-registry";
import { Page, Color } from "tns-core-modules/ui/page/page";
import { RouterExtensions } from "nativescript-angular/router";
import { BackendService } from "../services/backend.service";
import {point} from "../models/point.model";
import { MapView,Marker, Position, Polyline } from "nativescript-google-maps-sdk";
import { firestore } from "nativescript-plugin-firebase/firebase";
import { objectdetection } from "nativescript-plugin-firebase/mlkit";
import { ObservableArray } from "tns-core-modules/data/observable-array/observable-array";
const firebase1 = require("nativescript-plugin-firebase/app");
import {road } from "../models/road.model"
registerElement("MapView", () => require("nativescript-google-maps-sdk").MapView);

@Component({
   selector:'ns-home',
   templateUrl:"./home.component.html",
   styleUrls:['./home.component.css'],
   moduleId: module.id
})
   
export class HomeComponent  implements OnInit   {

    @ViewChild("MapView",{ static: false }) map: ElementRef;
   currentLat: number=35.403727;
   currentLng: number=0.136723;
   mapView: any;
   point:point;
   points:point[];
   statu:boolean=false;
    count:number=-1;
    roads:string[];
    count1:number=0;
    road=[];
    arret=[];
    latlog:string
    
   

 constructor(private page:Page,private router: RouterExtensions,private back:BackendService){
    this.points= new  Array<point>()
    this.roads= new Array<string>()
    
    //this.road= new Array<road>() 
}
 
     ngOnInit():void {   
     console.log('checking if geolocation is enabled');
     geolocation.isEnabled().then(enabled => {
         console.log('isEnabled =', enabled);
         if (enabled) {
            this.watch();
         } else { 
            this.request();
         }
     }, e => {
         console.log('isEnabled error', e);
     });
 }

 request() {
     console.log('enableLocationRequest()');
     geolocation.enableLocationRequest().then(() => {
         console.log('location enabled!');
         this.watch();
     }, e => { 
         console.log('Failed to enable', e);
     });
 }
 watch() {
     console.log('watchLocation()');
     geolocation.watchLocation(position => {
         this.currentLat = position.latitude;
         this.currentLng = position.longitude;
     }, e => {
         console.log('failed to get location');
     }, { desiredAccuracy: Accuracy.high, maximumAge: 5000, timeout: 20000 });
    }

   onMapReady(args: any) {   
       this.mapView = args.object;
        this.mapView.zoomGesturesEnabled = true;
        var gMap = this.mapView.gMap; 
        gMap.getUiSettings().setMapToolbarEnabled(false);
        this.mapView.latitude =this.currentLat ;
        this.mapView.longitude = this.currentLng;
        console.log("",this.mapView.latitude + "" + this.mapView.longitude);
        this.mapView.zoom = 13.6;
        this.mapView.myLocationEnabled = true;
        if(!this.statu){
            this.marker();

            this.Polyline();

        }
        
    }
    
  marker(){ this.statu=true;
    console.log("bdjkqs"+this.back.getpoint())
      this.point=this.back.getpoint();
      console.log("bdjkqs"+this.point)
    if(this.back.isyes()==true){
     let busMarker = new Marker();
    busMarker.position = Position.positionFromLatLng(this.point.latitude,this.point.longitude);
   busMarker.title =this.point.address ;
    busMarker.color = "red";
  this.mapView.addMarker(busMarker)
   
         console.log("b"+busMarker.title);
}
}
async Polyline(){      
    this.count=-1
    this.mapView.removeAllPolylines();
// this function drew the polylines with firebase 

  
        if(this.point.address!=""){
            let A= await firebase1.firestore().collectionGroup("busstop")
            .where("address","==",this.point.address)
console.log(this.point.address)
           await A.get()
            .then((querySnapshot: firestore.QuerySnapshot) => {
                querySnapshot.forEach(doc =>{  
                    this.count++
                    console.log("ba"+this.count)
                    console.log(doc.id,JSON.stringify(doc.ref.parent.parent.id));
                 this.roads[this.count]=doc.ref.parent.parent.id
                 console.dir(this.roads[this.count])
                 let g=this.count
              })  })  
            .catch(err => console.log("Where-get failed, error: " + err));
            this.count1=this.count
            for(let i=0;i<this.roads.length;i++){ 
                this.arret[i]=[]
                          this.count=0
            let B= await firebase1.firestore().collection("road").doc(this.roads[i]).collection("busstop")
console.log(" jgsdjhk"+this.roads.length+" "+this.roads[i])
           await B.get()
            .then((querySnapshot: firestore.QuerySnapshot) => {
                querySnapshot.forEach(doc =>{  
                    console.log("a2",this.count)
                   this.points[this.count]={latitude:doc.data().location.latitude,longitude:doc.data().location.longitude,address:doc.data().address,road:doc.data().road,first:doc.data().first,last:doc.data().last}; 
                  // console.log(this.points[this.count]);
                   this.count++
}) }).catch(err => console.log("Where-get failed, error: " + err));
         var polyline = new Polyline()
          
           for(let k=0;k<this.points.length;k++){
                var busMarker = new Marker();
        busMarker.position = Position.positionFromLatLng(this.points[k].latitude,this.points[k].longitude);
           console.dir(busMarker.position)
           busMarker.title =this.points[k].address;
            busMarker.color = "yellow";  
            busMarker.userData={index:k}

            console.dir(busMarker)
           this.arret[i][k]=busMarker
           // console.dir(this.arret[i][k])
           // console.dir(this.arret[k].position)
            polyline.addPoint(Position.positionFromLatLng(this.points[k].latitude,this.points[k].longitude))
        }
         
             polyline.visible = true;
             polyline.width =10;
             polyline.color = new Color(this.getRandomColor())
             polyline.clickable = true;
             this.road[i]=polyline
             console.log("i"+i)
            
         


        }
 
 
 for(let j=0;j<=this.count1;j++){
     console.dir(this.count1)
     this.mapView.addPolyline(this.road[j])
     console.dir(this.count1) 
     for(let i=0;i<this.arret[j].length;i++){
        console.dir(this.arret[j].length)
      this.mapView.addMarker(this.arret[j][i])

 }}
  
   // polyline.geodesic = false;

}
   
}

getRandomColor() {
    var letters = '0123456789ABCDEF';
    var color = '#';
    for (var i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
    }

}


