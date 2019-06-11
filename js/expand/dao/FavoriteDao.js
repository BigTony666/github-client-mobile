import {
  AsyncStorage
} from 'react-native';
import { resolve } from 'path';

const FAVORITE_KEY_PREFIX = 'favorite_';

export default class FavoriteDao {
  constructor(flag) {
    this.favoriteKey = FAVORITE_KEY_PREFIX + flag;
  }

  /**
   * Save Favorite Item
   * @param {String} key 
   * @param {String} value 
   * @param {Function} callback 
   */
  saveFavoriteItem(key, value, callback) {
    AsyncStorage.setItem(key, value, (error, result) => {
      if (!error) {
        this.updateFavoriteKeys(key, true);
      }
    });
  }

  /**
   * Update Favorite Key set
   * @param {string} key 
   * @param {boolean} isAdd, true to add, false to delete
   */
  updateFavoriteKeys(key, isAdd) {
    AsyncStorage.getItem(this.favoriteKey, (error, result) => {
      if (!error) {
        let favoriteKeys = [];
        if (result) {
          favoriteKeys = JSON.parse(result);
        }
        let index = favoriteKeys.indexOf(key);
        if (isAdd) {
          if (index === -1) favoriteKeys.push(key);
        } else {
          if (index !== -1) favoriteKeys.splice(index, 1);
        }
        AsyncStorage.setItem(this.favoriteKey, JSON.stringify(favoriteKeys));
      }
    });
  }

  /**
   * Get All Favorite keys
   * @return {Promise}
   */
  getFavoriteKeys() {
    return new Promise((resolve, reject) => {
      AsyncStorage.getItem(this.favoriteKey, (error, result) => {
        if (!error) {
          try {
            resolve(JSON.parse(result));
          } catch (e) {
            reject(error);
          }
        } else {
          reject(error);
        }
      });
    });
  }

  /**
   * Unlike favorite item, update favorite set
   * @param {String} key 
   */
  removeFavoriteItem(key) {
    AsyncStorage.removeItem(key, (error, result) => {
      if (!error) {
        this.updateFavoriteKeys(key, false);
      }
    });
  }

  /**
   * Get All Favorite Items
   * @return {Promise}
   */
  getAllItems() {
    return new Promise((resolve, reject) => {
      this.getFavoriteKeys().then((keys) => {
        let items = [];
        if (keys) {
          AsyncStorage.multiGet(keys, (err, stores) => {
            try {
              stores.map((result, i, store) => {
                // get at each store's key/value so you can work with it
                let key = store[i][0];
                let value = store[i][1];
                if (value) items.push(JSON.parse(value));
              });
              resolve(items);
            } catch (e) {
              reject(e);
            }
          });
        } else {
          resolve(items);
        }
      }).catch((e) => {
        reject(e);
      })
    })
  }
}