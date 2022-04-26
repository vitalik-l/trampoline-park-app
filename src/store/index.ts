import { makeAutoObservable, computed } from 'mobx';
import { db } from '../api/dexie';

type ClientConstructor = {
  id?: number;
  number: number;
  limit: number;
  name: string;
  comment?: string;
  startedAt?: Date;
  stoppedAt?: Date;
  createdAt?: Date;
};

export class ClientStore {
  id?: number;
  number: number;
  limit: number = 0;
  createdAt: Date;
  startedAt?: Date;
  stoppedAt?: Date;
  currentTime: CurrentTimeStore;
  name: string;
  comment?: string;

  constructor(
    { id, number, limit, name, comment, startedAt, stoppedAt, createdAt }: ClientConstructor,
    currentTime: CurrentTimeStore,
  ) {
    makeAutoObservable(this);
    this.id = id;
    this.number = number;
    this.limit = limit;
    this.currentTime = currentTime;
    this.createdAt = createdAt ?? new Date();
    this.stoppedAt = stoppedAt;
    this.startedAt = startedAt;
    this.name = name;
    this.comment = comment;
    this.saveToStorage();
  }

  get limitSeconds() {
    return this.limit * 60;
  }

  get timeEnd() {
    return new Date(+(this.startedAt ?? this.currentTime.value) + this.limitSeconds * 1000);
  }

  get timeStart() {
    return this.startedAt ?? this.currentTime.value;
  }

  get timeLeft() {
    return Math.max(
      0,
      Math.min(this.limitSeconds, Math.round((+this.timeEnd - +this.currentTime.value) / 1000)),
    );
  }

  get isStarted() {
    return !!this.startedAt;
  }

  get isFinished() {
    return this.progress >= 100;
  }

  get progress() {
    return 100 - (this.timeLeft * 100) / this.limitSeconds;
  }

  setId(value: number) {
    this.id = value;
  }

  start() {
    if (this.startedAt) return;
    this.startedAt = new Date();
    this.saveToStorage();
  }

  stop() {
    if (this.stoppedAt) return;
    if (confirm('Удалить запись?')) {
      this.stoppedAt = new Date();
      this.saveToStorage().catch(console.error);
    }
  }

  save(params: Partial<ClientConstructor>) {
    if (params.name) {
      this.name = params.name;
    }
    this.comment = params.comment;
    if (params.limit) {
      this.limit = params.limit;
    }
    this.saveToStorage();
  }

  async saveToStorage() {
    if (!this.id) {
      const id = await db.clients.add(this);
      this.setId(id);
      return;
    }
    db.clients.update(this.id, {
      number: this.number,
      createdAt: this.createdAt,
      limit: this.limit,
      comment: this.comment,
      name: this.name,
      startedAt: this.startedAt,
      stoppedAt: this.stoppedAt,
    });
  }
}

class CurrentTimeStore {
  value: Date = new Date();

  constructor() {
    makeAutoObservable(this);
    setInterval(() => {
      this.setValue();
    }, 1000);
  }

  setValue() {
    this.value = new Date();
  }
}

class ClientsStore {
  isLoading: boolean = true;
  data: Set<ClientStore> = new Set();
  currentTime: CurrentTimeStore;

  constructor({ currentTime }: { currentTime: CurrentTimeStore }) {
    this.currentTime = currentTime;
    makeAutoObservable(this);
  }

  get dataArray() {
    return [...this.data];
  }

  async fetchData() {
    this.setIsLoading(true);
    const clients = await db.clients.filter((client) => !client.stoppedAt).toArray();
    clients.forEach((client) => this.add(client));
    this.setIsLoading(false);
  }

  setIsLoading(state: boolean) {
    this.isLoading = state;
  }

  add(params: ClientConstructor) {
    this.data.add(new ClientStore(params, this.currentTime));
  }

  remove(client: ClientStore) {
    client.stop();
    this.data.delete(client);
  }

  get(number: number) {
    return computed(() => this.dataArray.find((client) => client.number === number)).get();
  }
}

export class Store {
  clients: ClientsStore;
  currentTime: CurrentTimeStore = new CurrentTimeStore();
  clientNumberDialog: null | number = null;
  isHistoryOpen: boolean = false;

  constructor() {
    makeAutoObservable(this);
    this.clients = new ClientsStore({ currentTime: this.currentTime });
    this.clients.fetchData().catch(console.error);
  }

  openClientDialog(number?: number) {
    if (number) {
      this.clientNumberDialog = number;
      return;
    }
    const numbers = [...this.clients.data].map((client) => client.number).sort((a, b) => a - b);
    const nextNumberIndex = numbers.findIndex((el, index, arr) => arr[index + 1] !== el + 1);
    this.clientNumberDialog = nextNumberIndex === -1 ? 1 : numbers[nextNumberIndex] + 1;
  }

  closeClientDialog() {
    this.clientNumberDialog = null;
  }

  setOpenHistory(value: boolean) {
    this.isHistoryOpen = value;
  }
}
