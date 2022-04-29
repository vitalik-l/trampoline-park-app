import { makeAutoObservable } from 'mobx';

export class CurrentTimeStore {
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
