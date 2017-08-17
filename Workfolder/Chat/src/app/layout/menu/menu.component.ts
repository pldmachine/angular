import { Component, OnInit } from '@angular/core';
import { AuthService } from "app/services/auth.service";

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.css']
})
export class MenuComponent implements OnInit {
  private user: string;
  constructor(public authService: AuthService) {
   }

  ngOnInit() {
  }

}
