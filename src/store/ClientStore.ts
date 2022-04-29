import { makeAutoObservable, toJS } from 'mobx';
import { db } from '../api/dexie';
import { CurrentTimeStore } from './CurrentTimeStore';

export enum ClientState {
  CREATED,
  IN_PROGRESS,
  PAUSED,
  FINISHED,
}

export type ClientConstructor = {
  id?: number;
  number: number;
  limit: number;
  name: string;
  comment?: string;
  startedAt?: Date;
  stoppedAt?: Date;
  createdAt?: Date;
  pauses?: Pauses;
};

export type Pause = { dateFrom?: Date; dateTo?: Date };

type Pauses = Pause[];

export class ClientStore {
  id?: number;
  number: number;
  limit: number = 0;
  pauses: Pauses;
  createdAt: Date;
  startedAt?: Date;
  stoppedAt?: Date;
  currentTime: CurrentTimeStore;
  name: string;
  comment?: string;

  constructor(
    {
      id,
      number,
      limit,
      name,
      comment,
      startedAt,
      stoppedAt,
      createdAt,
      pauses,
    }: ClientConstructor,
    currentTime: CurrentTimeStore,
  ) {
    makeAutoObservable(this);
    this.id = id;
    this.number = number;
    this.limit = limit;
    this.currentTime = currentTime;
    this.createdAt = createdAt ?? new Date();
    this.stoppedAt = stoppedAt;
    this.startedAt = startedAt;
    this.name = name;
    this.comment = comment;
    this.pauses = pauses ?? [];
    this.saveToStorage();
  }

  get state() {
    if (this.isPaused) return ClientState.PAUSED;
    if (this.isFinished) return ClientState.FINISHED;
    if (this.isStarted) return ClientState.IN_PROGRESS;
    return ClientState.CREATED;
  }

  get limitSeconds() {
    return this.limit * 60;
  }

  get pausedTotal() {
    return this.pauses.reduce((acc, curr) => {
      return Number(curr.dateTo ?? this.currentTime.value) - Number(curr.dateFrom) + acc;
    }, 0);
  }

  get pauseTime() {
    return this.pauses[this.pauses.length - 1]?.dateFrom;
  }

  get timeEnd() {
    return new Date(
      +(this.startedAt ?? this.currentTime.value) + (this.limitSeconds * 1000 + this.pausedTotal),
    );
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

  get isPaused() {
    const lastPause = this.pauses[this.pauses.length - 1];
    return !!lastPause?.dateFrom && !lastPause?.dateTo;
  }

  setId(value: number) {
    this.id = value;
  }

  togglePause() {
    const lastPause = this.pauses[this.pauses.length - 1];
    if (!lastPause || lastPause?.dateTo) {
      this.pauses.push({ dateFrom: new Date() });
    } else {
      lastPause.dateTo = new Date();
    }
    this.saveToStorage();
  }

  start() {
    if (this.startedAt) return;
    this.startedAt = new Date();
    this.saveToStorage();
  }

  stop() {
    if (this.stoppedAt) return;
    if (confirm('Удалить запись?')) {
      this.stoppedAt = new Date();
      this.saveToStorage().catch(console.error);
    }
  }

  save(params: Partial<ClientConstructor>) {
    if (params.name) {
      this.name = params.name;
    }
    this.comment = params.comment;
    if (params.limit) {
      this.limit = params.limit;
    }
    this.saveToStorage();
  }

  async saveToStorage() {
    if (!this.id) {
      const id = await db.clients.add(this);
      this.setId(id);
      return;
    }
    console.log('save to storage', this.id, {
      number: this.number,
      createdAt: this.createdAt,
      limit: this.limit,
      comment: this.comment,
      name: this.name,
      startedAt: this.startedAt,
      stoppedAt: this.stoppedAt,
      pauses: this.pauses,
    });
    db.clients
      .update(this.id, {
        number: this.number,
        createdAt: this.createdAt,
        limit: this.limit,
        comment: this.comment,
        name: this.name,
        startedAt: this.startedAt,
        stoppedAt: this.stoppedAt,
        pauses: toJS(this.pauses),
      })
      .catch((err) => {
        console.error(err);
      });
  }
}
