// Synthesized Audio Engine using Web Audio API
class AudioEngine {
  private ctx: AudioContext | null = null;
  private muted = false;

  private init() {
    if (!this.ctx) {
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioContextClass) {
        this.ctx = new AudioContextClass();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  setMuted(value: boolean) {
    this.muted = value;
    if (!value) {
      this.init();
    }
  }

  resume() {
    if (!this.ctx) {
      this.init();
      return;
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {
        // Ignore resume failures until next user gesture.
      });
    }
  }

  play(type: 'correct' | 'wrong' | 'levelUp' | 'spark' | 'cast' | 'hover') {
    try {
      if (this.muted) return;
      this.init();
      if (!this.ctx) return;

      const now = this.ctx.currentTime;

      switch (type) {
        case 'hover': {
          const osc = this.ctx.createOscillator();
          const gain = this.ctx.createGain();
          osc.type = 'sine';
          osc.frequency.setValueAtTime(600, now);
          osc.frequency.exponentialRampToValueAtTime(800, now + 0.08);

          gain.gain.setValueAtTime(0.015, now);
          gain.gain.linearRampToValueAtTime(0, now + 0.08);

          osc.connect(gain);
          gain.connect(this.ctx.destination);
          osc.start(now);
          osc.stop(now + 0.08);
          break;
        }

        case 'spark': {
          const osc = this.ctx.createOscillator();
          const gain = this.ctx.createGain();
          osc.type = 'triangle';
          osc.frequency.setValueAtTime(880, now);
          osc.frequency.setValueAtTime(1320, now + 0.04);

          gain.gain.setValueAtTime(0.04, now);
          gain.gain.exponentialRampToValueAtTime(0.001, now + 0.15);

          osc.connect(gain);
          gain.connect(this.ctx.destination);
          osc.start(now);
          osc.stop(now + 0.16);
          break;
        }

        case 'correct': {
          // Play a beautiful major triad arpeggio
          const freqs = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6
          freqs.forEach((freq, idx) => {
            const osc = this.ctx!.createOscillator();
            const gain = this.ctx!.createGain();
            osc.type = 'sine';
            osc.frequency.setValueAtTime(freq, now + idx * 0.06);

            gain.gain.setValueAtTime(0.04, now + idx * 0.06);
            gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.06 + 0.3);

            osc.connect(gain);
            gain.connect(this.ctx!.destination);
            osc.start(now + idx * 0.06);
            osc.stop(now + idx * 0.06 + 0.3);
          });
          break;
        }

        case 'wrong': {
          const osc = this.ctx.createOscillator();
          const gain = this.ctx.createGain();
          osc.type = 'sawtooth';
          osc.frequency.setValueAtTime(220, now);
          osc.frequency.linearRampToValueAtTime(110, now + 0.25);

          gain.gain.setValueAtTime(0.04, now);
          gain.gain.linearRampToValueAtTime(0.001, now + 0.3);

          // Lowpass filter for warm disappointment
          const filter = this.ctx.createBiquadFilter();
          filter.type = 'lowpass';
          filter.frequency.setValueAtTime(400, now);

          osc.connect(filter);
          filter.connect(gain);
          gain.connect(this.ctx.destination);

          osc.start(now);
          osc.stop(now + 0.3);
          break;
        }

        case 'cast': {
          const osc = this.ctx.createOscillator();
          const gain = this.ctx.createGain();
          osc.type = 'sine';
          osc.frequency.setValueAtTime(300, now);
          osc.frequency.exponentialRampToValueAtTime(1800, now + 0.4);

          gain.gain.setValueAtTime(0.03, now);
          gain.gain.exponentialRampToValueAtTime(0.001, now + 0.45);

          osc.connect(gain);
          gain.connect(this.ctx.destination);
          osc.start(now);
          osc.stop(now + 0.45);
          break;
        }

        case 'levelUp': {
          // Epic pentatonic victory sweep
          const freqs = [261.63, 311.13, 349.23, 392.00, 466.16, 523.25, 622.25, 783.99, 1046.50];
          freqs.forEach((freq, idx) => {
            const osc = this.ctx!.createOscillator();
            const gain = this.ctx!.createGain();
            osc.type = 'triangle';
            osc.frequency.setValueAtTime(freq, now + idx * 0.05);

            gain.gain.setValueAtTime(0.04, now + idx * 0.05);
            gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.05 + 0.4);

            osc.connect(gain);
            gain.connect(this.ctx!.destination);
            osc.start(now + idx * 0.05);
            osc.stop(now + idx * 0.05 + 0.4);
          });
          break;
        }
      }
    } catch (e) {
      console.warn('Web Audio playback failed. Interaction required.', e);
    }
  }

  playHoverTheme(gameId: string) {
    try {
      if (this.muted) return;
      this.init();
      if (!this.ctx) return;

      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      let startFreq = 600;
      let endFreq = 780;
      let type: OscillatorType = 'sine';
      let duration = 0.08;

      switch (gameId) {
        case 'neuron-builder':
          type = 'triangle';
          startFreq = 760;
          endFreq = 960;
          duration = 0.09;
          break;
        case 'data-sorter':
          type = 'square';
          startFreq = 680;
          endFreq = 780;
          duration = 0.075;
          break;
        case 'prompt-wizard':
          type = 'sine';
          startFreq = 920;
          endFreq = 1080;
          duration = 0.09;
          break;
        case 'model-showdown':
          type = 'triangle';
          startFreq = 520;
          endFreq = 640;
          duration = 0.085;
          break;
        case 'overfitting-escape':
          type = 'sawtooth';
          startFreq = 520;
          endFreq = 680;
          duration = 0.095;
          break;
        case 'ethical-judge':
          type = 'sine';
          startFreq = 520;
          endFreq = 620;
          duration = 0.08;
          break;
        case 'hyperparameter-sandbox':
          type = 'triangle';
          startFreq = 840;
          endFreq = 1000;
          duration = 0.09;
          break;
        default:
          type = 'sine';
          startFreq = 600;
          endFreq = 780;
          duration = 0.08;
      }

      osc.type = type;
      osc.frequency.setValueAtTime(startFreq, now);
      osc.frequency.exponentialRampToValueAtTime(endFreq, now + duration);

      gain.gain.setValueAtTime(0.02, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + duration);

      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now);
      osc.stop(now + duration + 0.02);
    } catch (e) {
      console.warn('Theme hover audio failed.', e);
    }
  }
}

export const sfx = new AudioEngine();
