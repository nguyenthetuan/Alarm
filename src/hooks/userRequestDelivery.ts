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
  const getListProductType = useCallback(
    ({ ...rest }: IPage, cb?: IRequestActionPayload['callback']) => {
      console.log('rest', rest);
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
      console.log('rest', rest);
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
      console.log('rest', rest);
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
        RequestDeliveryAction.getBaseActionsRequest(
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

  return {
    getListProductType,
    getListDeliveryMethod,
    getListAddon,
    postDeliveryDistance,
    postDelivery,
    listProductType,
    listDeliveryMethod,
    listAddon,
    distance,
  };
};
