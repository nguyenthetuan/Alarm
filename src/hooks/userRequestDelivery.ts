import { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import * as RequestDeliveryAction from 'store/RequestDelivery';
import { RequestDeliverySelector } from 'store/RequestDelivery';
// import * as RequestDeloveryReducer from 'store/requestDelivery/Reducer';
import { IPage, IRequestActionPayload } from 'types';

import { API_ENDPOINT } from 'utils';
export const useRequestDelivery = () => {
  const dispatch = useDispatch();
  const listProductType = useSelector(
    RequestDeliverySelector.getAttrByKey('listProductType'),
  );
  const listDeliveryMethod = useSelector(
    RequestDeliverySelector.getAttrByKey('listDeliveryMethod'),
  );
  const listAddon = useSelector(
    RequestDeliverySelector.getAttrByKey('listAddon'),
  );
  const distance = useSelector(
    RequestDeliverySelector.getAttrByKey('distance'),
  );
  const delivery = useSelector(
    RequestDeliverySelector.getAttrByKey('delivery'),
  );
  const oderDetail = useSelector(
    RequestDeliverySelector.getAttrByKey('oderDetail'),
  );
  const getListProductType = useCallback(
    ({ ...rest }: IPage, cb?: IRequestActionPayload['callback']) => {
      dispatch(
        RequestDeliveryAction.getBaseActionsRequest(
          {
            dataKey: 'listProductType',
            endPoint: API_ENDPOINT.REQUESTDELIVERY.GET_PRODUCT_TYPE,
            isPaginate: true,
          },
          cb,
        ),
      );
    },
    [dispatch],
  );

  const getListDeliveryMethod = useCallback(
    ({ ...rest }: IPage, cb?: IRequestActionPayload['callback']) => {
      dispatch(
        RequestDeliveryAction.getBaseActionsRequest(
          {
            dataKey: 'listDeliveryMethod',
            endPoint: API_ENDPOINT.REQUESTDELIVERY.GET_DELIVERY_METHOD,
            isPaginate: true,
          },
          cb,
        ),
      );
    },
    [dispatch],
  );

  const getListAddon = useCallback(
    ({ ...rest }: IPage, cb?: IRequestActionPayload['callback']) => {
      dispatch(
        RequestDeliveryAction.getBaseActionsRequest(
          {
            dataKey: 'listAddon',
            endPoint: API_ENDPOINT.REQUESTDELIVERY.GET_ADDON,
            isPaginate: true,
          },
          cb,
        ),
      );
    },
    [dispatch],
  );

  const getOrderDetailByCode = useCallback(
    (orderCode: string, cb?: ICallback) => {
      dispatch(
        RequestDeliveryAction.getBaseActionsRequest(
          {
            dataKey: 'oderDetail',
            endPoint: `${API_ENDPOINT.REQUESTDELIVERY.GET_DETAIL_DELIVERY}/${orderCode}`,
          },
          cb,
        ),
      );
    },
    [dispatch],
  );
  const postRatingDriver = useCallback(
    (data: any, cb?: ICallback) => {
      dispatch(
        RequestDeliveryAction.postBaseActionsRequest(
          {
            endPoint: `${API_ENDPOINT.REQUESTDELIVERY.POST_RATING}/${data?.id}/evaluate`,
            formData: {
              rating: data.rating,
              review: data.review,
            },
          },
          cb,
        ),
      );
    },
    [dispatch],
  );
  const postDeliveryDistance = useCallback(
    (params: any, cb?: IRequestActionPayload['callback']) => {
      dispatch(
        RequestDeliveryAction.postBaseActionsRequest(
          {
            dataKey: 'distance',
            endPoint: API_ENDPOINT.REQUESTDELIVERY.POST_DELIVERY_FEE,
            formData: params,
          },
          cb,
        ),
      );
    },
    [dispatch],
  );
  const postDelivery = useCallback(
    (data: any, cb?: IRequestActionPayload['callback']) => {
      dispatch(
        RequestDeliveryAction.postBaseActionsRequest(
          {
            dataKey: 'delivery',
            endPoint: API_ENDPOINT.REQUESTDELIVERY.POST_DRLIVERY,
            isPaginate: true,
            formData: data,
          },
          cb,
        ),
      );
    },
    [dispatch],
  );
  const putDeleteDelivery = useCallback(
    (orderCode: string, cb?: IRequestActionPayload['callback']) => {
      dispatch(
        RequestDeliveryAction.putBaseActionsRequest(
          {
            dataKey: 'deleteDelivery',
            endPoint: `${API_ENDPOINT.REQUESTDELIVERY.POST_DRLIVERY}/${orderCode}/cancel`,
            isPaginate: true,
          },
          cb,
        ),
      );
    },
    [dispatch],
  );
  const keepFindDriverForOrderByCode = useCallback(
    (orderCode: string, cb?: ICallback) => {
      dispatch(
        RequestDeliveryAction.postBaseActionsRequest(
          {
            endPoint: `${API_ENDPOINT.REQUESTDELIVERY.POST_KEEP_FIND_DRRIVER}/${orderCode}/find-driver`,
            isPaginate: true,
          },
          cb,
        ),
      );
    },
    [dispatch],
  );
  return {
    getListProductType,
    getListDeliveryMethod,
    getListAddon,
    postDeliveryDistance,
    postDelivery,
    postRatingDriver,
    getOrderDetailByCode,
    putDeleteDelivery,
    keepFindDriverForOrderByCode,
    listProductType,
    listDeliveryMethod,
    listAddon,
    distance,
    delivery,
    oderDetail,
  };
};
