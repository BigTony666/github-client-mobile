import AsyncStorage from '@react-native-community/async-storage';
import { createResolver } from '../../../node_modules/jest-runtime';

export const FLAG_STORAGE = {flag_popular: 'popular', flag_trending: 'trending'};

export default class DataStore{

  _wrapData(data) {
    return {
      data: data,
      timestamp: new Date().getTime(),
    };
  }

  saveData(url, data, cb) {
    if(!url || !data) {
      return;
    }
    AsyncStorage.setItem(url, JSON.stringify(this._weapData(data)), cb);
  }

  fetchLocalData(url) {
    return new Promise((resolve, reject) => {
      AsyncStorage.getItem(url, (error, result) => {
        if(!error) {
          try{
            resolve(JSON.parse(result));
          } catch(e) {
            reject(e);
            console.error(e);
          }
        } else {
          reject(e);
          console.error(e);
        }
      })
    })
  }

  // Cache Strategy: try to fetch local data first, otherwise fetch from remote server
  fetchData(url, flag) {
    return new Promise((resolve, reject) => {
      this.fetchLocalData(url)
        .then((wrapData) => {
          if(wrapData && DataStore.checkTimestampValid(wrapData.timestamp)) {
            resolve(wrapData);
          } else {
            this.fetchNetData(url, flag)
              .then((data) => {
                resolve(this._wrapData(data));
              })
              .catch((error) => {
                reject(error);
              })
          }
        })
        .catch((error) => {
          this.fetchNetData(url, flag)
          .then((data) => {
            resolve(this._wrapData(data));
          })
          .catch((error) => {
            reject(error);
          })
        })
    })
  }

  fetchNetData(url, flag) {
    return new Promise((resolve, reject) => {
      if(flag != FLAG_STORAGE.flag_trending) {
        fetch(url)
          .then((response) => {
            if(response.ok) {
              return response.json();
            }
            throw new Error('Network response was not ok');
          })
          .then((responseData) => {
            this.saveData(url, responseData);
            resolve(responseData);
          })
          .catch((error) => {
            reject(error);
          })
      } else {
        // TODO: trending part
      }
    })
  }

  static checkTimestampValid(timestamp) {
    const currentDate = new Date();
    const targetDate = new Date();
    targetDate.setTime(timestamp);
    if(currentDate.getMonth() !== targetDate.getMonth() ||
       currentData.getDate() !== targetDate.getDate() ||
       currentDate.getHours() - targetDate.getHours() > 4){
        return false;
    } else {
      return true;
    }
  }
}