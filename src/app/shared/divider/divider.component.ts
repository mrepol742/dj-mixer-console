import { CommonModule } from '@angular/common';
import { Component, Input, HostListener } from '@angular/core';

@Component({
  selector: 'app-divider',
  imports: [CommonModule],
  templateUrl: './divider.component.html',
  styleUrls: ['./divider.component.css'],
})
export class DividerComponent {
  @Input() color: string = 'rgba(255,255,255,0.2)';
  @Input() thickness: string = '2px';
  @Input() fadeLength: string = '20px';
  @Input() orientation: 'horizontal' | 'vertical' = 'horizontal';

  constructor() {
    this.updateOrientation();
  }

  @HostListener('window:resize')
  onResize() {
    this.updateOrientation();
  }

  private updateOrientation() {
    this.orientation = window.innerWidth < 600 ? 'horizontal' : 'vertical';
  }
}
