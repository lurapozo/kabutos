import { Component, OnInit, TestabilityRegistry } from '@angular/core';
import { Router } from "@angular/router";
import { ShoppingCartService } from '../servicios/shopping-cart.service';
import { LoadingController, ModalController, NavController } from '@ionic/angular';
import { CorrectoPage } from '../aviso/correcto/correcto.page';
import { IncorrectoPage } from '../aviso/incorrecto/incorrecto.page';
import { Storage } from '@ionic/storage';
import { login } from './../global';
import { AuthService } from '../auth/servicios/auth.service';
import 'rxjs/add/operator/map';
import { PreguntaPage } from '../aviso/pregunta/pregunta.page';
import { NavParamsService } from '../servicios/nav-params.service'
import { finalize } from 'rxjs/operators';
import { AnimationOptions } from '@ionic/angular/providers/nav-controller';
import { exit } from 'process';
declare var window;

@Component({
  selector: 'app-shopping-cart',
  templateUrl: './shopping-cart.page.html',
  styleUrls: ['./shopping-cart.page.scss'],
})
export class ShoppingCartPage implements OnInit {

  cantidadInput: number = 0;
  act: number = 0;
  cart: {};
  products: {};
  oferts: {};
  combos: {};
  cupon: {};
  loader: any;
  user: any;
  modificado = false;
  total: any = 0.00;
  prodLen: number = 0;
  oferLen: number = 0;
  comLen: number = 0;
  cupLen: number = 0;
  private correo: string = "";
  currentTimeHours:any;
  open=false;
  constructor(private modalCtrl: ModalController, private router: Router,
    private shoppingService: ShoppingCartService, private loadingCtrl: LoadingController,
    private storage: Storage,
    private navCtrlr: NavController, private navParamsService: NavParamsService) {
  }

  ngOnInit() {
  }

  ionViewWillEnter() {
    this.modificado=false
    this.getCorreo();
    this.storage.get('name').then((nombre) => {
      if (login.login == false && nombre == null) {
        this.router.navigateByUrl('/login');
      } else {
        this.user = {
          'correo': this.correo,
          'contrasena': 'xxxxx'
        };
        this.datos()
      }
    }, (error) => {
        console.error(error);
        this.mensajeIncorrecto("Algo Salio mal", "Fallo en en el carrito.")
      }); 
  }

  async datos() {
    await this.showLoading2();
    this.carrito();

  }

  async showLoading2() {
    this.loader = await this.loadingCtrl.create({
      message: 'Loading.....'
    });
    await this.loader.present();

  }

  carrito() {
    this.shoppingService.showCart(this.user)
      .pipe(
        finalize(async () => {
          await this.loader.dismiss();
        })
      )
      .subscribe(data => {
        this.cart = data;
        console.log(this.cart)
        if (this.cart.hasOwnProperty(0)) {
          this.storage.set('id_carrito', this.cart[0]['id'])
          this.products = this.cart[0]['productos'];
        this.oferts = this.cart[0]['ofertas'];
        this.combos = this.cart[0]['combos'];
        this.cupon = this.cart[0]['cupon']
        this.comLen = this.getComboLen();
        this.prodLen = this.getProductLen();
        this.oferLen = this.getOfertaLen();
        this.cupLen = this.getCuponLen();
        this.total = this.getTotal();
        var divTotal = document.querySelectorAll("[id='A_pagar']");
        divTotal[0].innerHTML=""+this.total+"";
        console.log(this.total)
        }else{
          this.comLen = 0;
          this.prodLen = 0;
          this.oferLen = 0;
          this.cupLen = 0;
          console.log(this.total)
        }
        
      }, (error) => {
        this.mensajeIncorrecto("Algo Salio mal", "Fallo en en el carrito.")
      });
  }

  atras(){
    let animations:AnimationOptions={
      animated: true,
      animationDirection: "back"
    }
    this.navCtrlr.back(animations)
  }

