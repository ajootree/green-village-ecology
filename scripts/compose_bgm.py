"""Original, deterministic scores for the game. No samples or third-party music.

Requires numpy and lameenc (1.8.1); install the latter into ../.tools if needed.
The generated compositions and recordings are dedicated to CC0.
"""
from pathlib import Path
import sys
sys.path.insert(0, str(Path(__file__).resolve().parents[1] / '.tools'))
import numpy as np
import lameenc

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / 'dist' / 'assets' / 'music'
OUT.mkdir(parents=True, exist_ok=True)
SR = 32000


class Score:
    def __init__(self, bpm, bars, beats=4, seed=1):
        self.beat = 60 / bpm
        self.length = bars * beats * self.beat
        self.n = round(self.length * SR)
        self.mix = np.zeros((self.n, 2), dtype=np.float32)
        self.rng = np.random.default_rng(seed)

    def note(self, midi, beat, duration, level=.15, voice='piano', pan=0):
        length = duration * self.beat
        if voice in ('piano', 'bell'):
            length += 1.6
        t = np.arange(round(length * SR), dtype=np.float32) / SR
        freq = 440 * 2 ** ((midi - 69) / 12)
        a = np.zeros_like(t)
        if voice == 'piano':
            # Soft felt attack, a warm fundamental and quicker upper partials.
            for h, weight in enumerate([1, .42, .20, .09, .04, .02], 1):
                decay = np.exp(-t * (1.3 + .38 * h))
                a += weight * np.sin(2 * np.pi * freq * h * (1 + .00007 * h*h) * t) * decay
            a *= (1 - np.exp(-t * 110))
        elif voice == 'bell':
            for ratio, weight, decay in [(1, 1, 1.7), (2, .16, 3.4), (3.99, .045, 5), (6.01, .012, 8)]:
                a += weight * np.sin(2 * np.pi * freq * ratio * t) * np.exp(-t * decay)
            a *= (1 - np.exp(-t * 180))
        elif voice == 'flute':
            vibrato = .004 * np.sin(2*np.pi*4.6*t) * np.minimum(t/.6, 1)
            phase = 2*np.pi*freq * (t + np.cumsum(vibrato)/SR)
            a = np.sin(phase) + .12*np.sin(phase*2) + .035*np.sin(phase*3)
            a *= np.minimum(t/.12, 1) * np.minimum(np.maximum(length-t, 0)/.4, 1)
        else:
            # A gently detuned string pad, with a slow bow-shaped envelope.
            for h, weight in [(1, .7), (2, .15), (3, .07), (4, .025)]:
                a += weight * (np.sin(2*np.pi*freq*h*.9991*t) + np.sin(2*np.pi*freq*h*1.0009*t)) / 2
            a *= np.sin(np.pi * np.minimum(t/.8, 1)/2)**2
            a *= np.sin(np.pi * np.minimum(np.maximum(length-t, 0)/1.2, 1)/2)**2
        a *= np.minimum(np.maximum(length-t, 0)/.10, 1) * level
        offset = round((beat * self.beat + self.rng.uniform(-.012, .012)) * SR)
        # Wrap releases around the loop, rather than abruptly cutting the music.
        idx = (np.arange(len(a)) + offset) % self.n
        self.mix[idx, 0] += a * np.sqrt((1-pan)/2)
        self.mix[idx, 1] += a * np.sqrt((1+pan)/2)

    def export(self, name):
        dry = self.mix
        wet = np.zeros_like(dry)
        # Original small-hall stereo reflections; no sampled impulse responses.
        for i, (delay, gain) in enumerate([(.081,.14),(.127,.12),(.193,.10),(.271,.08),(.383,.07),(.521,.06),(.713,.045),(.947,.035),(1.213,.025),(1.571,.018)]):
            source = dry[:, ::-1] if i % 2 else dry
            wet += np.roll(source, round(delay*SR), axis=0) * gain
        mix = dry + wet
        mix -= mix.mean(axis=0)
        mix *= .72 / max(float(np.max(np.abs(mix))), 1e-6)
        pcm = (mix * 32767).astype('<i2').tobytes()
        encoder = lameenc.Encoder()
        encoder.set_bit_rate(96)
        encoder.set_in_sample_rate(SR)
        encoder.set_channels(2)
        encoder.set_quality(2)
        data = encoder.encode(pcm) + encoder.flush()
        (OUT / f'{name}.mp3').write_bytes(data)
        rms = float(np.sqrt(np.mean(mix**2)))
        print(f'{name}: {self.length:.1f}s, {len(data):,} bytes, peak .72, RMS {rms:.3f}')


