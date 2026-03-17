export class DeckAudio {
  source: AudioBufferSourceNode | null = null;
  gainNode: GainNode;
  audioBuffer: AudioBuffer | null = null;
  playbackRate: number = 1;

  private startedAt: number = 0;
  private pausedAt: number = 0;
  isPlaying: boolean = false;

  constructor(private audioContext: AudioContext) {
    this.gainNode = this.audioContext.createGain();
    this.gainNode.connect(this.audioContext.destination);
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
    this.source.connect(this.gainNode);

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
}
