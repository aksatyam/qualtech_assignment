import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { ServiceSingletonProvider } from '../../providers/service-singleton/service-singleton';
import { HomePage } from '../home/home';

@IonicPage()
@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage {
  regExp = new RegExp("^([a-z0-9]{5,})$");
  username: any = '';
  password: any = '';
  constructor(public navCtrl: NavController, public navParams: NavParams, public apiServices: ServiceSingletonProvider) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad LoginPage');
  }

  ValidateLogin() {
    if (this.username == '' && this.password == '') {
      return this.apiServices.presentConfirm('Alert!', 'Enter username and password.');
    }
    else if (this.username == '') {
      return this.apiServices.presentConfirm('Alert!', 'Enter username.');
    }
    else if (this.password == '') {
      return this.apiServices.presentConfirm('Alert!', 'Enter password.');
    }
    else if (!this.regExp.test(this.password)) {
      return this.apiServices.presentConfirm('Alert!', 'Passwors should be minimum 5 character.');
    }
    else {
      this.apiServices.getStorage('user_info').then(res => {
        if (res!=null) {
          return this.validateInfo(res);  
        }
      })
      .catch(err => {
        console.log(err);
      })
    }
  }


  validateInfo(res) {
    if (this.username != res.username && this.password != res.password) {
      return this.apiServices.presentConfirm('Error!', 'Invalid username and password');
    }
    else if(this.username != res.username) {
      return this.apiServices.presentConfirm('Error!', 'Invalid username.');
    }
    else if(this.password != res.password) {
      return this.apiServices.presentConfirm('Error!', 'Invalid password.');
    }
    else {
      this.apiServices.setStorage('isLogedIn', true);
      this.navCtrl.setRoot(HomePage)
    }
  }
}
