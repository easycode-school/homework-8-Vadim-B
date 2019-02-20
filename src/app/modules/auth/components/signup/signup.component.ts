import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { MyErrorStateMatcher } from './../../../../helpers/errorStateMatcher';
import { AuthService } from '../../services/auth.service';
import { MessageService } from 'primeng/api';
import { User } from '../../interfaces/user';
import { OnSignUpAnswer } from '../../interfaces/OnSignUpAnswer';
import { Router } from '@angular/router';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit {
  public signUpForm: FormGroup;
  public matcher = new MyErrorStateMatcher();

  // init Gender options
  private genders = [
    {value: 'male', viewValue: 'Male'},
    {value: 'female', viewValue: 'Female'}
  ];

  // init Date setting
  private minDate = new Date(1900, 0, 1);
  private maxDate = new Date();

  constructor(
    private authService: AuthService,
    private messageService: MessageService,
    private router: Router
  ) { }

  /**
   * при загрузке компоненты инициализируем реактивную форму на странице
   */
  ngOnInit() {
    // Init form
    this.signUpForm = new FormGroup({
      'email': new FormControl('', [Validators.email, Validators.required]),
      'password': new FormControl('', [Validators.required, Validators.minLength(8)]),
      'nickname': new FormControl('', [Validators.required]),
      'first_name': new FormControl('', [Validators.required]),
      'last_name': new FormControl('', [Validators.required]),
      'phone': new FormControl('', [Validators.required]),
      'gender_orientation': new FormControl('', [Validators.required]),
      'city': new FormControl('', [Validators.required]),
      'country': new FormControl('', [Validators.required]),
      'date_of_birth': new FormControl('', [Validators.required])
    });
  }

  /**
   * onSignUp
   * 1. проверяет прошла ли форма валидацию, если да, то:
   * 2. формирует объект с данными для регистрации,
   * 3. вызывает метод из сервиса для отправки данных на api
   * 4. выводит сообщение о результате (ошибке или успехе)
   * 5. перенаправляем пользователя на страницу логина
   */
  onSignUp() {
    if (this.signUpForm.status === 'VALID') {
      const userInfo: User = {
        email: this.signUpForm.get('email').value,
        password: this.signUpForm.get('password').value,
        nickname: this.signUpForm.get('nickname').value,
        first_name: this.signUpForm.get('first_name').value,
        last_name: this.signUpForm.get('last_name').value,
        phone: this.signUpForm.get('phone').value,
        gender_orientation: this.signUpForm.get('gender_orientation').value,
        city: this.signUpForm.get('city').value,
        country: this.signUpForm.get('country').value,
        date_of_birth_day: this.signUpForm.get('date_of_birth').value.getDate(),
        date_of_birth_month: this.signUpForm.get('date_of_birth').value.getMonth(),
        date_of_birth_year: this.signUpForm.get('date_of_birth').value.getFullYear()
      };

      this.authService.signUp(userInfo).subscribe((data: OnSignUpAnswer) => {
        this.messageService.add({
          severity: data.error ? 'error' : 'success',
          summary: data.error ? 'Server error' : 'Service Message',
          detail: data.message
        });
        // redirect to /login
        this.router.navigate(['/auth/login']);
      });
    }
  }
}
