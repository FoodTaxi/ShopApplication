import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { LoginService } from '../../providers/login-service';
import { LoginPage } from '../login/login';


@Component({
  selector: 'page-list',
  templateUrl: 'list.html',
  providers: [LoginService]
})
export class ListPage {

  constructor(public navCtrl: NavController, public navParams: NavParams, public loginService: LoginService) {
  }

  logout() {
    this.loginService.cleanTheToken();
    this.navCtrl.setRoot(LoginPage);
  }
}
