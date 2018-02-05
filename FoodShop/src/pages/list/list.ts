import { Component } from '@angular/core';
import { NavController, NavParams, LoadingController, AlertController, ModalController } from 'ionic-angular';
import { LoginService } from '../../providers/login-service';
import { LoginPage } from '../login/login';
import { OrderPage } from '../order/order';
import { OrderService } from '../../providers/order-service';
import {Observable} from 'rxjs/Rx';

@Component({
  selector: 'page-list',
  templateUrl: 'list.html',
  providers: [LoginService, OrderService]
})
export class ListPage {

  public openOrders:any;
  public currentTime:any;
  public refreshTimer:any;
  public secondsTimer:any;
  private selectedOrder:any;

  constructor(public navCtrl: NavController, public navParams: NavParams, public loginService: LoginService, 
    private orderService: OrderService, private loadingCtrl: LoadingController, private alertCtrl: AlertController,
    private modalCtrl: ModalController) {
     console.log('test');
      this.refreshTimer = Observable.timer(1000,20000);
      
      this.refreshTimer.subscribe(t=> {
        this.refresh();
      });
     
      this.secondsTimer = Observable.timer(1000,1000);
      this.secondsTimer.subscribe(t=> {
        this.upateTime(this.openOrders);
      });
  }

  refresh() {
    return new Promise((resolve) => { 
       this.orderService.getOpenOrders()
         .then(data => {
            this.upateTime(data);
            this.openOrders = data;
            resolve(data);
        })
        .catch(error => {
            console.log(error.status);
            if (error.status == 403) {
              this.logout();
            }
            console.log('sdadas');
        });
    });
  }

  upateTime(orders) { 
    for (let order of orders) {
      order.timeleft = this.calculateTime(order.pickupDate);
      if (order.timeleft == '00:00') {
        order.inOverdue = true;
      }
    }

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

  calculateTime(orderDate) {
    this.currentTime =  Math.floor(Date.now());
    var timestamp = orderDate - this.currentTime;
    if (timestamp < 0) {
      return "00:00";
    }
    timestamp = Math.floor(timestamp/1000)
    return this.twoDigits(Math.floor(timestamp/60)) + ':' + this.twoDigits(Math.abs(timestamp%60));
  }

  twoDigits(number) {
    if (number > -10  && number <10) {
      return "0" + number;
    } 
    return "" + number;
  }

  orderRowColor (order) {
    if (order.status == 'AWAITING_CONFIRMATION') {
      return "row new-order";
    } else if (order.inOverdue) {
      return "row overdue-order"
    }  
    return "row";
  }

  logout() {
    this.loginService.cleanTheToken();
    this.navCtrl.setRoot(LoginPage);
  }

  confirm(order, minutes) {
    let loading = this.loadingCtrl.create({
      content: 'Please wait...'
    });
    loading.present();
    this.orderService.confirmOrder(order, minutes)
    .then(data => {
      this.refresh().then(data => {
        loading.dismiss();
      });
        
     })
     .catch(error => {
      console.log(error);
      console.log("rere");
     });
  }

  handover(order, pin) {
    if (!isNaN(pin) && this.selectedOrder.pin == pin) {
      let loading = this.loadingCtrl.create({
        content: 'Please wait...'
      });
      loading.present();
      this.orderService.handoverOrder(order)
      .then(data => {
        this.refresh().then(data => {
          loading.dismiss();
        });
      })
      .catch(error => {
        console.log(error);
        loading.dismiss();
      });
    } else {
      alert("Невалиден ПИН");
    }

  }

  presentConfirmPrompt(order) {
    this.selectedOrder = order;
    let alert = this.alertCtrl.create({
      title: 'Потвърди',
      message: 'Шофьорът ще бъде при вас след 15 минути. Имате ли нужда от допълнително време?',      
      inputs: [{
        type: 'number',
        name: 'minutes',
        placeholder: '0 Минути'
      }],
      buttons: [{
        text: 'Назад',
        role: 'cancel',
        handler: data => {
          console.log('Cancel clicked');
        }
      },{
        text: 'Потвърди',
        handler: data => {
          if (data.minutes == '') {
            data.minutes = 0;
          }
          if (!isNaN(data.minutes)) {
            this.confirm(this.selectedOrder, data.minutes);
          }
        }
      }]
    });
    alert.present();
  }

  presentEnterPinPrompt(order) {
    this.selectedOrder = order;
    let alert = this.alertCtrl.create({
      title: 'Предай поръчката',
      message: 'Моля, въведете 4 цифрен пин код на поръчката.',      
      inputs: [{
        type: 'number',
        name: 'pin',
        placeholder: 'XXXX'
      }],
      buttons: [{
        text: 'Назад',
        role: 'cancel',
        handler: data => {
          console.log('Cancel clicked');
        }
      },{
        text: 'Предай',
        handler: data => {
          this.handover(this.selectedOrder, data.pin);
        }
      }]
    });
    alert.present();

  }

   presentOrderModal(order) {
    let orderModal = this.modalCtrl.create(OrderPage, { order: order });
    orderModal.onDidDismiss(data => {
       console.log(data);
     });
    orderModal.present();
  }

}
