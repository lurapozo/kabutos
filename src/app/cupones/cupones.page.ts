import { Component, OnInit } from '@angular/core';
import {login} from  './../global'
import 'rxjs/add/operator/map';
import { Router } from '@angular/router';
import { AlertController, LoadingController,ModalController} from '@ionic/angular';
import { Storage } from '@ionic/storage';
import {ShoppingCartService} from '../servicios/shopping-cart.service';
import {CorrectoPage} from '../aviso/correcto/correcto.page';
import {IncorrectoPage} from '../aviso/incorrecto/incorrecto.page';
import {CuponesService} from '../servicios/cupones.service';
declare var window;

@Component({
  selector: 'app-cupones',
  templateUrl: './cupones.page.html',
  styleUrls: ['./cupones.page.scss'],
})
export class CuponesPage implements OnInit {

  cupon : {};
  url= '' ;
  valor = 0;
  private correo:String="";
  constructor(public cuponesService: CuponesService, private  router:  Router,private alert: AlertController,
    public loadingCtrl: LoadingController,
    private storage: Storage,
    public modalCtrl: ModalController,
    private shoppingCart: ShoppingCartService) { }

  ngOnInit() {
  }
  
  ionViewWillEnter(){
    this.cargaPantalla()

  }

  pantalla(event){
    console.log("refresh");
     this.cuponesService.getCupon().subscribe(data => {
       //console.log("esta es la data "+data["nombre"])
       this.cupon=data;
       var tol =Object.entries(this.cupon).length
       console.log(this.cupon);
       console.log(tol)
       if(tol==0){
        this.mensajeIncorrecto("No existen cupones disponibles","Agregaramos nuevos más adelante");
       }
       if (event)
          event.target.complete();
       },(error)=>{
         console.log("algo salio mal")
         this.mensajeIncorrecto("Algo salió mal","error de conexión");
         console.error(error);
         if (event)
          event.target.complete();
       }) 
  }
  
  cargaPantalla() {  
    this.loadingCtrl.create({  
      message: 'Loading.....'   
    }).then((loading) => {  
      loading.present();{
        this.pantalla(null);
    } 
    setTimeout(() => {   
      loading.dismiss();  
    }, 1000 );   
    });  
    } 

  async mensajeCorrecto(titulo:string,mensaje:string){
    const modal = await this.modalCtrl.create({
      component: CorrectoPage,
      cssClass: 'CorrectoProducto',
      componentProps: {
        'titulo': titulo,
        'mensaje': mensaje
      }
    });
    return await modal.present();
  }


  async mensajeIncorrecto(titulo:string,mensaje:string){
    const modal = await this.modalCtrl.create({
      component: IncorrectoPage,
      cssClass: 'IncorrectoProducto',
      componentProps: {
        'titulo': titulo,
        'mensaje': mensaje
      }
    });
    return await modal.present();
  }


  getProductLen(){
    var pindex=0;
    for(let p in this.cupon){
      pindex=+p+1;
    }
    return pindex;
  }


  getNombre(id:string){
    for (let i=0; i< this.getProductLen(); i++){
      if(id===this.cupon[i]['id']){
        return this.cupon[i]['nombre'];
      }
    }

  }

  agregar(id:string,id2:string){
    this.getCorreo();
    var doc=document.getElementById(id)
    var doc2=document.getElementById("Cupon"+id2)
    doc2.style.visibility = "hidden";
    this.storage.get('name').then((nombre) => {
      console.log('Name is', nombre);
      if(login.login ==false && nombre == null ){
        login.producto = true;
        this.router.navigateByUrl('/login');  
      }else{
        var cantidad = "1";
        console.log("La cantidad que se agrega al carrito es: ", cantidad);
        if(parseInt(cantidad) > 0){
          const cupxcant={
            'nombre': id,
            'cantidad': parseInt(cantidad),
            'correo': this.correo
          }
          this.shoppingCart.addCupon(cupxcant).subscribe(data =>{
            if(data.valid == "OK"){
              this.mensajeCorrecto("Cupón Agregado","Cupón Agregado Exitosamente");
            }else if (data.valid == "IN"){
              this.mensajeIncorrecto("Agregar Cupón","Cupón ya existe en carrito");
            }else if (data.valid == "NOT"){
              this.mensajeIncorrecto("Agregar Cupón","Ha ocurrido un error, revise su conexión");

            }
          })
          window.footer.datos();
        }else{
          this.mensajeIncorrecto("Agregar Cupón","No ha escogido la cantidad para agregar");
        }
      }
      });


  }

  getCorreo(){
    console.log(login.login)  
		this.storage.get('correo').then((val) => {
      this.correo=val;
      console.log('name: ',this.correo);
      
  });
}

  mostrar(id:string){
    console.log("esto en mostrar y el id que tengo es",id)
    var doc=document.getElementById("Cupon"+id)
    console.log(doc)
    console.log(doc.style.visibility)
    if(doc.style.visibility === "visible"){
      doc.style.visibility = "hidden";
    }else{
      doc.style.visibility = "visible";
    }
  }
}
