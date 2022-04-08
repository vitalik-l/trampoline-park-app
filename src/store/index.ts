import { observable, makeAutoObservable } from 'mobx';

type ClientConstructor = { number: number };

export class ClientStore {
  number: number;

  constructor({ number }: ClientConstructor) {
    this.number = number;
    makeAutoObservable(this);
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
}