def village():
    # 32 bars of a light 3/4 waltz in D major: four eight-bar phrases.
    s = Score(84, 32, 3, 42)
    chords = [(50,[62,66,69,73]),(47,[59,62,66,69]),(43,[59,62,66,69]),(45,[61,64,69,71]),
              (40,[59,62,64,67]),(42,[57,62,66,69]),(43,[59,62,66,69]),(45,[61,64,69,74])]
    phrases = [
        [[(74,1),(76,.5),(78,.5),(81,1)],[(78,1.5),(76,.5),(74,1)],[(71,1),(74,1),(78,1)],[(76,2),(73,1)],
         [(71,1),(74,.5),(76,.5),(79,1)],[(78,1),(76,1),(74,1)],[(71,1),(69,1),(74,1)],[(73,1),(76,1),(69,1)]],
        [[(78,1),(81,1),(83,1)],[(81,1.5),(78,.5),(76,1)],[(78,1),(74,1),(71,1)],[(73,1),(76,1),(81,1)],
         [(79,1),(78,.5),(76,.5),(74,1)],[(76,1),(78,1),(74,1)],[(71,1),(74,1),(76,1)],[(73,1.5),(69,1.5)]],
    ]
    for bar in range(32):
        bass, chord = chords[bar % 8]
        b = bar*3
        s.note(bass, b, 2.5, .17, pan=-.12)
        for step, note in enumerate([chord[0],chord[2],chord[1],chord[3],chord[2],chord[1]]):
            s.note(note, b+step*.5, .48, .10, pan=(-.22 if step%2 else .22))
        for note in chord[:3]:
            s.note(note, b, 3.15, .027, 'pad', .25)
        motif = phrases[(bar//8)%2][bar%8]
        t = b
        for note, d in motif:
            s.note(note, t, d*.82, .13 if bar<16 else .11, 'bell', -.08)
            t += d
        if bar >= 16 and bar % 2 == 0:
            s.note(motif[0][0]-12, b+.25, 2.2, .052, 'flute', .2)
    s.export('village')


def ending(dark=False):
    s = Score(66 if dark else 76, 16, seed=7 if dark else 18)
    if dark:
        chords=[(38,[53,57,62]),(34,[53,58,62]),(41,[53,57,60]),(36,[52,55,60]),
                (43,[55,58,62]),(34,[53,58,62]),(45,[52,57,61]),(38,[53,57,62])]
        melody=[[(74,2),(72,2)],[(69,3)],[(69,1.5),(67,.5),(65,2)],[(64,3)],
                [(67,2),(65,2)],[(62,3)],[(64,2),(61,2)],[(62,3.5)]]
    else:
        chords=[(38,[54,57,61,66]),(35,[54,59,62,66]),(31,[55,59,62,66]),(33,[52,57,61,64]),
                (28,[52,55,59,62]),(30,[54,57,62,66]),(31,[55,59,62,66]),(33,[52,57,61,64])]
        melody=[[(74,1.5),(78,.5),(81,2)],[(78,2),(76,2)],[(74,1),(71,1),(74,2)],[(73,3)],
                [(76,1),(79,1),(78,2)],[(76,1.5),(74,.5),(78,2)],[(74,2),(71,2)],[(73,2),(69,2)]]
    for bar in range(16):
        b=bar*4
        bass, chord=chords[bar%8]
        s.note(bass,b,3.7,.18,pan=-.12)
        for j, note in enumerate(chord):
            s.note(note,b+j*.07,3.5,.065,pan=.1)
            s.note(note,b,4.4,.037,'pad',.3)
        arp=[chord[0],chord[2],chord[1],chord[-1]]
        for j,note in enumerate(arp):
            s.note(note+12,b+1+j*.65,.65,.043,pan=-.28)
        t=b+.12
        for note,d in melody[bar%8]:
            s.note(note,t,d*.88,.095 if dark else .11,'piano',-.08)
            if not dark and bar>=8:
                s.note(note+12,t,d*.7,.027,'bell',.18)
            t+=d
    s.export('ending-dark' if dark else 'ending-light')


if __name__ == '__main__':
    village()
    ending(False)
    ending(True)
