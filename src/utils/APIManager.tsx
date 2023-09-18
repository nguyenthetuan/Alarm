import axiosClient from './axios';
import { API_ENDPOINT } from './endpoint';

export function getWalletProfileAPI(id: string) {
  return axiosClient.get(`${API_ENDPOINT.WALLET_HISTORY}/${id}`);
}

export function postDrawCashWalletAPI(body: any) {
  return axiosClient.post(`${API_ENDPOINT.WALLET_HISTORY}`, body);
}

export function getHistoryWalletAPI(params: any) {
  return axiosClient.get(
    `${API_ENDPOINT.WALLET_HISTORY}?limit=${params?.limit}&page=${params?.page}&tus=true&first=${params?.startDate}&end=${params?.endDate}&user_id=${params?.user_id}`,
  );
}
