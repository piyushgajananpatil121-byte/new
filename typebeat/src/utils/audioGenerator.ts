export const generateBeepTrack = (duration = 40): string => {
  const sampleRate = 44100;
  const numChannels = 2;
  const bitsPerSample = 16;
  const bytesPerSample = bitsPerSample / 8;
  const blockAlign = numChannels * bytesPerSample;
  const byteRate = sampleRate * blockAlign;
  const dataSize = duration * byteRate;
  const fileSize = 44 + dataSize;

  const buffer = new ArrayBuffer(fileSize);
  const view = new DataView(buffer);

  const writeString = (offset: number, string: string) => {
    for (let i = 0; i < string.length; i++) {
      view.setUint8(offset + i, string.charCodeAt(i));
    }
  };

  writeString(0, 'RIFF');
  view.setUint32(4, fileSize - 8, true);
  writeString(8, 'WAVE');
  writeString(12, 'fmt ');
  view.setUint32(16, 16, true);
  view.setUint16(20, 1, true);
  view.setUint16(22, numChannels, true);
  view.setUint32(24, sampleRate, true);
  view.setUint32(28, byteRate, true);
  view.setUint16(32, blockAlign, true);
  view.setUint16(34, bitsPerSample, true);
  writeString(36, 'data');
  view.setUint32(40, dataSize, true);

  let offset = 44;
  const volume = 0.3;
  const beatsPerMinute = 120;
  const beatsPerSecond = beatsPerMinute / 60;

  for (let i = 0; i < duration * sampleRate; i++) {
    const time = i / sampleRate;
    const beatTime = time * beatsPerSecond;
    const isOnBeat = (beatTime % 1) < 0.1;

    let sample = 0;
    if (isOnBeat) {
      const frequency = 440;
      sample = Math.sin(2 * Math.PI * frequency * time) * volume;
    } else {
      const frequency = 220;
      sample = Math.sin(2 * Math.PI * frequency * time) * volume * 0.3;
    }

    const intSample = Math.max(-1, Math.min(1, sample)) * 0x7fff;

    view.setInt16(offset, intSample, true);
    view.setInt16(offset + 2, intSample, true);
    offset += 4;
  }

  const blob = new Blob([buffer], { type: 'audio/wav' });
  return URL.createObjectURL(blob);
};
