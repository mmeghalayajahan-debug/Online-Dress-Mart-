/**
 * Web Audio API synthesizer for the physical pull-string lamp switch
 * Generates an authentic mechanical snap and spring resonance
 */

class SoundService {
  private audioCtx: AudioContext | null = null;

  private init() {
    if (!this.audioCtx && typeof window !== 'undefined') {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        this.audioCtx = new AudioCtx();
      }
    }
    if (this.audioCtx && this.audioCtx.state === 'suspended') {
      this.audioCtx.resume();
    }
  }

  playSwitchClick(isOn: boolean = true) {
    try {
      this.init();
      if (!this.audioCtx) return;

      const now = this.audioCtx.currentTime;

      // 1. Initial mechanical high sharp metallic click
      const osc = this.audioCtx.createOscillator();
      const gain = this.audioCtx.createGain();
      
      osc.type = isOn ? 'triangle' : 'sine';
      osc.frequency.setValueAtTime(isOn ? 1800 : 1200, now);
      osc.frequency.exponentialRampToValueAtTime(isOn ? 350 : 220, now + 0.04);

      gain.gain.setValueAtTime(0.4, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.045);

      osc.connect(gain);
      gain.connect(this.audioCtx.destination);

      osc.start(now);
      osc.stop(now + 0.05);

      // 2. Secondary pull-cord spring snap / release thud
      const snapOsc = this.audioCtx.createOscillator();
      const snapGain = this.audioCtx.createGain();

      snapOsc.type = 'sawtooth';
      snapOsc.frequency.setValueAtTime(isOn ? 520 : 420, now + 0.015);
      snapOsc.frequency.exponentialRampToValueAtTime(isOn ? 90 : 60, now + 0.08);

      snapGain.gain.setValueAtTime(0.3, now + 0.015);
      snapGain.gain.exponentialRampToValueAtTime(0.001, now + 0.09);

      snapOsc.connect(snapGain);
      snapGain.connect(this.audioCtx.destination);

      snapOsc.start(now + 0.015);
      snapOsc.stop(now + 0.095);

      // 3. Electric hum / filament chime if turning on
      if (isOn) {
        const humOsc = this.audioCtx.createOscillator();
        const humGain = this.audioCtx.createGain();
        humOsc.type = 'sine';
        humOsc.frequency.setValueAtTime(880, now + 0.03);
        humOsc.frequency.exponentialRampToValueAtTime(440, now + 0.25);

        humGain.gain.setValueAtTime(0.12, now + 0.03);
        humGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.25);

        humOsc.connect(humGain);
        humGain.connect(this.audioCtx.destination);

        humOsc.start(now + 0.03);
        humOsc.stop(now + 0.26);
      }
    } catch {
      // Audio playback might be restricted before user gesture
    }
  }

  playCartAdd() {
    try {
      this.init();
      if (!this.audioCtx) return;
      const now = this.audioCtx.currentTime;
      const osc = this.audioCtx.createOscillator();
      const gain = this.audioCtx.createGain();
      
      osc.type = 'sine';
      osc.frequency.setValueAtTime(587.33, now); // D5
      osc.frequency.setValueAtTime(880, now + 0.08); // A5

      gain.gain.setValueAtTime(0.15, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.25);

      osc.connect(gain);
      gain.connect(this.audioCtx.destination);
      osc.start(now);
      osc.stop(now + 0.25);
    } catch {
      // ignore
    }
  }
}

export const sound = new SoundService();
