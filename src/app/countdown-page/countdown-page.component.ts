import { Component, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import * as AOS from 'aos';

@Component({
  selector: 'app-countdown',
  imports: [MatIconModule],
  templateUrl: './countdown-page.component.html',
  styleUrl: './countdown-page.component.css',
})
export class Countdown {
  constructor(@Inject(PLATFORM_ID) private platformId: Object) {}

  ngOnInit() {
    if (isPlatformBrowser(this.platformId)) {
      AOS.init({
        duration: 1200,
        once: false,
      });
    }
  }
}
