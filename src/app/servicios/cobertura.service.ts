import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CoberturaService {

  /// baseUrl :string= "https://cabutoshop.pythonanywhere.com/movil/";
  baseUrl :string= "http://127.0.0.1:8000/movil/";

  constructor(
    private http: HttpClient) { }
    
  getCobertura() {
    const headers = {
      'Accept': 'application/json, text/plain',
      'Content-Type': 'application/json'
    }
    return this.http.get(this.baseUrl+'cobertura/',{headers:headers})            
  }
  
}
