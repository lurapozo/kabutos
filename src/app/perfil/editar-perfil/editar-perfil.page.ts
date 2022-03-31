import { Component, OnInit } from '@angular/core';
import { PerfilService } from '../../servicios/perfil.service';
import { LoadingController } from '@ionic/angular';
import { NavController,ModalController } from '@ionic/angular';
import { IncorrectoPage } from '../../aviso/incorrecto/incorrecto.page';
import { finalize } from 'rxjs/operators';
import { FileUploader} from  'ng2-file-upload';
import { Router } from '@angular/router';
import { Storage } from '@ionic/storage';
import { login } from 'src/app/global';
import { AnimationOptions } from '@ionic/angular/providers/nav-controller';



@Component({
  selector: 'app-editar-perfil',
  templateUrl: './editar-perfil.page.html',
  styleUrls: ['./editar-perfil.page.scss'],
})
export class EditarPerfilPage implements OnInit {
  
  
  public fileUploader: FileUploader = new FileUploader({});
  formData = new FormData();
  perfil: any;
  loading: any;
  imagenUrl;

  constructor(
    private storage: Storage,
    public perfilService: PerfilService,
    public loadingCtrl: LoadingController,
    public modalController: ModalController,
    
    private navCtrlr: NavController, private router: Router
  ) { 

    this.storage.get('perfil').then((val)=>{
      if(val!=null){
        console.log(val)
        this.perfil=val;
        if(this.perfil.url != undefined){
          this.imagenUrl=this.perfil.url
        }else{
          this.imageURL()
        }
      }
    });
    
  }

  ngOnInit() {

  }

  onSelectFile(event) {
    console.log(event);
    if (event.target.files && event.target.files[0]) {
      login.perfil=true;
      var reader = new FileReader();
      reader.readAsDataURL(event.target.files[0]); // read file as data url
      console.log(event.target.files)
      console.log(event.target.files[0])
      console.log(event.target.files[0].name)
      this.formData.append("file", event.target.files[0], event.target.files[0].name);
      reader.onload = (event) => { 
        var ul = ""
        var buf = this.convert(event.target.result, ul)
        this.imagenUrl = buf;
      }
    }
  }
  public delete() {
    login.perfil=false;
    this.imagenUrl = '';
  }
  convert(buff,buff2){
    for (var i=0, strLen=buff.length; i < strLen; i++) {
      buff2= buff2 + buff[i];
    }
    var buff3 = buff2
    return buff3;
  }

  editar(form){
    var formData: any = new FormData();
    formData.append("id", this.perfil.id);
    formData.append("nombre",this.perfil.nombre);    
    formData.append("apellido",this.perfil.apellido);
    formData.append("telefono",this.perfil.telefono);
    formData.append("direccion",this.perfil.direccion);
    formData.append("fechaNac",this.perfil.fechaNac);
    formData.append("url",this.formData.get("file"))
    form = form.value;
    console.log(form);
    if(form.nombre == ''|| form.apellido == ''){
      this.mensajeIncorrecto("Campos Incompletos","Por favor complete los campos Nombre y Apellido");
    }else{
      let regExp = /^[0-9]{10}$/;
      if (form.telefono != "" && !regExp.test(form.telefono)) {
        this.mensajeIncorrecto("Campo incorrecto","Número de teléfono debe contener 10 números");
      }else{
        this.editarPerfil(formData);
      }

    }
  }

  async editarPerfil(form: FormData){
    await this.showLoading2();
    this.perfilService.editPerfil(form)
    .pipe(
      finalize(async () => {
        await this.loading.dismiss();
      })
    )
    .subscribe(
      data => {
        console.log(data);
        if(data.valid == "ok"){
          this.perfil.url = "https://cabutoshop.pythonanywhere.com" + data.imagen
          this.perfil.imagen=data.imagen
          this.storage.set('perfil',this.perfil);
        }else{
          this.mensajeIncorrecto("Error","No se han guardado los datos modificados");
        }
        this.atras()
      },
      err => {
        this.mensajeIncorrecto("Algo Salio mal", "Fallo en la conexión")
      }
    );
  }

  async mensajeIncorrecto(titulo:string,mensaje:string){
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
        this.imagenUrl=result
        this.perfil.url=result
        this.storage.set("perfil", this.perfil)
      })
  }

  atras(){
    let animations:AnimationOptions={
      animated: true,
      animationDirection: "back"
    }
    this.navCtrlr.back(animations)
  }

}
