import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { IPedidos } from '../Interfaces/IPedidos'; // Ajuste o caminho conforme necessário

@Injectable({
  providedIn: 'root'
})
export class PedidosService {

  private apiUrl = 'https://localhost:5501/api'; // Replace with your backend URL

  constructor(private http: HttpClient) { }

  createPedido(pedido: IPedidos): Observable<IPedidos> {
    return this.http.post<IPedidos>(`${this.apiUrl}/pedidos`, pedido).pipe(
      catchError(this.handleError)
    );
  }

  generatePdf(pedido: IPedidos): Observable<Blob> {
    return this.http.post(`${this.apiUrl}/pedidos/generate-pdf`, pedido, { responseType: 'blob' }).pipe(
      catchError(this.handleError)
    );
  }

  sendEmailWithPdf(formData: FormData): Observable<any> {
    return this.http.post(`${this.apiUrl}/pedidos/send-email`, formData).pipe(
      catchError(this.handleError)
    );
  }

  private handleError(error: HttpErrorResponse): Observable<never> {
    let errorMessage = '';
    if (error.error instanceof ErrorEvent) {
      // A client-side or network error occurred.
      errorMessage = `An error occurred: ${error.error.message}`;
    } else {
      // The backend returned an unsuccessful response code.
      errorMessage = `Server returned code: ${error.status}, error message is: ${error.message}`;
    }
    console.error(errorMessage);
    return throwError(errorMessage);
  }
}
