import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from './../../../../environments/environment';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { OnLoginAnswer } from './../interfaces/OnLoginAnswer';
import { User } from './../interfaces/user';
import { OnSignUpAnswer } from './../interfaces/OnSignUpAnswer';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl: string = environment.apiUrl;
  constructor(
    private http: HttpClient
  ) { }

  login(email: string, password: string): Observable<OnLoginAnswer> {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-type': 'application/json'
      })
    };

    return this.http.post<OnLoginAnswer>(`${this.apiUrl}/public/auth/signup`, { email, password }, httpOptions).pipe(
      map((res: OnLoginAnswer): OnLoginAnswer => {
        if (!res.error) {
          localStorage.setItem('mlp_client_id', res.id);
          localStorage.setItem('mlp_client_token', res.token);
        }

        return res;
      })
    );
  }

  /**
   * signUp
   * 1. отправляет регистрационные данные на api
   * 2. возвращает информацию об удаче или ошибке
   * 3. эмитит событие в SignupComponent с информацие об ошибке/успехе
   * @param userInfo - объект с информацией о новом юзере
   */
  public signUp(userInfo: User): Observable<OnSignUpAnswer> {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-type': 'application/json'
      })
    };

    return this.http.post<OnSignUpAnswer>(`${this.apiUrl}/public/auth/signup`, userInfo, httpOptions);
  }
}
