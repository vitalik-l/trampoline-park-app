import { ClientsStore } from './ClientsStore';
import { makeAutoObservable } from 'mobx';

export class ClientDialogStore {
  clientNumber: null | number = null;

  constructor(private clients: ClientsStore) {
    makeAutoObservable(this);
  }

  open(number?: number) {
    if (number) {
      this.clientNumber = number;
      return;
    }
    const numbers = this.clients.dataArray.map((client) => client.number).sort((a, b) => a - b);
    if (numbers[0] > 1) {
      this.clientNumber = 1;
      return;
    }
    const nextNumberIndex = numbers.findIndex((el, index, arr) => arr[index + 1] !== el + 1);
    this.clientNumber = nextNumberIndex === -1 ? 1 : numbers[nextNumberIndex] + 1;
  }

  close() {
    this.clientNumber = null;
  }
}
