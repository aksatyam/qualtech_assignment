import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { LoadingController, AlertController, ToastController, Platform } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { SQLite, SQLiteObject } from '@ionic-native/sqlite';

@Injectable()
export class ServiceSingletonProvider {
  public toast: any;
  public alert: any;
  public loading: any;
  public isLogedIn: boolean = false;
  public baseURL: any;
  constructor(public http: HttpClient,
    public loadingCtrl: LoadingController,
    public alertCtrl: AlertController,
    public toastCtrl: ToastController,
    public storage: Storage,
    public sqlite: SQLite,
    public platform: Platform) {
    console.log('Hello ServiceSingletonProvider Provider');
    const user_info = {
      username: 'qualtech',
      password: 'qualtech123',
    }
    this.storage.get('user_info').then(res => {
      if (res == null) {
        this.setStorage('user_info', user_info);
      }
    })
      .catch(err => {
        console.log('Data saving error');
      });

    this.getStorage('isLogedIn').then(res => {
      if (res != null) {
        this.isLogedIn = res;
      }
    })
      .catch(err => {
        console.log('Logging err');
      });

      if(this.platform.is('cordova')) {
        this.sqlite.create({
          name: 'qualtech.db',
          location: 'default'
        }).then((db: SQLiteObject) => {
          db.executeSql('create table user_master(username VARCHAR(32), password VARCHAR(32))').then(res => {
            this.presentToast('Table Created SuccdessFully', true);
          })
          .catch(err => {
            console.log(`${err}`);
          });
        })
        .catch(err => {
          console.log(`${err}`);
        });
      }

  }

  presentLoading() {
    this.loading = this.loadingCtrl.create({
      spinner: 'ios',
      content: 'Please wait...'
    }).present();
  }

  dismissLoading() {
    return this.loading.dismiss();
  }

  presentConfirm(title, message) {
    this.alert = this.alertCtrl.create({
      title: `${title}`,
      message: `${message}`,
      buttons: [{
        text: 'Dismiss',
        handler: () => {
          console.log('dismiss clicked');
        },
      }]
    }).present();
  }

  presentToast(message: string, type: boolean) {
    this.toast = this.toastCtrl.create({
      message: `${message}`,
      duration: 3000,
      position: 'bottom',
      cssClass: type ? 'success' : 'failure',
    }).present();
  }

  setStorage(key, val) {
    this.storage.set(key, val).then(res => {
      console.log('Data Saved success');
    })
      .catch(err => {
        console.log('Data Saving error');
      })
  }

  getStorage(key) {
    return this.storage.get(key).then(res => {
      return res;
    })
      .catch(err => {
        return err;
      })
  }

  getAllCountries() {
    this.baseURL = `https://restcountries.eu/rest/v1/all`
    return this.http.get(this.baseURL);
  }
}
