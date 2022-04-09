import { observable, makeAutoObservable, computed } from 'mobx';

type ClientConstructor = { number: number; limit: number };

export class ClientStore {
  number: number;
  limit: number = 0;
  counter: number = 0;
  startedAt?: Date;
  started: boolean = false;
  currentTime: CurrentTimeStore;

  constructor({ number, limit }: ClientConstructor, currentTime: CurrentTimeStore) {
    this.number = number;
    this.limit = limit;
    this.counter = limit;
    this.currentTime = currentTime;
    makeAutoObservable(this);
  }

  get timeEnd() {
    return new Date(+this.currentTime.value + this.counter * 1000);
  }

  start() {
    if (!this.startedAt) {
      this.startedAt = new Date();
    }
    this.started = true;
  }

  stop() {
    this.started = false;
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
