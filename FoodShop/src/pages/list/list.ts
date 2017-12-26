import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { LoginService } from '../../providers/login-service';
import { LoginPage } from '../login/login';
import { OrderService } from '../../providers/order-service';


@Component({
  selector: 'page-list',
  templateUrl: 'list.html',
  providers: [LoginService, OrderService]
})
export class ListPage {

  public openOrders:any;

  constructor(public navCtrl: NavController, public navParams: NavParams, public loginService: LoginService, public orderService: OrderService) {
     console.log('test');
  }

   ionViewDidLoad() {
     this.orderService.getOpenOrders()
     .then(data => {
       console.log(data);
       this.openOrders = data;
     })
     .catch(error => {
      console.log(error);
      console.log("rere");
     });
  }

  logout() {
    this.loginService.cleanTheToken();
    this.navCtrl.setRoot(LoginPage);
  }

  confirm(order) {
    console.log('in');
    console.log(order);
    this.orderService.confirmOrder(order)
    .then(data => {
       console.log(data);
     })
     .catch(error => {
      console.log(error);
      console.log("rere");
     });
  }
}
