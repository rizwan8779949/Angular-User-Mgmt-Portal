import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { loginInterface } from '../../models/login.model';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  constructor(private http: HttpClient) {}
  baseUrl = 'http://localhost:3000/';
  commonGetMethod(url: string, queryParams: any): Observable<any> {
    const endPoint = this.baseUrl + url;
    return this.http.get(endPoint, { params: queryParams });
  }
  commonPostMethod(url: string, data: any): Observable<any> {
    const endPoint = this.baseUrl + url;
    return this.http.post(endPoint, data);
  }
  commonPatchMethod(url: string, data: any): Observable<any> {
    const endPoint = this.baseUrl + url;
    return this.http.patch(endPoint, data);
  }
  commanDeleteMethod(url: string): Observable<any> {
    return this.http.delete(this.baseUrl + url);
  }
}
