window.TLPropertyStore = {
  open() {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open('TLIngatlanIroda', 1);
      request.onupgradeneeded = () => request.result.createObjectStore('properties', { keyPath: 'id' });
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  },
  async save(property) {
    const db = await this.open();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction('properties', 'readwrite');
      transaction.objectStore('properties').put(property);
      transaction.oncomplete = () => { db.close(); resolve(); };
      transaction.onerror = () => { db.close(); reject(transaction.error); };
    });
  },
  async get(id) {
    const db = await this.open();
    return new Promise((resolve, reject) => {
      const request = db.transaction('properties', 'readonly').objectStore('properties').get(id);
      request.onsuccess = () => { db.close(); resolve(request.result); };
      request.onerror = () => { db.close(); reject(request.error); };
    });
  },
  async list() {
    const db = await this.open();
    return new Promise((resolve, reject) => {
      const request = db.transaction('properties', 'readonly').objectStore('properties').getAll();
      request.onsuccess = () => { db.close(); resolve(request.result.sort((a, b) => b.createdAt.localeCompare(a.createdAt))); };
      request.onerror = () => { db.close(); reject(request.error); };
    });
  }
};
