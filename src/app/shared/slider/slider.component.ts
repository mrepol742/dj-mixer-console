import { CommonModule } from '@angular/common';
import { Component, Input, Output, EventEmitter, ElementRef, AfterViewInit } from '@angular/core';

@Component({
  selector: 'app-slider',
  imports: [CommonModule],
  templateUrl: './slider.component.html',
  styleUrls: ['./slider.component.css'],
})
export class SliderComponent implements AfterViewInit {
  @Input() orientation: 'horizontal' | 'vertical' = 'horizontal';
  @Output() valueChange = new EventEmitter<number>();

  value = 1; // default value (normalized 0 → 1)
  isDragging = false;

  container!: HTMLElement;

  constructor(private el: ElementRef) {}

  ngAfterViewInit() {
    this.container = this.el.nativeElement.querySelector('.slider-container');
  }

  startDrag(event: PointerEvent) {
    this.isDragging = true;
    this.container.setPointerCapture(event.pointerId);
    this.updateValue(event);
  }

  stopDrag(event: PointerEvent) {
    this.isDragging = false;
    this.container.releasePointerCapture(event.pointerId);
  }

  drag(event: PointerEvent) {
    if (!this.isDragging) return;
    this.updateValue(event);
  }

  getHorizontalPosition(): string {
    const thumbSize = 24; // px
    const trackSize = 75; // same as CSS width

    const min = 0;
    const max = trackSize - thumbSize / 2;

    const px = min + this.value * (max - min);
    return `${px}px`;
  }

  getVerticalPosition(): string {
    const thumbSize = 24;
    const trackSize = 90; // height

    const min = 15;
    const max = trackSize - thumbSize / 2;

    const px = min + this.value * (max - min);
    return `${px}px`;
  }

  private updateValue(event: PointerEvent) {
    const rect = this.container.getBoundingClientRect();

    let normalized: number;

    if (this.orientation === 'horizontal') {
      let pos = event.clientX - rect.left;
      normalized = pos / rect.width;
    } else {
      let pos = rect.bottom - event.clientY;
      normalized = pos / rect.height;
    }

    // clamp 0 → 1
    normalized = Math.max(0, Math.min(1, normalized));
    // map to min → max
    const min = 0;
    const max = 2;

    let value = min + normalized * (max - min);

    // snap to step (0.01)
    const step = 0.01;
    value = Math.round(value / step) * step;

    console.log('Slider value:', value);
    this.value = value;
    this.valueChange.emit(value);
  }
}
