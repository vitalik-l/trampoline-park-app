import { makeAutoObservable, computed } from 'mobx';

type ClientConstructor = { number: number; limit: number; name: string; comment?: string };

export class ClientStore {
  number: number;
  limit: number = 0;
  createdAt: Date;
  startedAt?: Date;
  stoppedAt?: Date;
  currentTime: CurrentTimeStore;
  name: string;
  comment?: string;

  constructor({ number, limit, name, comment }: ClientConstructor, currentTime: CurrentTimeStore) {
    this.number = number;
    this.limit = limit;
    this.currentTime = currentTime;
    this.createdAt = new Date();
    this.name = name;
    this.comment = comment;
    makeAutoObservable(this);
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

  start() {
    if (this.startedAt) return;
    this.startedAt = new Date();
  }

  stop() {
    if (this.stoppedAt) return;
    this.stoppedAt = new Date();
  }

  save(params: Partial<ClientConstructor>) {
    if (params.name) {
      this.name = params.name;
    }
    this.comment = params.comment;
    if (params.limit) {
      this.limit = params.limit;
    }
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
  clientNumberDialog: null | number = null;

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

  openClientDialog(number?: number) {
    if (number) {
      this.clientNumberDialog = number;
      return;
    }
    const numbers = [...this.clients].map((client) => client.number).sort((a, b) => a - b);
    const nextNumberIndex = numbers.findIndex((el, index, arr) => arr[index + 1] !== el + 1);
    return numbers[nextNumberIndex] + 1;
  }

  closeClientDialog() {
    this.clientNumberDialog = null;
  }
}
