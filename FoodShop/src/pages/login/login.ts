import { Component } from '@angular/core';

import { ViewController, LoadingController, NavController } from 'ionic-angular';
import { LoginService } from '../../providers/login-service';
import { ListPage } from '../list/list';

@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
  providers: [LoginService]
})
export class LoginPage {
  
  	username:string;
    password:string;
  constructor(public viewCtrl: ViewController, public loadingCtrl: LoadingController, public loginService: LoginService, public navCtrl: NavController,) {
  }

  login() {

	let loading = this.loadingCtrl.create({
		content: 'Please wait...'
	});

	loading.present();
	this.loginService.login(this.username, this.password)
		.then(data => {
			loading.dismiss();
			this.navCtrl.setRoot(ListPage);
		}, err => {
			console.log(err);
			alert(JSON.parse(err._body).message);
			loading.dismiss();
		});
  }
}
