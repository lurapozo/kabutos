import { Component, OnInit } from "@angular/core";
import { PerfilService } from "../servicios/perfil.service";
import { TarjetasDeRegaloService } from "../servicios/tarjetas-de-regalo.service";
import { LoadingController } from "@ionic/angular";
import { IncorrectoPage } from "../aviso/incorrecto/incorrecto.page";
import { CorrectoPage } from "../aviso/correcto/correcto.page";
import { NavController, ModalController } from "@ionic/angular";
import { FileUploader } from "ng2-file-upload";
import { Router } from "@angular/router";

import { Storage } from "@ionic/storage";
import { finalize } from "rxjs/operators";
import { AnimationOptions } from "@ionic/angular/providers/nav-controller";
import { database } from "firebase";
@Component({
  selector: "app-tarjetas-de-regalo",
  templateUrl: "./tarjetas-de-regalo.page.html",
  styleUrls: ["./tarjetas-de-regalo.page.scss"],
})
export class TarjetasDeRegaloPage implements OnInit {
  perfil: any;
  tarjetas: {};
  url = "";
  loader: any;
  valor = 0;
  private correo: String = "";

  constructor(
    public TarjetasDeRegaloService: TarjetasDeRegaloService,
    public modalCtrl: ModalController,
    private loadingCtrl: LoadingController,
    private storage: Storage,
    private navCtrlr: NavController, 
    private router: Router
  ) {
    this.storage.get("perfil").then((val) => {
      if (val != null) {
        this.perfil = val;
      }
    });
  }

  ngOnInit() {
    let id: number;
    this.storage.get("perfil").then((val) => {
      if (val != null) {
        id = val.id;
        console.log("refresh");
        this.TarjetasDeRegaloService.getTarjetasRegalo(id).subscribe(
          (data) => {
            //console.log("esta es la data "+data["nombre"])
            this.tarjetas = data;
            var tol = Object.entries(this.tarjetas).length;
            if (tol == 0) {
              this.mensajeIncorrecto("No hay tarjetaaas de regalo", "Si");
            }
          },
          (error) => {
            console.log("algo salio mal");
            this.mensajeIncorrecto("Algo salió mal", "error de conexión");
            console.error(error);
          }
        );
      }
    });
  }

  async mensajeIncorrecto(titulo: string, mensaje: string) {
    const modal = await this.modalCtrl.create({
      component: IncorrectoPage,
      cssClass: "IncorrectoProducto",
      componentProps: {
        titulo: titulo,
        mensaje: mensaje,
      },
    });
    return await modal.present();
  }
  atras() {
    let animations: AnimationOptions = {
      animated: true,
      animationDirection: "back",
    };
    this.navCtrlr.back(animations);
  }

  async showLoading2() {
    this.loader = await this.loadingCtrl.create({
      message: "Loading.....",
    });
    await this.loader.present();
  }

  regalar() {
    this.router.navigate(["/footer/hacer-regalo"]);
  }
}
