import { Component, OnInit } from "@angular/core";
import { PerfilService } from "../servicios/perfil.service";

import { AnimationOptions } from "@ionic/angular/providers/nav-controller";
import { LoadingController } from "@ionic/angular";
import { IncorrectoPage } from "../aviso/incorrecto/incorrecto.page";
import { CorrectoPage } from "../aviso/correcto/correcto.page";
import { NavController, ModalController } from "@ionic/angular";
import { Storage } from "@ionic/storage";
import { Router } from "@angular/router";

@Component({
  selector: "app-hacer-regalo-monto",
  templateUrl: "./hacer-regalo-monto.page.html",
  styleUrls: ["./hacer-regalo-monto.page.scss"],
})
export class HacerRegaloMontoPage implements OnInit {
  perfil: any;
  loading: any;
  monto: any;

  constructor(
    private storage: Storage,
    public perfilService: PerfilService,
    
    private navCtrlr: NavController,
    public loadingCtrl: LoadingController,
    public modalController: ModalController,
    private router: Router
  ) {
    this.storage.get("perfil").then((val) => {
      if (val != null) {
        this.perfil = val;
      }
    });
  }

  ngOnInit() {}

  atras() {
    let animations: AnimationOptions = {
      animated: true,
      animationDirection: "back",
    };
    this.navCtrlr.back(animations);
  }

  async showLoading2() {
    this.loading = await this.loadingCtrl.create({
      message: "Loading.....",
    });
    await this.loading.present();
  }

  async mensajeIncorrecto(titulo: string, mensaje: string) {
    const modal = await this.modalController.create({
      component: IncorrectoPage,
      cssClass: "IncorrectoProducto",
      componentProps: {
        titulo: titulo,
        mensaje: mensaje,
      },
    });
    return await modal.present();
  }

  async mensajeCorrecto(titulo: string, mensaje: string) {
    const modal = await this.modalController.create({
      component: CorrectoPage,
      cssClass: "CorrectoProducto",
      componentProps: {
        titulo: titulo,
        mensaje: mensaje,
      },
    });
    return await modal.present();
  }

  aceptar(form) {
    if (form.value.monto <= 0 || !form.value.monto) {
      this.mensajeIncorrecto(
        "Cantidad Invalida",
        "Ingrese una cantidad mayor a 0usd."
      );
    } else{
      this.storage.set("total",form.value.monto)
      this.storage.set("tarjetaRegaloMonto",'si')
      this.storage.set("tipoPago",'Tarjeta')
      this.storage.set("tipoEntrega",'Local')
      this.storage.set("usaTarMont",'no')
      this.storage.set("direccionEntrega",1)
      this.router.navigate(["/footer/tarjeta"]);
    }
    //this.enviarForm(formData)
  }
}
