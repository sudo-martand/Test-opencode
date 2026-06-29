import { describe, it, expect } from 'vitest';
import {
  gain, frequency, duration,
  defaultSoundConfig, defaultKeystrokeConfig, defaultAlertConfig,
  mechanicalSwitchPresets, alertPresets,
  audioWorkletCode,
} from '../index.js';

describe('branded type constructors', () => {
  it('gain clamps to [0, 1]', () => {
    expect(gain(0.5)).toBeCloseTo(0.5);
    expect(gain(0)).toBe(0);
    expect(gain(1)).toBe(1);
    expect(gain(-0.5)).toBe(0);
    expect(gain(1.5)).toBe(1);
  });

  it('frequency clamps to [20, 20000]', () => {
    expect(frequency(440)).toBe(440);
    expect(frequency(20)).toBe(20);
    expect(frequency(20000)).toBe(20000);
    expect(frequency(10)).toBe(20);
    expect(frequency(25000)).toBe(20000);
  });

  it('duration clamps to >= 0', () => {
    expect(duration(100)).toBe(100);
    expect(duration(0)).toBe(0);
    expect(duration(-1)).toBe(0);
  });
});

describe('default configs', () => {
  it('defaultSoundConfig has expected values', () => {
    expect(defaultSoundConfig.masterVolume).toBeCloseTo(0.7);
    expect(defaultSoundConfig.spatialEnabled).toBe(false);
    expect(defaultSoundConfig.sampleRate).toBe(48000);
    expect(defaultSoundConfig.bufferSize).toBe(128);
  });

  it('defaultKeystrokeConfig has all properties', () => {
    expect(defaultKeystrokeConfig.clickFreq).toBe(2000);
    expect(defaultKeystrokeConfig.clickDuration).toBe(4);
    expect(defaultKeystrokeConfig.bottomOutFreq).toBe(800);
    expect(defaultKeystrokeConfig.bottomOutDuration).toBe(6);
    expect(defaultKeystrokeConfig.releaseFreq).toBe(3000);
    expect(defaultKeystrokeConfig.releaseDuration).toBe(3);
    expect(defaultKeystrokeConfig.volume).toBeCloseTo(0.15);
  });

  it('defaultAlertConfig has expected structure', () => {
    expect(defaultAlertConfig.oscillator).toBe('sine');
    expect(defaultAlertConfig.frequencies.length).toBe(3);
    expect(defaultAlertConfig.frequencies[0]).toBe(880);
    expect(defaultAlertConfig.duration).toBe(150);
    expect(defaultAlertConfig.interval).toBe(100);
    expect(defaultAlertConfig.repetitions).toBe(3);
    expect(defaultAlertConfig.volume).toBeCloseTo(0.4);
  });
});

describe('mechanicalSwitchPresets', () => {
  it('has cherryMXBlue preset', () => {
    expect(mechanicalSwitchPresets.cherryMXBlue).toBeDefined();
    expect(mechanicalSwitchPresets.cherryMXBlue.clickFreq).toBeGreaterThan(0);
  });

  it('has cherryMXBrown preset', () => {
    expect(mechanicalSwitchPresets.cherryMXBrown).toBeDefined();
    expect(mechanicalSwitchPresets.cherryMXBrown.volume).toBeGreaterThan(0);
  });

  it('has bucklingSpring preset', () => {
    expect(mechanicalSwitchPresets.bucklingSpring).toBeDefined();
    expect(mechanicalSwitchPresets.bucklingSpring.clickDuration).toBeGreaterThan(0);
  });

  it('all presets have unique click frequencies', () => {
    const freqs = [
      mechanicalSwitchPresets.cherryMXBlue.clickFreq,
      mechanicalSwitchPresets.cherryMXBrown.clickFreq,
      mechanicalSwitchPresets.bucklingSpring.clickFreq,
    ];
    expect(new Set(freqs).size).toBe(3);
  });
});

describe('alertPresets', () => {
  it('has critical preset with glissando-like pattern', () => {
    expect(alertPresets.critical).toBeDefined();
    expect(alertPresets.critical.frequencies.length).toBe(4);
    expect(alertPresets.critical.repetitions).toBe(5);
    expect(alertPresets.critical.volume).toBeCloseTo(0.6);
  });

  it('has warning preset', () => {
    expect(alertPresets.warning).toBeDefined();
    expect(alertPresets.warning.frequencies.length).toBe(2);
    expect(alertPresets.warning.repetitions).toBe(2);
  });

  it('has notification preset', () => {
    expect(alertPresets.notification).toBeDefined();
    expect(alertPresets.notification.frequencies.length).toBe(2);
    expect(alertPresets.notification.repetitions).toBe(1);
    expect(alertPresets.notification.volume).toBeCloseTo(0.2);
  });
});

describe('audioWorkletCode', () => {
  it('is a non-empty string', () => {
    expect(typeof audioWorkletCode).toBe('string');
    expect(audioWorkletCode.length).toBeGreaterThan(0);
  });

  it('contains the worklet processor class', () => {
    expect(audioWorkletCode).toContain('CyberSimProcessor');
    expect(audioWorkletCode).toContain('AudioWorkletProcessor');
  });
});
