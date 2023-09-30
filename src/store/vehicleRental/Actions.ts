import { IHomeActionPayload } from 'types';

export const VehicleRentalActions = {
  GET_LIST_GARAGE: 'GET_LIST_GARAGE',
  GET_DETAIL_GARAGE: 'GET_DETAIL_GARAGE',
  GET_LIST_VEHICLE: 'GET_LIST_VEHICLE',
  GET_LIST_CATALOG_VEHICLE: 'GET_LIST_CATALOG_VEHICLE',
  GET_LIST_EXTRA_VEHICLE: 'GET_LIST_EXTRA_VEHICLE',
  POST_ODER_VEHICLE: 'POST_ODER_VEHICLE',
  GET_LIST_DISCOUNT_VEHICLE: 'GET_LIST_DISCOUNT_VEHICLE',
};

export const getBaseActionsRequest = (
  payload: IHomeActionPayload['payload'],
  callback?: IHomeActionPayload['callback'],
) => ({
  payload,
  type: payload?.type || VehicleRentalActions.GET_LIST_GARAGE,
  callback,
});

export const postBaseActionsRequest = (
  payload: IHomeActionPayload['payload'],
  callback?: IHomeActionPayload['callback'],
) => ({
  payload,
  type: VehicleRentalActions.POST_ODER_VEHICLE,
  callback,
});
