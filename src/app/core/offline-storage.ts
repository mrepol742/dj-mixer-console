import { Injectable } from '@angular/core';
import { openDB, DBSchema, IDBPDatabase } from 'idb';

interface OfflineStorageDB extends DBSchema {
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

@Injectable({
  providedIn: 'root',
})
export class OfflineStorage {
  private dbPromise!: Promise<IDBPDatabase<OfflineStorageDB>>;

  constructor() {
    this.initDB();
  }

  private initDB() {
    this.dbPromise = openDB<OfflineStorageDB>('offline-storage', 1, {
      upgrade(db) {
        const store = db.createObjectStore('files', { keyPath: 'name' });
        store.createIndex('by-name', 'name');
      },
    });
  }

  async saveFile(file: File) {
    const db = await this.dbPromise;
    await db.put('files', {
      name: file.name,
      data: file,
      type: file.type,
      addedAt: Date.now(),
    });
  }

  async getAllFiles(): Promise<{ name: string; data: Blob; type: string }[]> {
    const db = await this.dbPromise;
    return await db.getAll('files');
  }

  async getFile(name: string) {
    const db = await this.dbPromise;
    return await db.get('files', name);
  }

  async deleteFile(name: string) {
    const db = await this.dbPromise;
    await db.delete('files', name);
  }

  async clearAll() {
    const db = await this.dbPromise;
    await db.clear('files');
  }
}
