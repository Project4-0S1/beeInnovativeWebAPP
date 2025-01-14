import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '@auth0/auth0-angular';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent {

  constructor(private router: Router, private auth: AuthService) {}

  pages = [
    {path: '/', name: 'Home'},
    {path: '/Kaart', name: 'Kaart'},
  ];

  logout() {
    this.auth.logout({ logoutParams: { returnTo: window.location.origin } });
  }
}
