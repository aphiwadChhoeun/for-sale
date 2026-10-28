export type SoundName =
  | 'deal'
  | 'bid'
  | 'pass'
  | 'won'
  | 'reveal'
  | 'coin'
  | 'win'
  | 'lose'
  | 'click'
  | 'select'

let context: AudioContext | null = null

function getContext(): AudioContext | null {
  if (typeof window === 'undefined') return null
  if (!context) {
    const AudioCtor =
      window.AudioContext ??
      (window as unknown as { webkitAudioContext?: typeof AudioContext })
        .webkitAudioContext
    if (!AudioCtor) return null
    context = new AudioCtor()
  }
  if (context.state === 'suspended') {
    void context.resume()
  }
  return context
}

export function unlockAudio() {
  getContext()
}

function tone(
  ctx: AudioContext,
  frequency: number,
  start: number,
  duration: number,
  gainValue: number,
  type: OscillatorType = 'sine',
  endFrequency?: number,
) {
  const osc = ctx.createOscillator()
  const gain = ctx.createGain()
  const now = ctx.currentTime + start
  osc.type = type
  osc.frequency.setValueAtTime(frequency, now)
  if (endFrequency) {
    osc.frequency.exponentialRampToValueAtTime(
      Math.max(20, endFrequency),
      now + duration,
    )
  }
  gain.gain.setValueAtTime(0.0001, now)
  gain.gain.exponentialRampToValueAtTime(gainValue, now + 0.008)
  gain.gain.exponentialRampToValueAtTime(0.0001, now + duration)
  osc.connect(gain)
  gain.connect(ctx.destination)
  osc.start(now)
  osc.stop(now + duration + 0.02)
}

function noise(
  ctx: AudioContext,
  start: number,
  duration: number,
  gainValue: number,
  frequency: number,
  q = 1,
) {
  const sampleRate = ctx.sampleRate
  const buffer = ctx.createBuffer(1, Math.ceil(sampleRate * duration), sampleRate)
  const data = buffer.getChannelData(0)
  for (let i = 0; i < data.length; i += 1) {
    data[i] = Math.random() * 2 - 1
  }
  const source = ctx.createBufferSource()
  source.buffer = buffer
  const filter = ctx.createBiquadFilter()
  filter.type = 'bandpass'
  filter.frequency.value = frequency
  filter.Q.value = q
  const gain = ctx.createGain()
  const now = ctx.currentTime + start
  gain.gain.setValueAtTime(0.0001, now)
  gain.gain.exponentialRampToValueAtTime(gainValue, now + 0.01)
  gain.gain.exponentialRampToValueAtTime(0.0001, now + duration)
  source.connect(filter)
  filter.connect(gain)
  gain.connect(ctx.destination)
  source.start(now)
}

export function playSound(name: SoundName, enabled: boolean) {
  if (!enabled) return
  const ctx = getContext()
  if (!ctx) return

  switch (name) {
    case 'deal':
      noise(ctx, 0, 0.09, 0.035, 1600, 0.8)
      tone(ctx, 280, 0, 0.05, 0.018, 'sine', 190)
      break
    case 'bid':
      tone(ctx, 520, 0, 0.05, 0.045, 'triangle', 660)
      tone(ctx, 1040, 0.005, 0.035, 0.015, 'sine')
      break
    case 'pass':
      noise(ctx, 0, 0.06, 0.025, 700, 0.7)
      tone(ctx, 210, 0.01, 0.11, 0.04, 'sine', 150)
      break
    case 'won':
      tone(ctx, 523.25, 0, 0.08, 0.04, 'triangle')
      tone(ctx, 783.99, 0.07, 0.11, 0.04, 'triangle')
      break
    case 'reveal':
      noise(ctx, 0, 0.16, 0.028, 2400, 0.6)
      tone(ctx, 440, 0.03, 0.12, 0.03, 'sine', 880)
      break
    case 'coin':
      tone(ctx, 1046.5, 0, 0.07, 0.032, 'sine')
      tone(ctx, 1567.98, 0.055, 0.09, 0.026, 'sine')
      break
    case 'win':
      ;[523.25, 659.25, 783.99, 1046.5].forEach((frequency, index) => {
        tone(ctx, frequency, index * 0.11, 0.22, 0.045, 'triangle')
        tone(ctx, frequency * 2, index * 0.11 + 0.01, 0.12, 0.012, 'sine')
      })
      break
    case 'lose':
      ;[392, 329.63, 261.63].forEach((frequency, index) => {
        tone(ctx, frequency, index * 0.14, 0.2, 0.035, 'triangle')
      })
      break
    case 'select':
      tone(ctx, 860, 0, 0.035, 0.02, 'sine', 980)
      break
    case 'click':
      tone(ctx, 1200, 0, 0.025, 0.015, 'sine', 1000)
      break
    default:
      break
  }
}
