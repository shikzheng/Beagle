/**
 * Created by cristianfelix on 12/26/15.
 */
import { createStore, applyMiddleware } from 'redux';
import entry, {init} from './reducers';
import states from './config/states';
import React from 'react';
import _ from 'lodash';
import Immutable from 'immutable';

export default class Store {
    constructor() {
        this.currentState = Immutable.fromJS({});
        this.prevState = Immutable.fromJS({});
        this.subscribers = new Set();
        this.reducer = entry;
    }

    getState() {
        return this.currentState;
    }

    getPrevState() {
        return this.prevState;
    }

    async(promise, action) {
        promise.then((result) => {
            //console.group("ASYNC REDUCER", action(result).type);
            this.dispatch(action(result));
            //console.groupEnd()
        }, (error) => {
            this.dispatch(action(undefined, error));
        });
    }

    dispatch(action) {

        try {
            //console.group("REDUCER", action.type);
            let newState = this.reducer(this.getState(), action, this.async.bind(this), this.prevState);
            this.prevState = this.getState();
            this.currentState = newState;
            for (let callback of this.subscribers) {
                callback(newState);
            }
            //console.groupEnd()
            return newState;
        } catch (ex) {
            console.error(ex);
        }

    }

    subscribe(callback) {
        this.subscribers.add(callback)
    }
}










