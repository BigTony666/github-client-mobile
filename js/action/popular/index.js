import Types from '../types'
import DataStore, { FLAG_STORAGE } from '../../expand/dao/DataStore';
import {handleData} from '../ActionUtil';

export function onRefreshPopular(storeName, url) {
  return dispatch => {
      dispatch({type: Types.POPULAR_REFRESH, storeName: storeName});
      let dataStore = new DataStore();
      dataStore.fetchData(url, FLAG_STORAGE.flag_popular) // async action
          .then(data => {
              handleData(Types.POPULAR_REFRESH_SUCCESS, dispatch, storeName, data)
          })
          .catch(error => {
              console.log(error);
              dispatch({
                  type: Types.POPULAR_REFRESH_FAIL,
                  storeName,
                  error
              });
          })
  }
}