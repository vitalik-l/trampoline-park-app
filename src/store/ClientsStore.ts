import { ClientConstructor, ClientStore } from './ClientStore';
import { CurrentTimeStore } from './CurrentTimeStore';
import { computed, makeAutoObservable } from 'mobx';
import { db } from '../api/dexie';

export class ClientsStore {
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
    clients.forEach((client) => this.data.add(new ClientStore(client, this.currentTime)));
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
