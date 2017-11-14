import { Component, ViewChild } from '@angular/core';
import { Nav, Platform } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { ListPage } from '../pages/list/list';
import { LoginPage } from '../pages/login/login';

import { LoginService } from '../providers/login-service';


@Component({
  templateUrl: 'app.html',
  providers: [LoginService]
})
export class MyApp {
  @ViewChild(Nav) nav: Nav;

  rootPage: any = LoginPage;


  constructor(public platform: Platform, public statusBar: StatusBar, public splashScreen: SplashScreen, public loginService: LoginService) {
    this.initializeApp();

  }

  initializeApp() {
    this.platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      this.statusBar.styleDefault();
      this.splashScreen.hide();

       this.loginService.isTokenSaved().then(saved => {
        if(saved) {
          this.nav.setRoot(ListPage);
        }
      });
    });
  } 
}
