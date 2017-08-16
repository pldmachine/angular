import { AppState } from 'app/app.state';
import { counterReducer as reducer } from './counter-reducer';
import { Store, createStore, compose, StoreEnhancer } from 'redux';
import { InjectionToken } from '@angular/core';

const devtools: StoreEnhancer<AppState> =
  window['devToolsExtension'] ?
  window['devToolsExtension']() : f => f;

export const AppStore = new InjectionToken('App.store');

export function createAppStore(): Store<AppState> {
    return createStore<AppState>(
        reducer, compose(devtools)
    );
}

export const appStoreProviders = [
   { provide: AppStore, useFactory: createAppStore }
];

