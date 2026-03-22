import { DBSchema } from 'idb';
import { Library } from '../player-control/player-control.types';

export interface Track {
  name: string;
  data: Blob;
  type: string;
  metadata: Library;
}

export interface Storage extends DBSchema {
  files: {
    key: string;
    value: Track;
    indexes: { 'by-name': string };
  };
}
