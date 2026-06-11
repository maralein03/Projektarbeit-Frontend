import {
  Directive,
  Input,
  OnDestroy,
  OnInit,
  TemplateRef,
  ViewContainerRef
} from '@angular/core';
import { KeycloakService } from '../services/keycloak';

/**
 * Structural directive that shows/hides a template depending on whether
 * the current user owns the given Keycloak role.
 *
 * Usage:
 *   <button *appHasRole="'ROLE_UPDATE'">Delete</button>
 *   <button *appHasRole="['ROLE_UPDATE', 'ROLE_ADMIN']">Manage</button>
 */
@Directive({
  selector: '[appHasRole]',
  standalone: true
})
export class HasRoleDirective implements OnInit, OnDestroy {
  private requiredRoles: string[] = [];
  private hasView = false;

  @Input() set appHasRole(role: string | string[]) {
    this.requiredRoles = Array.isArray(role) ? role : [role];
    this.updateView();
  }

  constructor(
    private templateRef: TemplateRef<unknown>,
    private viewContainer: ViewContainerRef,
    private keycloakService: KeycloakService
  ) {}

  ngOnInit(): void {
    this.updateView();
  }

  ngOnDestroy(): void {
    this.viewContainer.clear();
  }

  private updateView(): void {
    const allowed = this.requiredRoles.some(role =>
      this.keycloakService.hasRole(role)
    );

    if (allowed && !this.hasView) {
      this.viewContainer.createEmbeddedView(this.templateRef);
      this.hasView = true;
    } else if (!allowed && this.hasView) {
      this.viewContainer.clear();
      this.hasView = false;
    }
  }
}
