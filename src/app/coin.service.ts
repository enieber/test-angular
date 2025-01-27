import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { Coin } from './coin/coin.interface';

@Injectable({
  providedIn: 'root'
})
export class CoinService {
  private apiUrl = 'http://localhost:3000/coins';

  constructor(private http: HttpClient) { }

  getCoins(): Observable<Coin[]> {
    return this.http.get<Coin[]>(this.apiUrl);
  }

  addCoin(coin: Coin): Observable<Coin> {
    return this.http.post<Coin>(this.apiUrl, coin);
  }

  updateCoin(id: string, coin: Coin): Observable<Coin> {
    return this.http.put<Coin>(`${this.apiUrl}/${id}`, coin);
  }

  deleteCoin(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}
