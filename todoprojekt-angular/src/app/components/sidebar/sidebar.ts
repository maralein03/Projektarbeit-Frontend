import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { KeycloakService } from '../../services/keycloak';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './sidebar.html',
  styleUrl: './sidebar.css'
})
export class Sidebar implements OnInit, OnDestroy {
  isOpen = false;
  private destroy$ = new Subject<void>();

  constructor(private keycloakService: KeycloakService) {}

  ngOnInit(): void {}

  toggleSidebar(): void {
    this.isOpen = !this.isOpen;
  }

  hasRole(role: string): boolean {
    return this.keycloakService.hasRole(role);
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
