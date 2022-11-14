import { makeAutoObservable } from 'mobx';
import { CurrentTimeStore } from './CurrentTimeStore';
import { ClientsStore } from './ClientsStore';
import { ClientDialogStore } from './ClientDialogStore';
import { ToggleStore } from './ToggleStore';

export class Store {
  clients: ClientsStore;
  clientDialog: ClientDialogStore;
  currentTime = new CurrentTimeStore();
  historyDialog = new ToggleStore();

  constructor() {
    this.clients = new ClientsStore({ currentTime: this.currentTime });
    this.clientDialog = new ClientDialogStore(this.clients);
    this.clients.fetchData().catch(console.error);
  }
}
