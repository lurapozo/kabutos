import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';
import { Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class PerfilService {
  baseUrl :string= "https://cabutoshop.pythonanywhere.com/movil/";

  constructor(
    private http: HttpClient
  ) { }

  getPerfil(correo: string){
    let parametro= new HttpParams().set('correo',correo);
    const httpOptions = {
      headers: new HttpHeaders({
          'Accept': 'application/json, text/plain',
          'Content-Type':  'application/json',
        })
      };
    return this.http.get(this.baseUrl+'cliente/',{params:parametro, headers:httpOptions.headers});

  }

  editPerfil(user):Observable<any>{
    return this.http.post(this.baseUrl+`editarCliente/`,user)
  }
}
