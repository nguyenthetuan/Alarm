import { IRequestActionPayload } from 'types';

export const RequestDeliveryAction = {
  GET_LIST_PRODUCT_TYPE: 'GET_LIST_PRODUCT_TYPE',
  GET_LIST_DELIVERY_METHOD: 'GET_LIST_DELIVERY_METHOD',
  GET_LIST_ADDON: 'GET_LIST_ADDON',
  POST_DELIVERY_DISTANCE: 'POST_DELIVERY_DISTANCE',
  POST_DELIVERY: 'POST_DELIVERY',
};

export const getBaseActionsRequest = (
  payload: IRequestActionPayload['payload'],
  callback?: IRequestActionPayload['callback'],
) => ({
  payload,
  type: payload?.type || RequestDeliveryAction.GET_LIST_PRODUCT_TYPE,
  callback,
});

export const postBaseActionsRequest = (
  payload: IRequestActionPayload['payload'],
  callback?: IRequestActionPayload['callback'],
) => ({
  payload,
  type: RequestDeliveryAction.POST_DELIVERY_DISTANCE,
  callback,
});
