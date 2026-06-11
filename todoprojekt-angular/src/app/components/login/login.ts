import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { KeycloakService } from '../../services/keycloak';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './login.html',
  styleUrl: './login.css'
})
export class Login implements OnInit {
  isLoading = true;

  constructor(private keycloakService: KeycloakService) {}

  ngOnInit(): void {
    // Keycloak handles login automatically
    // This component is rarely shown as users are redirected to Keycloak login
    this.isLoading = false;
  }
}

