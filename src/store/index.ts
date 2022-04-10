import { makeAutoObservable, computed } from 'mobx';

type ClientConstructor = { number: number; limit: number };

export class ClientStore {
  number: number;
  limit: number = 0;
  createdAt: Date;
  startedAt?: Date;
  stoppedAt?: Date;
  currentTime: CurrentTimeStore;

  constructor({ number, limit }: ClientConstructor, currentTime: CurrentTimeStore) {
    this.number = number;
    this.limit = limit;
    this.currentTime = currentTime;
    this.createdAt = new Date();
    makeAutoObservable(this);
  }

  get timeEnd() {
    return new Date(+(this.startedAt ?? this.currentTime.value) + this.limit * 1000);
  }

  get timeStart() {
    return this.startedAt ?? this.currentTime.value;
  }

  get timeLeft() {
    return Math.max(0, Math.round((+this.timeEnd - +this.currentTime.value) / 1000));
  }

  get isStarted() {
    return !!this.startedAt;
  }

  start() {
    if (this.startedAt) return;
    this.startedAt = new Date();
  }

  stop() {
    if (this.stoppedAt) return;
    this.stoppedAt = new Date();
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

export class Store {
  clients: Set<ClientStore> = new Set();
  currentTime: CurrentTimeStore = new CurrentTimeStore();

  constructor() {
    makeAutoObservable(this);
  }

  addClient(params: ClientConstructor) {
    this.clients.add(new ClientStore(params, this.currentTime));
  }

  removeClient(client: ClientStore) {
    this.clients.delete(client);
  }

  getClient(number: number) {
    return computed(() => [...this.clients].find((client) => client.number === number)).get();
  }
}
