import { Component, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import * as AOS from 'aos';

@Component({
  selector: 'app-landing',
  imports: [MatIconModule],
  templateUrl: './landing-page.component.html',
  styleUrl: './landing-page.component.css',
})
export class Landing {
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
