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
  public authenticated = false;
  constructor(public viewCtrl: ViewController, public loadingCtrl: LoadingController, public loginService: LoginService, public navCtrl: NavController,) {
  }

  login(username, password) {

	let loading = this.loadingCtrl.create({
		content: 'Please wait...'
	});

	loading.present();
	this.loginService.login(username, password)
		.then(data => {
			this.authenticated = true;
			loading.dismiss();
			this.navCtrl.setRoot(ListPage);
		}, err => {
			this.authenticated = false;
			console.log(err);
			alert(JSON.parse(err._body).message);
			loading.dismiss();
		});
  }
}
