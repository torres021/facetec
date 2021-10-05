import { Component } from '@angular/core';
// import {AndroidPermissions} from '@ionic-native/android-permissions/ngx';
import {Platform, ToastController} from "@ionic/angular";
import {AndroidPermissions} from "@ionic-native/android-permissions/ngx";


@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  intentos: number;
  constructor(private platform: Platform, private toastController: ToastController, private androidPermissions: AndroidPermissions) {
    this.initializeApp();
  }

  initializeApp() {
    this.platform.ready().then( async () => {
      this.androidPermissions.checkPermission(this.androidPermissions.PERMISSION.CAMERA).then((resul) => {
        console.log(resul);
        if (!resul.hasPermission) {
          const permiso = [];
          permiso.push(this.androidPermissions.PERMISSION.CAMERA);
          const prueba =  this.androidPermissions.hasPermission(this.androidPermissions.PERMISSION.CAMERA);
          this.androidPermissions.requestPermissions([this.androidPermissions.PERMISSION.CAMERA]).then((resPer) => {
            console.log(resPer);
            if (!resPer.hasPermission) {
              this.intentos = this.intentos + 1;
              if (this.intentos >= 3) {
                this.mostrarError('Permiso de cámara requerido, para continuar con proceso. Puede activar el permiso desde Ajustes->Aplicaciones->Permisos');

              } else {
              }
            } else {
            }
          }, errorP => {
            this.mostrarError('Error intentando establecer permisos para la cámara');
          });
        } else {
        }
      }, err => {
        this.mostrarError('Error intentando validar permisos para la cámara');
      });
    });
  }

  async mostrarError(error: string) {
    const toast = await this.toastController.create({
      message: error,
      color: 'danger',
      duration: 10000,
      showCloseButton: true,
      closeButtonText: 'Ok'
    });
    toast.present();
  }
}
