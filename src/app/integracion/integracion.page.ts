import { Component, OnInit } from '@angular/core';
import {SampleApp} from "../../assets/facetec/sampleAppController";
import {ToastController} from "@ionic/angular";
import {Subject} from "rxjs";
import {AndroidPermissions} from "@ionic-native/android-permissions/ngx";

@Component({
  selector: 'app-integracion',
  templateUrl: './integracion.page.html',
  styleUrls: ['./integracion.page.scss'],
})
export class IntegracionPage implements OnInit {
  private notificador = new Subject<any>();
  notificador$ = this.notificador.asObservable();
  intentos: number = 0;
  constructor(private toastController: ToastController, private androidPermissions: AndroidPermissions) { }

  ngOnInit() {
    this.notificador$.subscribe(mensaje => {
      if (mensaje) {
        if (!mensaje.estado && mensaje.mensaje) {
          this.mostrarError(mensaje.mensaje);
        } else if (mensaje.estado) {
          if (mensaje.mensaje && mensaje.mensaje.latestSessionResult && mensaje.mensaje.latestSessionResult.isCompletelyDone) {
            this.mostrarMensaje('Proceso finalizado');
          } else {
            this.mostrarError('No se finalizo el proceso correctamente');
          }
        }
      } else {
        this.mostrarError('Intente nuevente');
      }
    });
  }

  iniciarFacetec() {
    if (SampleApp.isLockedOut()) {
      this.mostrarError('Se presenta un bloqueo por cantidad de intentos.. Espere unos minutos.');
      return;
    }

    if (SampleApp.getStatusFaceTec() !== 1) {
      this.mostrarError(SampleApp.getStatusMessageFaceTec());
      return;
    }
    /* onPhotoIdMatchPressed*/

    SampleApp.onPhotoIDMatchPressed(this.notificador, ('CC' + '1100957789'));
  }

  permisos() {
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
              this.iniciarFacetec();
            }
          } else {
            this.iniciarFacetec();
          }
        }, errorP => {
          this.mostrarError('Error intentando establecer permisos para la cámara');
        });
      } else {
        this.iniciarFacetec();
      }
    }, err => {
      this.mostrarError('Error intentando validar permisos para la cámara');
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

  async mostrarMensaje(error: string) {
    const toast = await this.toastController.create({
      message: error,
      color: 'success',
      duration: 10000,
      showCloseButton: true,
      closeButtonText: 'Ok'
    });
    toast.present();
  }

  /*Agregar a interface ToastOptions
  *
  * showCloseButton: boolean;
  closeButtonText: string;
  * */
}
