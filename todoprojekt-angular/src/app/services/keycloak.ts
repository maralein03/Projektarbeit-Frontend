import { Injectable } from '@angular/core';
import Keycloak from 'keycloak-js';
import { environment } from '../../environments/environment';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class KeycloakService {
  private keycloak: Keycloak;
  private isLoggedIn$ = new BehaviorSubject<boolean>(false);
  private user$ = new BehaviorSubject<any>(null);
  private userRoles: string[] = [];

  constructor() {
    this.keycloak = new Keycloak({
      url: environment.keycloak.url,
      realm: environment.keycloak.realm,
      clientId: environment.keycloak.clientId
    });
  }

  public async init(): Promise<boolean> {
    try {
      const authenticated = await this.keycloak.init({
        onLoad: 'login-required',
        checkLoginIframe: false,
        redirectUri: window.location.origin + window.location.pathname
      });
      
      if (authenticated) {
        this.isLoggedIn$.next(true);
        this.extractRoles();
        this.loadUserProfile();
      }
      
      return authenticated;
    } catch (error) {
      console.error('Keycloak initialization failed:', error);
      throw error;
    }
  }

  private extractRoles(): void {
    if (this.keycloak.realmAccess?.roles) {
      this.userRoles = this.keycloak.realmAccess.roles;
      console.log('User roles:', this.userRoles);
    }
  }

  private loadUserProfile(): void {
    this.keycloak.loadUserProfile().then((profile: any) => {
      this.user$.next(profile);
    }).catch((error: any) => {
      console.error('Failed to load user profile:', error);
    });
  }

  public getToken(): string {
    return this.keycloak.token || '';
  }

  public isTokenExpired(): boolean {
    return this.keycloak.isTokenExpired();
  }

  public hasRole(role: string): boolean {
    // Handle both with and without ROLE_ prefix
    const roleWithoutPrefix = role.replace('ROLE_', '');
    const roleWithPrefix = `ROLE_${roleWithoutPrefix}`;
    
    return this.userRoles.includes(roleWithoutPrefix) || 
           this.userRoles.includes(roleWithPrefix) ||
           this.userRoles.includes(role) ||
           this.keycloak.hasRealmRole(role);
  }

  public getIsLoggedIn(): Observable<boolean> {
    return this.isLoggedIn$.asObservable();
  }

  public getUser(): Observable<any> {
    return this.user$.asObservable();
  }

  public logout(): void {
    this.keycloak.logout({
      redirectUri: window.location.origin
    });
  }

  public refreshToken(): Promise<boolean> {
    return this.keycloak.updateToken(30);
  }
}
