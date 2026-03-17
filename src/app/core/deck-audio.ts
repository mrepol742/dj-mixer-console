export class DeckAudio {
  source: AudioBufferSourceNode | null = null;
  gainNode: GainNode;
  audioBuffer: AudioBuffer | null = null;
  playbackRate: number = 1;

  private startedAt: number = 0;
  private pausedAt: number = 0;
  isPlaying: boolean = false;

  // EQ filters
  lowFilter: BiquadFilterNode;
  midFilter: BiquadFilterNode;
  highFilter: BiquadFilterNode;

  constructor(
    private audioContext: AudioContext,
    masterGain: GainNode,
  ) {
    this.gainNode = this.audioContext.createGain();

    // Low shelf filter (~bass)
    this.lowFilter = this.audioContext.createBiquadFilter();
    this.lowFilter.type = 'lowshelf';
    this.lowFilter.frequency.value = 200;
    this.lowFilter.gain.value = 0;

    // Mid peaking filter
    this.midFilter = this.audioContext.createBiquadFilter();
    this.midFilter.type = 'peaking';
    this.midFilter.frequency.value = 1000;
    this.midFilter.Q.value = 1;
    this.midFilter.gain.value = 0;

    // High shelf filter (~treble)
    this.highFilter = this.audioContext.createBiquadFilter();
    this.highFilter.type = 'highshelf';
    this.highFilter.frequency.value = 5000;
    this.highFilter.gain.value = 0;

    // Connect chain: low → mid → high → gain → master
    this.lowFilter.connect(this.midFilter);
    this.midFilter.connect(this.highFilter);
    this.highFilter.connect(this.gainNode);

    this.gainNode.connect(masterGain);
  }

  loadTrack(buffer: AudioBuffer) {
    this.audioBuffer = buffer;
    this.pausedAt = 0; // Reset position when loading a new track
    this.isPlaying = false;
  }

  play() {
    if (!this.audioBuffer || this.isPlaying) return;

    this.cleanupSource();

    this.source = this.audioContext.createBufferSource();
    this.source.buffer = this.audioBuffer;
    this.source.playbackRate.value = this.playbackRate;
    this.source.connect(this.lowFilter);

    let offset = this.pausedAt % this.audioBuffer.duration;
    this.source.start(0, offset);

    this.startedAt = this.audioContext.currentTime;
    this.isPlaying = true;
  }

  pause() {
    if (!this.isPlaying || !this.source) return;
    let elapsed = (this.audioContext.currentTime - this.startedAt) * this.playbackRate;

    this.pausedAt += elapsed;

    this.cleanupSource();
    this.isPlaying = false;
  }

  stop() {
    this.pause();
    this.pausedAt = 0;
  }

  private cleanupSource() {
    if (this.source) {
      try {
        this.source.stop();
      } catch {}
      this.source.disconnect();
      this.source = null;
    }
  }

  setVolume(value: number) {
    this.gainNode.gain.value = value;
  }

  setTempo(value: number) {
    if (this.isPlaying) {
      let elapsed = (this.audioContext.currentTime - this.startedAt) * this.playbackRate;
      this.pausedAt += elapsed;
      this.startedAt = this.audioContext.currentTime; // Reset start time for the new tempo
    }

    this.playbackRate = value;

    if (this.source) {
      this.source.playbackRate.value = this.playbackRate;
    }
  }

  setLowGain(value: number) {
    this.lowFilter.gain.value = value;
  }

  setMidGain(value: number) {
    this.midFilter.gain.value = value;
  }

  setHighGain(value: number) {
    this.highFilter.gain.value = value;
  }
}
