import { Directive, ElementRef, Input, OnInit } from '@angular/core';

@Directive({
  selector: '[appHighlightStatus]',
  standalone: true
})
export class HighlightStatus implements OnInit {
  @Input() appHighlightStatus: 'OPEN' | 'IN_PROGRESS' | 'DONE' = 'OPEN';

  constructor(private el: ElementRef) {}

  ngOnInit(): void {
    const colors: Record<string, string> = {
      'OPEN': '#ff6b6b',        // Red
      'IN_PROGRESS': '#ffd93d',  // Yellow
      'DONE': '#6bcf7f'          // Green
    };

    const color = colors[this.appHighlightStatus] || '#ccc';
    this.el.nativeElement.style.borderLeft = `4px solid ${color}`;
    this.el.nativeElement.style.paddingLeft = '12px';
  }
}
