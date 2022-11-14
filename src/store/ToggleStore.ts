import { makeAutoObservable } from 'mobx';

export class ToggleStore {
  isOpen: boolean = false;

  constructor() {
    makeAutoObservable(this);
  }

  toggle(value: boolean) {
    this.isOpen = value;
  }
}
