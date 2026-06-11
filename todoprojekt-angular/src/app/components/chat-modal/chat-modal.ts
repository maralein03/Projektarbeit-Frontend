import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Chat } from '../chat/chat';

@Component({
  selector: 'app-chat-modal',
  standalone: true,
  imports: [CommonModule, Chat],
  templateUrl: './chat-modal.html',
  styleUrl: './chat-modal.css'
})
export class ChatModal {
  @Input() isOpen = false;
  @Input() todoId: number | null = null;
  @Input() todoTitle: string = '';
  @Output() closed = new EventEmitter<void>();

  onClose(): void {
    this.closed.emit();
  }

  onBackdropClick(event: MouseEvent): void {
    if (event.target === event.currentTarget) {
      this.onClose();
    }
  }
}
