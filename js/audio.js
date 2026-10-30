export class AudioEngine {
  constructor() {
    this.ctx = null
    this.master = null
    this.enabled = true
    this.noiseBuffer = null
  }

  unlock() {
    if (!this.enabled) return
    if (!this.ctx) {
      const Ctx = window.AudioContext || window.webkitAudioContext
      if (!Ctx) return
      this.ctx = new Ctx()
      this.master = this.ctx.createGain()
      this.master.gain.value = 0.5
      this.master.connect(this.ctx.destination)
      this.noiseBuffer = this.createNoise()
    }
    if (this.ctx.state === 'suspended') this.ctx.resume().catch(() => {})
  }

  setEnabled(on) {
    this.enabled = on
    if (this.master) this.master.gain.value = on ? 0.5 : 0
    if (on) this.unlock()
  }

  createNoise() {
    const len = Math.floor(this.ctx.sampleRate * 0.6)
    const buffer = this.ctx.createBuffer(1, len, this.ctx.sampleRate)
    const data = buffer.getChannelData(0)
    for (let i = 0; i < len; i++) data[i] = Math.random() * 2 - 1
    return buffer
  }

  tone({ freq = 440, endFreq = freq, dur = 0.2, type = 'sine', vol = 0.2, delay = 0, attack = 0.005 }) {
    if (!this.enabled) return
    this.unlock()
    if (!this.ctx) return
    const t0 = this.ctx.currentTime + delay
    const osc = this.ctx.createOscillator()
    const gain = this.ctx.createGain()
    osc.type = type
    osc.frequency.setValueAtTime(freq, t0)
    osc.frequency.exponentialRampToValueAtTime(Math.max(20, endFreq), t0 + dur)
    gain.gain.setValueAtTime(0.0001, t0)
    gain.gain.exponentialRampToValueAtTime(Math.max(0.0002, vol), t0 + attack)
    gain.gain.exponentialRampToValueAtTime(0.0001, t0 + dur)
    osc.connect(gain).connect(this.master)
    osc.start(t0)
    osc.stop(t0 + dur + 0.02)
  }

  noise({ dur = 0.3, vol = 0.2, delay = 0, freq = 1200, q = 0.8, type = 'bandpass' }) {
    if (!this.enabled) return
    this.unlock()
    if (!this.ctx || !this.noiseBuffer) return
    const t0 = this.ctx.currentTime + delay
    const src = this.ctx.createBufferSource()
    src.buffer = this.noiseBuffer
    const filter = this.ctx.createBiquadFilter()
    filter.type = type
    filter.frequency.setValueAtTime(freq, t0)
    filter.frequency.exponentialRampToValueAtTime(Math.max(60, freq * 0.25), t0 + dur)
    filter.Q.value = q
    const gain = this.ctx.createGain()
    gain.gain.setValueAtTime(0.0001, t0)
    gain.gain.exponentialRampToValueAtTime(vol, t0 + 0.01)
    gain.gain.exponentialRampToValueAtTime(0.0001, t0 + dur)
    src.connect(filter).connect(gain).connect(this.master)
    src.start(t0)
    src.stop(t0 + dur + 0.02)
  }

  click() {
    this.tone({ freq: 660, endFreq: 990, dur: 0.08, type: 'triangle', vol: 0.09 })
    this.tone({ freq: 1320, endFreq: 1760, dur: 0.05, type: 'sine', vol: 0.05, delay: 0.02 })
  }

  select() {
    this.tone({ freq: 520, endFreq: 780, dur: 0.12, type: 'sine', vol: 0.1 })
    this.tone({ freq: 1040, endFreq: 1560, dur: 0.1, type: 'triangle', vol: 0.05, delay: 0.04 })
  }

  draw() {
    this.noise({ dur: 0.2, vol: 0.1, freq: 2600, q: 1.2, type: 'highpass' })
    this.tone({ freq: 300, endFreq: 520, dur: 0.16, type: 'sine', vol: 0.05 })
  }

  summon() {
    this.tone({ freq: 90, endFreq: 45, dur: 0.5, type: 'sine', vol: 0.24 })
    this.noise({ dur: 0.45, vol: 0.14, freq: 800, q: 0.5, type: 'bandpass' })
    const notes = [392, 523.25, 659.25, 783.99]
    notes.forEach((f, i) => this.tone({ freq: f, endFreq: f * 1.01, dur: 0.5, type: 'triangle', vol: 0.045, delay: 0.04 + i * 0.045 }))
  }

  cast() {
    this.tone({ freq: 220, endFreq: 880, dur: 0.5, type: 'sine', vol: 0.12 })
    this.tone({ freq: 440, endFreq: 1760, dur: 0.45, type: 'triangle', vol: 0.06, delay: 0.06 })
    this.noise({ dur: 0.5, vol: 0.09, freq: 3200, q: 1.6, type: 'bandpass' })
  }

  trap() {
    this.tone({ freq: 110, endFreq: 55, dur: 0.6, type: 'sawtooth', vol: 0.14 })
    this.noise({ dur: 0.3, vol: 0.18, freq: 500, q: 0.5, type: 'lowpass' })
    this.tone({ freq: 880, endFreq: 220, dur: 0.35, type: 'square', vol: 0.04, delay: 0.08 })
  }

  attack() {
    this.noise({ dur: 0.35, vol: 0.22, freq: 2200, q: 0.6, type: 'bandpass' })
    this.tone({ freq: 180, endFreq: 60, dur: 0.3, type: 'sawtooth', vol: 0.12 })
  }

  hit() {
    this.noise({ dur: 0.4, vol: 0.3, freq: 380, q: 0.4, type: 'lowpass' })
    this.tone({ freq: 120, endFreq: 40, dur: 0.4, type: 'sine', vol: 0.3 })
    this.tone({ freq: 70, endFreq: 30, dur: 0.55, type: 'triangle', vol: 0.2, delay: 0.03 })
  }

  heal() {
    const notes = [523.25, 659.25, 783.99, 1046.5]
    notes.forEach((f, i) => this.tone({ freq: f, endFreq: f, dur: 0.6, type: 'sine', vol: 0.07, delay: i * 0.07 }))
    this.noise({ dur: 0.6, vol: 0.04, freq: 4000, q: 2, type: 'highpass' })
  }

  win() {
    const notes = [392, 523.25, 659.25, 783.99, 1046.5, 1318.5]
    notes.forEach((f, i) => this.tone({ freq: f, endFreq: f, dur: 0.9, type: 'triangle', vol: 0.09, delay: i * 0.11 }))
    this.tone({ freq: 98, endFreq: 98, dur: 1.5, type: 'sine', vol: 0.12 })
  }

  lose() {
    const notes = [392, 349.23, 293.66, 220, 164.81]
    notes.forEach((f, i) => this.tone({ freq: f, endFreq: f * 0.98, dur: 0.9, type: 'triangle', vol: 0.1, delay: i * 0.16 }))
    this.tone({ freq: 80, endFreq: 40, dur: 1.4, type: 'sine', vol: 0.16 })
  }

  turn() {
    this.tone({ freq: 523.25, endFreq: 523.25, dur: 0.45, type: 'sine', vol: 0.07 })
    this.tone({ freq: 783.99, endFreq: 783.99, dur: 0.6, type: 'triangle', vol: 0.06, delay: 0.09 })
    this.tone({ freq: 1046.5, endFreq: 1046.5, dur: 0.7, type: 'sine', vol: 0.03, delay: 0.18 })
  }

  error() {
    this.tone({ freq: 220, endFreq: 146.83, dur: 0.16, type: 'square', vol: 0.05 })
  }
}
