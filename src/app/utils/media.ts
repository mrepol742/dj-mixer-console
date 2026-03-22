import { Metadata, Library } from '../core/services/player-control/player-control.types';
import * as jsmediatags from 'jsmediatags/dist/jsmediatags.min.js';

export function extractMetadata(blob: Blob, url: string, fileName: string): Promise<Library> {
  return new Promise((resolve) => {
    jsmediatags.read(blob, {
      onSuccess: (tag: Metadata) => {
        const { title, artist, album, bpm } = tag.tags;
        let coverUrl: string | undefined;

        if (tag.tags.picture) {
          const { data, format } = tag.tags.picture;
          const byteArray = new Uint8Array(data);
          const blob = new Blob([byteArray], { type: format });
          coverUrl = URL.createObjectURL(blob);
        }

        resolve({
          id: crypto.randomUUID(),
          title: title || fileName,
          artist: artist || 'Unknown Artist',
          album: album || 'Unknown Album',
          bpm: bpm || null,
          filename: fileName,
          cover_url: coverUrl || null,
          url,
          created_at: new Date(),
        });
      },
      onError: () => {
        resolve({
          id: crypto.randomUUID(),
          title: fileName,
          artist: 'Unknown Artist',
          album: 'Unknown Album',
          bpm: null,
          filename: fileName,
          cover_url: null,
          url,
          created_at: new Date(),
        });
      },
    });
  });
}
