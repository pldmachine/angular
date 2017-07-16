import { Component, OnInit } from '@angular/core';
import { AuthService } from "app/services/auth.service";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  message: string;
  constructor(public authService: AuthService) {
    this.message = '';

  }

  login(username: string, password: string): boolean {
    this.message = '';
    if (!this.authService.login(username, password)) {
      this.message = 'Incorect password';
      setTimeout(function () {
        this.message = '';
      }.bind(this), 2000
      );
    }

    return false;
  }

  logout():boolean
  {
    this.authService.logout();
    return false;
  }

  ngOnInit() {
  }

}
