import { Component, AfterViewInit, Inject, PLATFORM_ID, Input } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import WaveSurfer from 'wavesurfer.js';

@Component({
  selector: 'app-waveform',
  templateUrl: './waveform.html',
  styleUrls: ['./waveform.css'],
})
export class Waveform implements AfterViewInit {
  @Input() containerId: string = 'waveform';
  wavesurfer: any;

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {}

  ngAfterViewInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.wavesurfer = WaveSurfer.create({
        container: `#${this.containerId}`,
        waveColor: '#4ade80',
        progressColor: '#22c55e',
        height: 50,
      });

      this.wavesurfer.setVolume(0);
    }
  }

  loadTrack(file: File) {
    if (!isPlatformBrowser(this.platformId) || !this.wavesurfer) return;

    const url = URL.createObjectURL(file);
    this.wavesurfer.load(url);
  }

  play() {
    if (!isPlatformBrowser(this.platformId) || !this.wavesurfer) return;
    this.wavesurfer.play();
  }

  stop() {
    if (!isPlatformBrowser(this.platformId) || !this.wavesurfer) return;
    this.wavesurfer.stop();
  }
}
