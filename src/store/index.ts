import { makeAutoObservable, computed } from 'mobx';
import { db } from '../api/dexie';
import { ClientStore, ClientConstructor } from './ClientStore';
import { CurrentTimeStore } from './CurrentTimeStore';

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
    if (this.get(params.number)) {
      alert('Номер занят');
      return;
    }
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
    if (numbers[0] > 1) {
      this.clientNumberDialog = 1;
      return;
    }
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
