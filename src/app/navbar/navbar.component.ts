import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent {

  constructor(private router: Router){}

  pages = [
    {path: '/', name: 'Home'},
    {path: '/Kaart', name: 'Kaart'},
    {path: '/Admin', name: 'Admin'},
  ];
}
