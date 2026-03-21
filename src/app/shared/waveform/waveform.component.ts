import { Component, AfterViewInit, Inject, PLATFORM_ID, Input } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import WaveSurfer from 'wavesurfer.js';

@Component({
  selector: 'app-waveform',
  templateUrl: './waveform.component.html',
  styleUrls: ['./waveform.component.css'],
})
export class WaveformComponent implements AfterViewInit {
  @Input() containerId: string = 'waveform';
  wavesurfer: any;

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {}

  ngAfterViewInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.wavesurfer = WaveSurfer.create({
        container: `#${this.containerId}`,
        waveColor: 'rgba(168,85,247,0.6)',
        progressColor: 'rgba(168,85,247,0.3)',
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