  ionViewWillLeave() {
    console.log(this.modificado)
    if (this.modificado) {
      var cantidades = document.querySelectorAll('.cantidad');
      let datos = {
        "carrito": this.cart[0]['id'],
        "productos": []
      };
      for (var i = 0; i < cantidades.length; i++) {
        var id = cantidades[i].getAttribute("id");
        datos["productos"].push({ 'id': id, 'cantidad': cantidades[i].innerHTML });
      }
      this.saveData(datos);
    }
  }

  async mensajeCorrecto(titulo: string, mensaje: string) {
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

  async mensajeIncorrecto(titulo: string, mensaje: string) {
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

  getCorreo() {
    console.log(login.login)
    this.storage.get('correo').then((val) => {
      this.correo = val;
      console.log('name: ', this.correo);

    });

  }

  getTotal() {
    var ptotal: any = 0;
    var ototal: any = 0;
    var ctotal: any = 0;
    var ttotal: any = 0;
    var cptotal: any = 0;

    for (let i = 0; i < this.getProductLen(); i++) {
      ptotal = ptotal + parseFloat((this.products[i]['subtotal']));
    }
    for (let i = 0; i < this.getOfertaLen(); i++) {
      ototal = ototal + parseFloat((this.oferts[i]['subtotal_oferta']));
    }
    for (let i = 0; i < this.getComboLen(); i++) {
      ctotal = ctotal + parseFloat((this.combos[i]['precio']));
    }
    for (let i = 0; i < this.getCuponLen(); i++) {
      ototal = ototal + parseFloat((this.cupon[i]['subtotal_cupon']));
    }
    ttotal = ototal + ctotal + ptotal;
    return Number.parseFloat(ttotal).toFixed(2);

  }

  getProductLen() {
    var pindex = 0;
    for (let p in this.products) {
      pindex = +p + 1;
    }
    return pindex;
  }

  getComboLen() {
    var cindex = 0;
    for (let c in this.combos) {
      cindex = +c + 1;
    }
    return cindex;
  }

  getOfertaLen() {
    var oindex = 0;
    for (let o in this.oferts) {
      oindex = +o + 1;
    }
    return oindex;
  }

  getCuponLen() {
    var oindex = 0;
    for (let o in this.cupon) {
      oindex = +o + 1;
    }
    return oindex;
  }

  getPrecioUnitario(id: string) {
    console.log("estoy en getprcio unitario");
    for (let i = 0; i < this.getProductLen(); i++) {
      if (id === this.products[i]['id_unico']) {
        return this.products[i]['precio_producto'];
      }
    }
    for (let i = 0; i < this.getOfertaLen(); i++) {
      if (id === this.oferts[i]['id_unico']) {
        return this.oferts[i]['precio_oferta'];
      }
    }
    for (let i = 0; i < this.getComboLen(); i++) {
      if (id === this.combos[i]['id_unico']) {
        return this.combos[i]['precio'];
      }
    }
    for (let i = 0; i < this.getCuponLen(); i++) {
      if (id === this.cupon[i]['id_unico']) {
        return this.cupon[i]['precio_cupon'];
      }
    }
  }

  agregar(id: string, max) {
    //console.log("el id a recibir", id);
    this.modificado = true;
    var precio_unitario = this.getPrecioUnitario(id);
    var cantidad = document.querySelectorAll("[id='" + id + "']");
    
    if ((parseInt(cantidad[0].innerHTML) + 1) <= max) {
      if (parseInt(cantidad[0].innerHTML) >= 0) {
        cantidad[0].innerHTML = String(parseInt(cantidad[0].innerHTML) + 1);
      }
      else {
        cantidad[0].innerHTML = String(parseInt(cantidad[0].innerHTML) + 1);
      }
      var subtotal = precio_unitario * parseInt(cantidad[0].innerHTML);
      if (precio_unitario <= subtotal) {
        cantidad[1].innerHTML = String((parseFloat(cantidad[1].innerHTML) + precio_unitario).toFixed(2));
        this.total = this.getTotalCart();
        var divTotal = document.querySelectorAll("[id='A_pagar']");
        divTotal[0].innerHTML=""+this.total+"";
      }
    }else{
      this.mensajeIncorrecto("Agregar Producto", "Ha excedido el stock del producto");
    }
    


  }

  quitar(id: string) {
    this.modificado = true;
    var precio_unitario = this.getPrecioUnitario(id);
    var cantidad = document.querySelectorAll("[id='" + id + "']");

    if ((parseInt(cantidad[0].innerHTML) - 1) <= 0) {
      cantidad[0].innerHTML = "0";
      cantidad[1].innerHTML = "0.00";
      this.total = this.getTotalCart();
      var divTotal = document.querySelectorAll("[id='A_pagar']");
      divTotal[0].innerHTML=""+this.total+"";
    }
    else {
      cantidad[0].innerHTML = String(parseInt(cantidad[0].innerHTML) - 1);
      var subtotal = precio_unitario * parseInt(cantidad[0].innerHTML);
      if (precio_unitario <= subtotal) {
        cantidad[1].innerHTML = String(String((parseFloat(cantidad[1].innerHTML) - precio_unitario).toFixed(2)));
        this.total = this.getTotalCart();
        var divTotal = document.querySelectorAll("[id='A_pagar']");
        divTotal[0].innerHTML=""+this.total+"";
      }
    }
  }


  getTotalCart() {
    var subtotal = document.getElementsByClassName('subtotal');
    var tot: any = 0.00;
    for (var i = 0; i < subtotal.length; i++) {
      tot = tot + parseFloat(subtotal[i].innerHTML);
    }
    if (this.getCantidad() == 0) {
      this.total = 0.00;
      return 0.00;
    } else {
      return tot.toFixed(2);
    }
  }

  getCantidad() {
    var cantidades = document.getElementsByClassName('cantidad');
    var suma = 0;
    for (var i = 0; i < cantidades.length; i++) {
      suma = suma + parseInt(cantidades[i].innerHTML);
    }
    if (suma == 0) {
      return 0;
    }
    return suma;
  }

  eliminar(id: string, c: string, cantidad: string) {
    var tot = this.getTotalCart();
    var pos = 0;
    var subtot = 0;
    var div = document.getElementById(id);
    var total2 = document.getElementsByClassName('A_pagar');
    var subtotal = document.getElementsByClassName('subtotal');

    for (var i = 0; i < subtotal.length; i++) {
      var name = subtotal[i].getAttribute('id')
      if (String(name) == c) {
        tot = tot - parseFloat(subtotal[i].innerHTML);
        subtot = subtot + parseFloat(subtotal[i].innerHTML);
        pos = i;
      }
    }
    const prodxcant = {
      'nombre': this.getNombre(c),
      'cantidad': parseInt(cantidad),
      'correo': this.correo
    }
    this.mensajeEliminar(this.getNombre(c), cantidad, div, total2[0], String(tot), subtotal, String(pos));
  }

  async mensajeEliminar(nombre: string, cantidad: string, div: object, valor: object, tot: string, subtotal: object, compara: string) {
    const modal = await this.modalCtrl.create({
      component: PreguntaPage,
      cssClass: 'pregunta',
      componentProps: {
        'nombre': nombre,
        'cantidad': parseInt(cantidad),
        'correo': this.correo,
        'div': div,
        'valor': valor,
        'tot': tot,
        'subtotal': subtotal,
        'compara': compara,
      }
    });
    return await modal.present();
  }

  getNombre(id: string) {
    for (let i = 0; i < this.getProductLen(); i++) {
      if (id === this.products[i]['id_unico']) {
        return this.products[i]['nombre_producto'];
      }
    }
    for (let i = 0; i < this.getOfertaLen(); i++) {
      if (id === this.oferts[i]['id_unico']) {
        return this.oferts[i]['nombre_oferta'];
      }
    }
    for (let i = 0; i < this.getComboLen(); i++) {
      if (id === this.combos[i]['id_unico']) {
        return this.combos[i]['nombre'];
      }
    }
    for (let i = 0; i < this.getCuponLen(); i++) {
      if (id === this.cupon[i]['id_unico']) {
        return this.cupon[i]['nombre_cupon'];
      }
    }

  }

  getId(id: string) {
    console.log("estoy en getprcio unitario");
    for (let i = 0; i < this.getProductLen(); i++) {
      if (id === this.products[i]['id_unico']) {
        return this.products[i]['id_unico'];
      }
    }
    for (let i = 0; i < this.getOfertaLen(); i++) {
      if (id === this.oferts[i]['id_unico']) {
        return this.oferts[i]['id_unico'];
      }
    }
    for (let i = 0; i < this.getComboLen(); i++) {
      if (id === this.combos[i]['id_unico']) {
        return this.combos[i]['id_unico'];
      }
    }
  }

  async horario(){
    
    await this.showLoading2();
    var currentDate = new Date();
    this.shoppingService.getHorario(1,currentDate.getDay())
    .pipe(
      finalize(async () => {
        await this.loader.dismiss();
      })
    )
    .subscribe(data => {
      this.currentTimeHours = currentDate.getHours();
      this.currentTimeHours = this.currentTimeHours < 10 ? "0" + this.currentTimeHours : this.currentTimeHours;
      var currentTimeMinutes = currentDate.getMinutes();
      var timeNow = this.currentTimeHours + "" + currentTimeMinutes;
      data['horario'].forEach(horario => {
        var openSplit=horario.hora_inicio.split(":")
        var openTimex = openSplit[0] + openSplit[1];
        var closeTimeSplit = horario.hora_fin.split(":");
        var closeTimex = closeTimeSplit[0] + closeTimeSplit[1];
        //console.log(timeNow);
        //console.log(openTimex)
        //console.log(closeTimex)

        if (this.open || timeNow >= openTimex && timeNow <= closeTimex) {
          this.open=true;
        } else {
          this.open=false;
        }
      });
      //console.log(this.open);
      if (this.oferLen + this.prodLen + this.comLen > 0) {        
        //console.log(this.open);
        if(this.open){
          this.storage.set('total', this.total);
          this.router.navigate(['/footer/pagar']);
        }else{
          this.mensajeIncorrecto("Establecimiento cerrado", "Estaremos receptando sus pedidos el día de mañana");
        }
      } else {
        this.mensajeIncorrecto("Carrito vacío", "No tiene nada en su carrito");
        this.router.navigate(['']);

      }      
    }, (error) => {
      console.error(error);
    });
    return this.open;
  }

  pagar() {
    this.horario();
  }  

  saveData(estado: any) {
    console.log("Estoy en el saveData");
    console.log(estado);
    this.shoppingService.updateCart(estado).subscribe(data => {

    }, (error) => {

    });
  }

  goProductPage() {
    var cantidades = document.getElementsByClassName('cantidad');
    var datos = [];
    for (var i = 0; i < cantidades.length; i++) {
      var id = cantidades[i].getAttribute("id");
      //this.saveData(id,cantidades[i].innerHTML);
      datos.push({ "id": id, "cantidad": cantidades[i].innerHTML });
    }
    this.navParamsService.setNavData(datos);
    this.router.navigateByUrl('/producto', { replaceUrl: true });

  }

  goOfertPage() {
    var cantidades = document.getElementsByClassName('cantidad');
    var datos = [];
    for (var i = 0; i < cantidades.length; i++) {
      var id = cantidades[i].getAttribute("id");
      //this.saveData(id,cantidades[i].innerHTML);
      datos.push({ "id": id, "cantidad": cantidades[i].innerHTML });


    }
    this.navParamsService.setNavData(datos);
    this.router.navigateByUrl('/ofertas', { replaceUrl: true });

  }




}

