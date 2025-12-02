import { createContext } from 'react';
import { RootStore } from './RootStore';

export const rootStore = new RootStore();
export const Store = createContext<RootStore>(rootStore);
