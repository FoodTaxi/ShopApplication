import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { AuthHttp } from 'angular2-jwt';
import 'rxjs/add/operator/map';
import {AppSettings} from '../common/appSettings';

@Injectable()
export class OrderService {
  
  error: string;

  constructor(public http: Http, public authHttp: AuthHttp) {
   
  }



  getOpenOrders() {
  	return new Promise((resolve,reject) => {
    	// We're using Angular HTTP provider to request the data,
   		// then on the response, it'll map the JSON data to a parsed JS object.
    	// Next, we process the data and resolve the promise with the new data.
    	this.authHttp.get(AppSettings.API_ENDPOINT + '/private/order/shop?sid=0')
       .map(res => res.json())
       .subscribe(data => {
          resolve(data);
        }, err => {
          console.log('dsajdhaskdbaskjdhjksahdaskj');
          console.log(err)
          reject(err);
        });
  	});
  }

  confirmOrder(order, minutes) {
    return new Promise((resolve,reject) => {

      let confirmObject  = {
        "completionMinutes": Number(minutes),
        "confirmed": true,
        "orderId": order.id
      };
      this.authHttp.post(AppSettings.API_ENDPOINT + '/private/order/confirm', confirmObject)
       .subscribe(data => {
          resolve(data);
        }, err => {
          console.log(err)
          reject(err);
        });
    });
  }

   handoverOrder(order) {
    return new Promise((resolve,reject) => {

      this.authHttp.post(AppSettings.API_ENDPOINT + '/private/order/handover?oid=' + order.id, {})
       .subscribe(data => {
          resolve(data);
        }, err => {
          console.log(err)
          reject(err);
        });
    });
  }
}
