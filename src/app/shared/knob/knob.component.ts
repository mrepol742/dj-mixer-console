import { Component, HostListener, ElementRef, Output, EventEmitter, Input } from '@angular/core';

@Component({
  selector: 'app-knob',
  templateUrl: './knob.component.html',
  styleUrls: ['./knob.component.css'],
})
export class KnobComponent {
  rotation = 0;
  isDragging = false;

  @Input() label: string = 'KNOB';
  @Output() valueChange = new EventEmitter<number>();

  constructor(private el: ElementRef) {}

  @HostListener('mousedown', ['$event'])
  onMouseDown(event: MouseEvent) {
    this.isDragging = true;
    event.preventDefault();
  }

  @HostListener('document:mouseup', ['$event'])
  onMouseUp(event: MouseEvent) {
    this.isDragging = false;
  }

  @HostListener('document:mousemove', ['$event'])
  onMouseMove(event: MouseEvent) {
    if (!this.isDragging) return;

    this.rotation += -event.movementY;
    this.rotation = Math.max(-135, Math.min(135, this.rotation));

    const normalized = (this.rotation + 135) / 270;
    // map to -12 → +12
    let value = -12 + normalized * (12 - (-12));
    // snap to step (1 dB)
    value = Math.round(value);

    this.valueChange.emit(value);
  }
}
