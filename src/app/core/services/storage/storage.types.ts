import { DBSchema } from 'idb';

export interface Storage extends DBSchema {
  files: {
    key: string;
    value: {
      name: string;
      data: Blob;
      type: string;
      addedAt: number;
    };
    indexes: { 'by-name': string };
  };
}
