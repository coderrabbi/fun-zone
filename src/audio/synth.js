// Ambient Web Audio API synthesizer for Bakerganj FunVerse
// 100% procedural audio, 0 external files, 0 latency

let audioCtx = null;
let masterGain = null;
let droneOsc1 = null;
let droneOsc2 = null;
let droneLfo = null;
let isPlaying = false;

function getAudioContext() {
  if (!audioCtx) {
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    if (!AudioContextClass) return null;
    audioCtx = new AudioContextClass();
    masterGain = audioCtx.createGain();
    masterGain.gain.setValueAtTime(0, audioCtx.currentTime);
    masterGain.connect(audioCtx.destination);
  }
  if (audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
  return audioCtx;
}

export function playUiClick() {
  try {
    const ctx = getAudioContext();
    if (!ctx || !isPlaying) return;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(880, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(1320, ctx.currentTime + 0.04);

    gain.gain.setValueAtTime(0.04, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.05);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start();
    osc.stop(ctx.currentTime + 0.05);
  } catch {
    // Ignore audio errors gracefully
  }
}

export function playHoverBlip() {
  try {
    const ctx = getAudioContext();
    if (!ctx || !isPlaying) return;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(520, ctx.currentTime);

    gain.gain.setValueAtTime(0.015, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.03);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start();
    osc.stop(ctx.currentTime + 0.03);
  } catch {
    // Ignore audio errors gracefully
  }
}

export function toggleAmbientSound() {
  const ctx = getAudioContext();
  if (!ctx) return false;

  if (isPlaying) {
    // Ramp down and stop
    masterGain.gain.linearRampToValueAtTime(0.0001, ctx.currentTime + 0.8);
    setTimeout(() => {
      try {
        droneOsc1?.stop();
        droneOsc2?.stop();
        droneLfo?.stop();
        droneOsc1?.disconnect();
        droneOsc2?.disconnect();
        droneLfo?.disconnect();
      } catch {}
      isPlaying = false;
    }, 850);
    isPlaying = false;
    return false;
  } else {
    // Start ambient sci-fi drone
    const now = ctx.currentTime;

    // Filter to keep sound warm and atmospheric
    const filter = ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(340, now);

    // LFO for filter breath / sweeping modulation
    droneLfo = ctx.createOscillator();
    const lfoGain = ctx.createGain();
    droneLfo.frequency.setValueAtTime(0.12, now);
    lfoGain.gain.setValueAtTime(140, now);
    droneLfo.connect(lfoGain);
    lfoGain.connect(filter.frequency);

    // Oscillator 1: Root note (A1 55Hz)
    droneOsc1 = ctx.createOscillator();
    droneOsc1.type = 'sine';
    droneOsc1.frequency.setValueAtTime(55, now);

    // Oscillator 2: Fifth note (E2 82.4Hz) with slight detune for cosmic chorus
    droneOsc2 = ctx.createOscillator();
    droneOsc2.type = 'triangle';
    droneOsc2.frequency.setValueAtTime(82.4, now);
    droneOsc2.detune.setValueAtTime(4, now);

    droneOsc1.connect(filter);
    droneOsc2.connect(filter);
    filter.connect(masterGain);

    masterGain.gain.setValueAtTime(0.001, now);
    masterGain.gain.linearRampToValueAtTime(0.09, now + 1.5);

    droneOsc1.start(now);
    droneOsc2.start(now);
    droneLfo.start(now);

    isPlaying = true;
    return true;
  }
}

export function isAmbientPlaying() {
  return isPlaying;
}
