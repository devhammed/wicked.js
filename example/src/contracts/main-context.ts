import { Context } from 'wicked.js';

export type MainContext = Context & {
  count: number;
  toggleText: string;
  interval: number | null;
  handleClick($event: PointerEvent): void;
  handleToggleCounting($event: PointerEvent): void;
};
