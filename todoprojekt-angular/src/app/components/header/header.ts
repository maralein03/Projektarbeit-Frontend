import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { KeycloakService } from '../../services/keycloak';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './header.html',
  styleUrl: './header.css'
})
export class Header implements OnInit, OnDestroy {
  username: string = '';
  userRoles: string[] = [];
  private destroy$ = new Subject<void>();

  constructor(private keycloakService: KeycloakService) {}

  ngOnInit(): void {
    this.keycloakService.getUser()
      .pipe(takeUntil(this.destroy$))
      .subscribe(user => {
        if (user) {
          this.username = user.name || user.preferred_username || 'User';
        }
      });
  }

  logout(): void {
    this.keycloakService.logout();
  }

  hasRole(role: string): boolean {
    return this.keycloakService.hasRole(role);
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
