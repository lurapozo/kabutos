import { Component, OnInit } from '@angular/core';
import { Storage } from '@ionic/storage';
import { IncorrectoPage } from '../aviso/incorrecto/incorrecto.page';
import { finalize } from 'rxjs/operators';
import { ModalController } from '@ionic/angular';
import { PerfilService } from '../servicios/perfil.service';
import { LoadingController } from '@ionic/angular';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { NavigationExtras, Router } from '@angular/router';
import { login } from 'src/app/global';

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.page.html',
  styleUrls: ['./perfil.page.scss'],
})
export class PerfilPage implements OnInit {
  private correo: string = "";
  perfil: any;
  loading: any;
  url;
  date = "";


  constructor(
    private storage: Storage,
    public perfilService: PerfilService,
    public loadingCtrl: LoadingController,
    public modalController: ModalController,
    private http: HttpClient,
    private router: Router,

  ) { }

  ngOnInit() {

  }

  ionViewDidEnter() {
    console.log("didEnter");
    this.storage.get('perfil').then((val) => {

      if (val == null) {
        this.storage.get('correo').then((val) => {
          this.correo = val;
          if (this.correo != null) {
            this.perfilService.getPerfil(this.correo).subscribe(
              data => {
                this.perfil = data[0];
                console.log(data);
                if (this.perfil.telefono == "NONE") {
                  this.perfil.telefono = "";
                }
                if (this.perfil.direccion == "NONE") {
                  this.perfil.direccion = "";
                }
                this.imageURL()
                console.log(this.url)
                if (Object.keys(this.perfil).length === 0) {
                  this.mensajeIncorrecto("Algo Salio mal", "Fallo en la conexión")
                } else {
                  this.storage.set('perfil', this.perfil);
                  console.log("se guardo el perfil")
                }

              },
              err => {
                this.mensajeIncorrecto("Algo Salio mal", "Fallo en la conexión")
              }
            );
          } else {
            this.correo = "";
          }

        });
      } else {
        console.log(val)
        this.perfil = val;
        if (this.perfil.url != undefined) {
          this.url = this.perfil.url;
        } else {
          this.imageURL()
        }
      }
    });
  }

  async mensajeIncorrecto(titulo: string, mensaje: string) {
    const modal = await this.modalController.create({
      component: IncorrectoPage,
      cssClass: 'IncorrectoProducto',
      componentProps: {
        'titulo': titulo,
        'mensaje': mensaje
      }
    });
    return await modal.present();
  }
  async showLoading2() {
    this.loading = await this.loadingCtrl.create({
      message: 'Loading.....'
    });
    await this.loading.present();
  }

  editar() {
    this.router.navigate(['/footer/perfil/editar-perfil']);
  }

  imageURL():any {
    const getImageOrFallback = (path, fallback) => {
      return new Promise(resolve => {
        const img = new Image();
        img.src = path;
        img.onload = () => resolve(path);
        img.onerror = () => resolve(fallback);
      });
    };
    getImageOrFallback(
      "http://cabutoshop.pythonanywhere.com" + this.perfil.imagen,
      "../assets/img/avatar_perfil2.png"
      ).then(result => {
        this.url=result
        this.perfil.url=result
        this.storage.set("perfil", this.perfil)
      })
  }
}
