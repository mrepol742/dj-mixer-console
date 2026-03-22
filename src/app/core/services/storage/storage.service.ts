import { Injectable } from '@angular/core';
import { openDB, IDBPDatabase } from 'idb';
import { Storage, Track } from './storage.types';
import { Library } from '../player-control/player-control.types';

@Injectable({
  providedIn: 'root',
})
export class StorageService {
  private dbPromise!: Promise<IDBPDatabase<Storage>>;

  constructor() {
    this.initDB();
  }

  private initDB() {
    this.dbPromise = openDB<Storage>('offline-storage', 1, {
      upgrade(db) {
        const store = db.createObjectStore('files', { keyPath: 'name' });
        store.createIndex('by-name', 'name');
      },
    });
  }

  async saveFile(file: File, metadata: Library) {
    const db = await this.dbPromise;
    await db.put('files', {
      name: file.name,
      data: file,
      type: file.type,
      metadata,
    });
  }

  async getAllFiles(): Promise<Track[]> {
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
