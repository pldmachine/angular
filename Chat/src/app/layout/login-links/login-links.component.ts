import { Component, OnInit } from '@angular/core';
import { AuthService } from "app/services/auth.service";

@Component({
  selector: 'app-login-links',
  templateUrl: './login-links.component.html',
  styleUrls: ['./login-links.component.css']
})
export class LoginLinksComponent implements OnInit {

  constructor(public authService: AuthService) { }

  ngOnInit() {
  }
  
  logout(): boolean {
    this.authService.logout();
    return false;
  }


}
