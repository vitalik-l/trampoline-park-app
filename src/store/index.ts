import { observable, makeAutoObservable, computed } from 'mobx';

type ClientConstructor = { number: number; limit: number };

export class ClientStore {
  number: number;
  limit: number = 0;
  counter: number = 0;
  startedAt: Date = new Date();
  interval?: number;

  constructor({ number, limit }: ClientConstructor) {
    this.number = number;
    this.limit = limit;
    this.counter = limit;
    makeAutoObservable(this);
  }

  get started() {
    return !!this.interval;
  }

  setCounter(value: number) {
    if (this.counter <= 0) {
      this.stop();
      return;
    }
    this.counter = value;
  }

  start() {
    this.interval = setInterval(() => {
      this.setCounter(this.counter - 1);
    }, 1000);
  }

  stop() {
    clearInterval(this.interval);
    this.interval = NaN;
  }
}

export class Store {
  clients: Set<ClientStore> = new Set();

  constructor() {
    makeAutoObservable(this);
  }

  addClient(params: ClientConstructor) {
    this.clients.add(new ClientStore(params));
  }

  removeClient(client: ClientStore) {
    this.clients.delete(client);
  }

  getClient(number: number) {
    return computed(() => [...this.clients].find((client) => client.number === number)).get();
  }
}
