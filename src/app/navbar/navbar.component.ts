import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { LoginButtonComponent } from "../login-button/login-button.component";
import { LogoutButtonComponent } from '../logout-button/logout-button.component';
import { SignupButtonComponent } from '../signup-button/signup-button.component';
import { AuthService } from '@auth0/auth0-angular';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    LoginButtonComponent,
    LogoutButtonComponent,
    SignupButtonComponent
],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent {

  constructor(private auth: AuthService, private router: Router) {}

  isMobileMenuOpen = false;

  pages = [
    {path: '/', name: 'Home'},
    {path: '/crud', name: 'Detections'},
  ];

  toggleMenu() {
    this.isMobileMenuOpen = !this.isMobileMenuOpen;
  }

  // Methode om te controleren of de gebruiker is ingelogd
  isLoggedIn() {
    return this.auth.isAuthenticated$; // Dit geeft een observable terug
  }
}
