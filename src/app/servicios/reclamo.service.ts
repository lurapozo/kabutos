import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ReclamoService {

  /// baseUrl :string= "https://cabutoshop.pythonanywhere.com/movil/";
  baseUrl :string= "http://127.0.0.1:8000/movil/";

  constructor(
    private http: HttpClient
  ) { }

  envioReclamo(reclamo):Observable<any>{
    return this.http.post(this.baseUrl+`reclamo/`,reclamo)
  }
}
