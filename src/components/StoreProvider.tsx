import React from 'react';
import { Store } from '../store';

export const StoreContext = React.createContext(new Store());

export const useStore = () => React.useContext(StoreContext);
