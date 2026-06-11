import { Component, Input, OnInit, OnDestroy, ChangeDetectorRef, NgZone } from '@angular/core';
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
    private keycloakService: KeycloakService,
    private cdr: ChangeDetectorRef,
    private zone: NgZone
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
          this.zone.run(() => {
            this.currentUsername = user.username || user.preferred_username || user.name || '';
            this.cdr.markForCheck();
          });
        }
      });
  }

  loadMessages(): void {
    this.loading = true;
    this.chatService.getMessages(this.todoId)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (messages) => {
          this.zone.run(() => {
            this.messages = messages || [];
            this.loading = false;
            this.cdr.markForCheck();
            setTimeout(() => this.scrollToBottom(), 100);
          });
        },
        error: (error) => {
          console.error('Error loading messages:', error);
          this.zone.run(() => {
            this.loading = false;
            this.cdr.markForCheck();
          });
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
          if (newMsgs.length !== this.messages.length) {
            this.zone.run(() => {
              const wasAtBottom = this.isScrolledToBottom();
              this.messages = newMsgs;
              this.cdr.markForCheck();
              if (wasAtBottom) {
                setTimeout(() => this.scrollToBottom(), 50);
              }
            });
          }
        },
        error: (err) => console.error('Polling error:', err)
      });
  }

  sendMessage(): void {
    if (!this.newMessage.trim()) {
      return;
    }

    const textToSend = this.newMessage;
    this.newMessage = '';

    this.chatService.sendMessage(this.todoId, textToSend)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response: any) => {
          this.zone.run(() => {
            const msg = response && response.sender ? response : response?.message;
            if (msg) {
              this.messages.push(msg);
            }
            this.cdr.markForCheck();
            setTimeout(() => this.scrollToBottom(), 100);
          });
        },
        error: (error) => {
          console.error('Error sending message:', error);
          this.zone.run(() => {
            this.newMessage = textToSend; // restore on failure
            this.cdr.markForCheck();
          });
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
