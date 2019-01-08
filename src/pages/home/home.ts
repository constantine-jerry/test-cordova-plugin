import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { MyCordovaPlugin } from '@ionic-native/my-cordova-plugin';

// declare const cordova;

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  constructor(public navCtrl: NavController,
    private myCordovaPlugin: MyCordovaPlugin
    ) {

  }

  private testCordovaPlugin() {
    // cordova.plugins.MyCordovaPlugin.showNativeAlert(2, (result)=> {
    //   console.log(result);
    // }, (err) => {
    //   console.error(err)
    // });
    this.myCordovaPlugin.showNativeAlert(3)
    .then(result => {
      console.log(result);
    })
    .catch(err => {
      console.error(err);
    })
  }
}
