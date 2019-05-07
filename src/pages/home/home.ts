import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { ServiceSingletonProvider } from '../../providers/service-singleton/service-singleton';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  public data: any;
  public items: any = [];
  constructor(public navCtrl: NavController, public apiServices: ServiceSingletonProvider) {
    this.refreshData();
  }

  refreshData() {
    this.apiServices.presentToast('Getting data...', true);
    this.apiServices.getStorage('countryList').then(res => {
      if (res != null) {
        this.data = res;
        for (let i = 0; i < 20; i++) {
          this.items.push(this.data[i]);
        }
      }
      else {
        this.apiServices.getAllCountries().subscribe(res => {
          if (res) {
            this.data = res;
            this.apiServices.setStorage('countryList', this.data);
            for (let i = 0; i < 20; i++) {
              this.items.push(this.data[i]);
            }
          }
        }, err => {
          console.log(`${err}`)
        })
      }
    }).catch(err => {
      console.log(`${err}`);
    })
  }

  doInfinite(infiniteScroll) {
    console.log('Begin async operation');
    const length = this.items.length;
    setTimeout(() => {
      for (let i = length; i < (length + 20); i++) {
        if (i < this.data.length) {
          this.items.push(this.data[i]);
        }
      }
      console.log('Async operation has ended');
      infiniteScroll.complete();
    }, 500);
  }

  update(item, i) {
    console.log(item, i);
    this.apiServices.alertCtrl.create({
      title: 'Edit',
      inputs: [{
        name: `Country`,
        placeholder: `${item.name}`,
        type: 'text',
      }],
      buttons: [{
        text: 'Dismiss',
        handler: () => {
          console.log('dismiss clicked');
        }
      },
      {
        text: 'Update',
        handler: data => {
          console.log(data);
          if (data.Country != null && data.Country != "") {
            this.items[i].name = data.Country;
          }
        }
      }]
    }).present();
  }

  delete(item, i) {
    this.items.splice(item, 1);
  }

  addItem() {
    this.apiServices.alertCtrl.create({
      title: 'Add',
      inputs: [
        {
          name: 'Country',
          placeholder: 'Enter country name',
          type: 'text',
        },
      ],
      buttons: [{
        text: 'Dismiss',
        handler: () => {
          console.log('dismiss clicked');
        }
      },
      {
        text: 'Save',
        handler: data => {
          console.log(data);
          if (data.Country != null && data.Country != "") {
            const obj = {
              name: data.Country
            }
            this.items.unshift(obj);
          }
        }
      }]
    }).present();
  }

  doRefresh(refresher) {
    console.log('Begin async operation', refresher);
    setTimeout(() => {
      this.refreshData();
      console.log('Async operation has ended');
      refresher.complete();
    }, 2000);
  }
}
