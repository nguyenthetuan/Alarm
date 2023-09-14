import { IRequestActionPayload } from 'types';

export const RequestDeliveryAction = {
  GET_LIST_PRODUCT_TYPE: 'GET_LIST_PRODUCT_TYPE',
  GET_LIST_DELIVERY_METHOD: 'GET_LIST_DELIVERY_METHOD',
  GET_LIST_ADDON: 'GET_LIST_ADDON',
  GET_DETAIL_DELIVERY: 'GET_DETAIL_DELIVERY',
  POST_DELIVERY_DISTANCE: 'POST_DELIVERY_DISTANCE',
  POST_DELIVERY: 'POST_DELIVERY',
  POST_RATING: 'POST_RATING',
  PUT_CANCEL_DELIVERY: 'PUT_CANCEL_DELIVERY',
  POST_KEEP_FIND_DRIVER: 'POST_KEEP_FIND_DRIVER',
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
  type: payload?.type || RequestDeliveryAction.POST_DELIVERY_DISTANCE,
  callback,
});

export const putBaseActionsRequest = (
  payload: IRequestActionPayload['payload'],
  callback?: IRequestActionPayload['callback'],
) => ({
  payload,
  type: payload?.type || RequestDeliveryAction.PUT_CANCEL_DELIVERY,
  callback,
});
