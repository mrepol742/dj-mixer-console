import { Injectable } from '@angular/core';
import { addListener, launch } from 'devtools-detector';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class DevtoolsDetector {
  init() {
    if (environment.NODE_ENV !== 'production') return;

    addListener((isOpen) => {
      if (isOpen) window.location.reload();
    });

    launch();
  }
}
