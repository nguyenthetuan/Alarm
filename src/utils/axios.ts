/** @format */

import { API_HOST } from '@env';
import axios from 'axios';
import { useKey } from 'hooks';
import { NavigationService, Routes } from 'navigation';
import { configStore } from 'store/createStore';
import { logoutRequest } from 'store/user';
import { KEY_CONTEXT } from './constants';
import { Toast } from 'react-native-toast-message/lib/src/Toast';
import { useDispatch } from 'react-redux';
import { Platform } from 'react-native';
import * as Keychain from 'react-native-keychain';

const config = {
  baseURL: API_HOST,
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  },
};
const axiosClient = axios.create(config);

axiosClient.interceptors.request.use(
  async (req: any) => {
    const { getKeyStore } = useKey();
    const token = await getKeyStore(KEY_CONTEXT.ACCESS_TOKEN);
    if (token && token !== 'undefined') {
      req.headers.Authorization = `Bearer ${token}`;
    }

    return req;
  },
  (err: any) => Promise.reject(err),
);

axiosClient.interceptors.response.use(
  (res: any) => Promise.resolve(res.data),
  async (err: any) => {
    if (err.response.status === 401) {
      const { store } = configStore();
      NavigationService.navigate(Routes.ModalScreen, {
        onPress: () => {
          store.dispatch(logoutRequest({ redirect: true }));
        },
      });
    } else if (err.response.status === 500) {
      Toast.show({
        text1: 'Có người lạ đăng nhập vào tài khoản.',
        position: 'top',
        type: 'error',
      });
      const { store } = configStore();
      const service = KEY_CONTEXT.ACCESS_TOKEN;
      await Keychain.setGenericPassword(service, 'undefined', {
        service,
        accessControl:
          Platform.OS === 'ios' ? null : Keychain.ACCESS_CONTROL?.USER_PRESENCE,
      });
      await Keychain.resetGenericPassword();
      store.dispatch(logoutRequest({ redirect: true }));
    }
    return Promise.reject(((err || {}).response || {}).data);
  },
);

export default axiosClient;
