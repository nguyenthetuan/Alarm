import { IHomeActionPayload } from 'types';

export const HomeActions = {
  GET_LIST_CATEGORY: 'GET_LIST_CATEGORY',
  GET_LIST_PROMOTION: 'GET_LIST_PROMOTION',
  GET_LIST_SUGGESTION: 'GET_LIST_SUGGESTION',
  GET_LIST_RESTAURANT_NEAR_ME: 'GET_LIST_RESTAURANT_NEAR_ME',
  POST_BASE_FCMTOKEN: 'POST_BASE_FCMTOKEN',
  NOTIFICATION_GET_ALL: 'NOTIFICATION_GET_ALL',
};

export const getBaseActionsRequest = (
  payload: IHomeActionPayload['payload'],
  callback?: IHomeActionPayload['callback'],
) => ({
  payload,
  type: payload?.type || HomeActions.GET_LIST_CATEGORY,
  callback,
});

export const postBaseActionsRequest = (
  payload: IHomeActionPayload['payload'],
  callback?: IHomeActionPayload['callback'],
) => ({
  payload,
  type: HomeActions.POST_BASE_FCMTOKEN,
  callback,
});
