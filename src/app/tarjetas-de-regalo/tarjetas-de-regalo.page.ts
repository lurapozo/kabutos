import { Component, OnInit } from "@angular/core";
import { login } from "./../global";
import { PerfilService } from "../servicios/perfil.service";
import { TarjetasDeRegaloService } from "../servicios/tarjetas-de-regalo.service";
import { LoadingController } from "@ionic/angular";
import { IncorrectoPage } from "../aviso/incorrecto/incorrecto.page";
import { CorrectoPage } from "../aviso/correcto/correcto.page";
import { NavController, ModalController } from "@ionic/angular";
import { FileUploader } from "ng2-file-upload";
import { Router } from "@angular/router";
import { ShoppingCartService } from "../servicios/shopping-cart.service";
import { Storage } from "@ionic/storage";
import { finalize } from "rxjs/operators";
import { AnimationOptions } from "@ionic/angular/providers/nav-controller";
import { database } from "firebase";
declare var window;
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
    private router: Router,
    private shoppingCart: ShoppingCartService
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

  async mensajeCorrecto(titulo: string, mensaje: string) {
    const modal = await this.modalCtrl.create({
      component: CorrectoPage,
      cssClass: "CorrectoProducto",
      componentProps: {
        titulo: titulo,
        mensaje: mensaje,
      },
    });
    return await modal.present();
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

  agregar(monto: string, id: string) {
    this.getCorreo();
    var doc = document.getElementById(monto);
    var doc2 = document.getElementById("Tarjeta" + id);
    doc2.style.visibility = "hidden";
    this.storage.get("name").then((nombre) => {
      console.log("Name is", nombre);
      if (login.login == false && nombre == null) {
        login.producto = true;
        this.router.navigateByUrl("/login");
      } else {
        var cantidad = "1";
        console.log("La cantidad que se agrega al carrito es: ", cantidad);
        if (parseInt(cantidad) > 0) {
          const tarjetaxcant = {
            monto: monto,
            cantidad: parseInt(cantidad),
            correo: this.correo,
            id_tarjeta: id,
          };
          console.log(tarjetaxcant);
          this.shoppingCart.addTarjetaRegaloMonto(tarjetaxcant).subscribe((data) => {
            console.log(data);
            if (data.valid == "OK") {
              this.mensajeCorrecto(
                "Tarjeta de regalo Agregada",
                "Tarjeta de regalo Agregado Exitosamente"
              );
            } else if (data.valid == "IN") {
              this.mensajeIncorrecto(
                "Agregar Tarjeta de regalo",
                "Tarjeta de regalo ya existe en carrito"
              );
            } else if (data.valid == "NOT") {
              this.mensajeIncorrecto(
                "Agregar Tarjeta de regalo",
                "Ha ocurrido un error, revise su conexión"
              );
            }
          });
          window.footer.datos();
        } else {
          this.mensajeIncorrecto(
            "Agregar Cupón",
            "No ha escogido la cantidad para agregar"
          );
        }
      }
    });
  }

  
  getCorreo() {
    console.log(login.login);
    this.storage.get("correo").then((val) => {
      this.correo = val;
      console.log("name: ", this.correo);
    });
  }

  mostrar(id: string) {
    console.log("esto en mostrar y el id que tengo es", id);
    var doc = document.getElementById("Tarjeta" + id);
    console.log(doc);
    console.log(doc.style.visibility);
    if (doc.style.visibility === "visible") {
      doc.style.visibility = "hidden";
    } else {
      doc.style.visibility = "visible";
    }
  }
}
