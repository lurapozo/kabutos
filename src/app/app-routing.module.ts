import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';


const routes: Routes = [
  {
    path: 'home',
    loadChildren: () => import('./home/home.module').then( m => m.HomePageModule)
  },
  {
    path: 'registro',
    loadChildren: () => import('./auth/registro/registro/registro.module').then( m => m.RegistroPageModule)
  },
  {
    path: 'login',
    loadChildren: () => import('./auth/login/login/login.module').then( m => m.LoginPageModule)
  },
  {
    path: 'registro-fb',
    loadChildren: () => import('./auth/registro-fb/registro-fb.module').then( m => m.RegistroFbPageModule)
  },
  {
    path: 'modal',
    loadChildren: () => import('./modal/modal.module').then( m => m.ModalPageModule)
  },
  {
    path: 'registro-exitoso',
    loadChildren: () => import('./auth/registro/registro-exitoso/registro-exitoso.module').then( m => m.RegistroExitosoPageModule)
  },
  {
    path: 'detalles-productos',
    loadChildren: () => import('./detalles-productos/detalles-productos.module').then( m => m.DetallesProductosPageModule)
  },
  {
    path: 'incorrecto',
    loadChildren: () => import('./aviso/incorrecto/incorrecto.module').then( m => m.IncorrectoPageModule)
  },
  {
    path: 'correcto',
    loadChildren: () => import('./aviso/correcto/correcto.module').then( m => m.CorrectoPageModule)
  },
  {
    path: '',
    loadChildren: () => import('./footer/footer.module').then( m => m.FooterPageModule)
  },
  {
    path: 'direccion',
    loadChildren: () => import('./direccion/direccion.module').then( m => m.DireccionPageModule)
  },
  {
    path: 'domicilio',
    loadChildren: () => import('./domicilio/domicilio.module').then( m => m.DomicilioPageModule)
  },
  {
    path: 'pregunta',
    loadChildren: () => import('./aviso/pregunta/pregunta.module').then( m => m.PreguntaPageModule)
  },
  {
    path: 'calificar',
    loadChildren: () => import('./calificar/calificar.module').then( m => m.CalificarPageModule)
  },
  {
    path: 'tarjetas-de-regalo',
    loadChildren: () => import('./tarjetas-de-regalo/tarjetas-de-regalo.module').then( m => m.TarjetasDeRegaloPageModule)
  },
  {
    path: 'premios',
    loadChildren: () => import('./premios/premios.module').then( m => m.PremiosPageModule)
  },
  {
    path: 'hacer-regalo',
    loadChildren: () => import('./hacer-regalo/hacer-regalo.module').then( m => m.HacerRegaloPageModule)
  },
  {
    path: 'hacer-regalo-monto',
    loadChildren: () => import('./hacer-regalo-monto/hacer-regalo-monto.module').then( m => m.HacerRegaloMontoPageModule)
  },
  {
    path: 'hacer-regalo-escoger',
    loadChildren: () => import('./hacer-regalo-escoger/hacer-regalo-escoger.module').then( m => m.HacerRegaloEscogerPageModule)
  },
  {
    path: 'hacer-regalo-producto',
    loadChildren: () => import('./hacer-regalo-producto/hacer-regalo-producto.module').then( m => m.HacerRegaloProductoPageModule)
  },
  {
    path: 'cupones-carrito',
    loadChildren: () => import('./cupones-carrito/cupones-carrito.module').then( m => m.CuponesCarritoPageModule)
  },  {
    path: 'premios',
    loadChildren: () => import('./premios/premios.module').then( m => m.PremiosPageModule)
  },


  
  
];



@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
