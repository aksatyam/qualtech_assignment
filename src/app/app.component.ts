import { Component } from '@angular/core';
import { Platform } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { HomePage } from '../pages/home/home';
import { LoginPage } from '../pages/login/login';
import { ServiceSingletonProvider } from '../providers/service-singleton/service-singleton';

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  rootPage:any;

  constructor(platform: Platform, statusBar: StatusBar, splashScreen: SplashScreen, public apiServices: ServiceSingletonProvider) {
    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      statusBar.styleDefault();
      splashScreen.hide();
    });

    this.apiServices.getStorage('isLogedIn').then(res => {
      if (res != null) {
        if (res) {
          this.rootPage = HomePage;
        }
        else {
          this.rootPage = LoginPage;
        }
      }
      else {
        this.rootPage = LoginPage;
      }
    })
    .catch(err => {
      console.log(`${err}`)
    })
  }
}

