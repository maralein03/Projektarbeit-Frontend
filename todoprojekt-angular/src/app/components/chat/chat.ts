import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ChatService } from '../../services/chat';
import { KeycloakService } from '../../services/keycloak';
import { ChatMessage } from '../../models';
import { Subject, interval } from 'rxjs';
import { takeUntil, switchMap } from 'rxjs/operators';

@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './chat.html',
  styleUrl: './chat.css'
})
export class Chat implements OnInit, OnDestroy {
  @Input() todoId!: number;
  @Input() todoTitle: string = '';
  
  messages: ChatMessage[] = [];
  newMessage: string = '';
  loading = true;
  currentUsername: string = '';
  private destroy$ = new Subject<void>();

  constructor(
    private chatService: ChatService,
    private keycloakService: KeycloakService
  ) {}

  ngOnInit(): void {
    this.loadCurrentUser();
    this.loadMessages();
    this.startPolling();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  loadCurrentUser(): void {
    this.keycloakService.getUser()
      .pipe(takeUntil(this.destroy$))
      .subscribe(user => {
        if (user) {
          this.currentUsername = user.username || user.preferred_username || user.name || '';
        }
      });
  }

  loadMessages(): void {
    this.loading = true;
    this.chatService.getMessages(this.todoId)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (messages) => {
          this.messages = messages || [];
          this.loading = false;
          // Auto-scroll to bottom
          setTimeout(() => this.scrollToBottom(), 100);
        },
        error: (error) => {
          console.error('Error loading messages:', error);
          this.loading = false;
        }
      });
  }

  // Poll for new messages every 3 seconds
  private startPolling(): void {
    interval(3000)
      .pipe(
        takeUntil(this.destroy$),
        switchMap(() => this.chatService.getMessages(this.todoId))
      )
      .subscribe({
        next: (messages) => {
          const newMsgs = messages || [];
          // Only update if count changed (avoid unnecessary re-render/scroll)
          if (newMsgs.length !== this.messages.length) {
            const wasAtBottom = this.isScrolledToBottom();
            this.messages = newMsgs;
            if (wasAtBottom) {
              setTimeout(() => this.scrollToBottom(), 50);
            }
          }
        },
        error: (err) => console.error('Polling error:', err)
      });
  }

  sendMessage(): void {
    if (!this.newMessage.trim()) {
      return;
    }

    this.chatService.sendMessage(this.todoId, this.newMessage)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response: any) => {
          // Backend returns ChatMessage directly
          const msg = response.message && response.sender ? response : response.message;
          if (msg) {
            this.messages.push(msg);
          }
          this.newMessage = '';
          setTimeout(() => this.scrollToBottom(), 100);
        },
        error: (error) => {
          console.error('Error sending message:', error);
          alert('Failed to send message');
        }
      });
  }

  private scrollToBottom(): void {
    const container = document.querySelector('.messages-container');
    if (container) {
      container.scrollTop = container.scrollHeight;
    }
  }

  private isScrolledToBottom(): boolean {
    const container = document.querySelector('.messages-container');
    if (!container) return true;
    return container.scrollTop + container.clientHeight >= container.scrollHeight - 50;
  }
}
