import { Component } from '@angular/core';
import { NavController, NavParams, ViewController} from 'ionic-angular';


/**
 * Generated class for the Delivery page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-order',
  templateUrl: 'order.html',
})
export class OrderPage {

  public order:any;

  constructor(public navCtrl: NavController, public navParams: NavParams, private viewCtrl: ViewController) {
    this.order = navParams.get('order');
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad Order');
  }

   closeModal() {
    this.viewCtrl.dismiss();
  }
}
