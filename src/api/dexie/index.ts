import Dexie, { Table } from 'dexie';

type Client = {
  number: number;
  name: string;
  limit: number;
  stoppedAt?: Date;
  createdAt?: Date;
  comment?: string;
  startedAt?: Date;
};

class MonkeyDatabase extends Dexie {
  public clients!: Table<Client, number>;

  constructor() {
    super('MonkeyDatabase');
    this.version(1).stores({
      clients: '++id,number,stoppedAt,name,limit',
    });
  }
}

export const db = new MonkeyDatabase();
