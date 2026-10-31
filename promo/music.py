"""Original background music for the promo: a calm ambient bed (no samples, no licensing).
Soft pad chords + sparse arpeggio + low bass, through a long, airy reverb.
Run: python promo/music.py [seconds]  → promo/build/music.wav (48 kHz stereo)"""
import os, sys
import numpy as np

SR = 48000
DUR = float(sys.argv[1]) if len(sys.argv) > 1 else 86.0
OUT = os.path.join(os.path.dirname(__file__), "build", "music.wav")
rng = np.random.default_rng(7)

def hz(m): return 440.0 * 2 ** ((m - 69) / 12)

# D major colour, slow harmonic rhythm (8 s per chord)
CHORDS = [
    [50, 57, 62, 66, 69, 76],     # Dmaj9-ish   D A D F# A E
    [47, 54, 59, 62, 66, 73],     # Bm9         B F# B D F# C#
    [43, 50, 55, 59, 66, 69],     # Gmaj7       G D G B F# A
    [45, 52, 57, 62, 64, 71],     # Asus        A E A D E B
]
BAR = 8.0
n = int(DUR * SR)
t = np.arange(n) / SR
L = np.zeros(n); R = np.zeros(n)

def env_ar(length, a, r):
    e = np.ones(length)
    ai, ri = int(a * SR), int(r * SR)
    e[:ai] = np.linspace(0, 1, ai) ** 2
    e[-ri:] *= np.linspace(1, 0, ri) ** 2
    return e

# pad: detuned soft tones, each chord overlaps the next by 2 s
for i in range(int(np.ceil(DUR / BAR)) + 1):
    s0 = int(max(0, (i * BAR - 1.0)) * SR); s1 = int(min(DUR, i * BAR + BAR + 1.0) * SR)
    if s1 <= s0: continue
    seg = np.arange(s1 - s0) / SR
    e = env_ar(s1 - s0, 2.2, 2.4)
    for j, m in enumerate(CHORDS[i % 4]):
        f = hz(m)
        amp = 0.05 if m < 55 else 0.035
        for det, pan in ((-0.0025, 0.25), (0.0025, 0.75)):
            ph = rng.uniform(0, 2 * np.pi)
            lfo = 1 + 0.25 * np.sin(2 * np.pi * 0.07 * seg + j)
            w = np.sin(2 * np.pi * f * (1 + det) * seg + ph) + 0.18 * np.sin(2 * np.pi * 2 * f * (1 + det) * seg + ph)
            sig = amp * w * lfo * e
            L[s0:s1] += sig * (1 - pan); R[s0:s1] += sig * pan

# bass: chord roots, very soft
for i in range(int(np.ceil(DUR / BAR))):
    s0 = int(i * BAR * SR); s1 = int(min(DUR, i * BAR + BAR) * SR)
    seg = np.arange(s1 - s0) / SR
    root = CHORDS[i % 4][0] - 12
    sig = 0.06 * np.sin(2 * np.pi * hz(root) * seg) * env_ar(s1 - s0, 1.0, 1.5)
    L[s0:s1] += sig; R[s0:s1] += sig

# arpeggio: gentle bell-like plucks, sparse (eighth notes at 72 bpm, ~60% density), from bar 2
step = 60 / 72 / 2
k = 0
while k * step < DUR - 4:
    tt = k * step
    if tt > 6.0 and rng.random() < 0.6:
        ch = CHORDS[int(tt // BAR) % 4]
        m = ch[2 + (k % 4)] + 12
        ln = int(1.6 * SR); s0 = int(tt * SR); s1 = min(n, s0 + ln)
        seg = np.arange(s1 - s0) / SR
        env = np.exp(-seg * 3.2) * (1 - np.exp(-seg * 300))
        sig = 0.022 * env * (np.sin(2 * np.pi * hz(m) * seg) + 0.3 * np.sin(2 * np.pi * 3 * hz(m) * seg) * np.exp(-seg * 6))
        pan = 0.3 + 0.4 * rng.random()
        L[s0:s1] += sig * (1 - pan); R[s0:s1] += sig * pan
    k += 1

# reverb: convolve with a decaying stereo noise tail (FFT)
def conv(x, ir):
    N = 1 << int(np.ceil(np.log2(len(x) + len(ir))))
    y = np.fft.irfft(np.fft.rfft(x, N) * np.fft.rfft(ir, N), N)[:len(x)]
    return y
tl = np.arange(int(3.2 * SR)) / SR
irL = rng.standard_normal(len(tl)) * np.exp(-tl * 2.1); irR = rng.standard_normal(len(tl)) * np.exp(-tl * 2.1)
irL[: int(0.02 * SR)] = 0; irR[: int(0.025 * SR)] = 0
irL /= np.sqrt((irL ** 2).sum()); irR /= np.sqrt((irR ** 2).sum())
wet = 0.55
L, R = (1 - wet) * L + wet * conv(L, irL), (1 - wet) * R + wet * conv(R, irR)

# gentle high cut (one-pole) to keep it warm and out of the voice band's way
def lowpass(x, fc):
    a = np.exp(-2 * np.pi * fc / SR); y = np.empty_like(x); acc = 0.0
    # vectorised via lfilter-like recursion in chunks
    from itertools import accumulate
    y = np.array(list(accumulate(x * (1 - a), lambda p, v: p * a + v)))
    return y
L = lowpass(L, 5200); R = lowpass(R, 5200)

# fades
fi, fo = int(2.5 * SR), int(4.0 * SR)
for ch in (L, R):
    ch[:fi] *= np.linspace(0, 1, fi) ** 2
    ch[-fo:] *= np.linspace(1, 0, fo) ** 1.5
peak = max(np.abs(L).max(), np.abs(R).max())
L, R = L / peak * 0.85, R / peak * 0.85

import wave
os.makedirs(os.path.dirname(OUT), exist_ok=True)
pcm = (np.stack([L, R], axis=1) * 32767).astype("<i2")
with wave.open(OUT, "wb") as w:
    w.setnchannels(2); w.setsampwidth(2); w.setframerate(SR); w.writeframes(pcm.tobytes())
print("music:", OUT, f"{DUR:.1f}s")
