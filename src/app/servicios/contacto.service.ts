import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ContactoService {
  /// baseUrl :string= "https://cabutoshop.pythonanywhere.com/movil/";
  baseUrl :string= "http://127.0.0.1:8000/movil/";

  constructor(
    private http: HttpClient
  ) { }

  getContacto(){
    const headers = {
      'Accept': 'application/json, text/plain',
      'Content-Type': 'application/json'
    }
    return this.http.get(this.baseUrl+'contacto/',{headers:headers})
  }
}
