import { useCallback, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { OrdersSelectors } from 'store/orders';
import * as OrdersActions from 'store/orders';
import {
  IBookTaxiRequest,
  ICallback,
  IListOrderItem,
  IOrderRequest,
  IResponse,
  OrderStatus,
} from 'types';
import { API_ENDPOINT, PAGING } from 'utils';
import { useLocation } from './useLocation';
export const useOrders = () => {
  const [fetchCreateOrder, { isLoading: isLoadingCreateOrder }] =
    OrdersActions.OrderQuery.useCreateOrderMutation();

  const dispatch = useDispatch();
  const { locationUser } = useLocation();
  const loading = useSelector(OrdersSelectors.getLoading);
  const getOrderDetailByCode = useCallback(
    (orderCode: string, cb?: ICallback) => {
      dispatch(
        OrdersActions.getBaseActionsRequest(
          {
            endPoint: API_ENDPOINT.ORDER.DETAIL,
            params: {
              orderCode,
            },
          },
          cb,
        ),
      );
    },
    [dispatch, locationUser],
  );

  const getFoodDetailByCode = useCallback(
    (foodCode: string, cb?: ICallback) => {
      dispatch(
        OrdersActions.getBaseActionsRequest(
          {
            endPoint: `${API_ENDPOINT.ORDER.GET_FOOD_DETAIL}/${foodCode}`,
          },
          cb,
        ),
      );
    },
    [dispatch, locationUser],
  );

  const onCancelOrderByCode = useCallback(
    (orderCode: string, cb?: ICallback) => {
      dispatch(
        OrdersActions.postBaseActionsRequest(
          {
            endPoint: `${API_ENDPOINT.ORDER.CANCEL}/${orderCode}/cancel`,
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
        OrdersActions.postBaseActionsRequest(
          {
            endPoint: `${API_ENDPOINT.ORDER.KEEP_FIND_DRIVER}/${orderCode}/find-driver`,
          },
          cb,
        ),
      );
    },
    [dispatch],
  );

  const getInfoTaxiService = useCallback(
    (data: IBookTaxiRequest, cb?: ICallback) => {
      dispatch(
        OrdersActions.postBaseActionsRequest(
          {
            endPoint: `${API_ENDPOINT.MOTORCYCLE_TAXI.PRE_CREATE}`,
            formData: data,
          },
          cb,
        ),
      );
    },
    [dispatch],
  );
  const onCalculate = useCallback(
    (data: { shippingTypeId: string } & IOrderRequest, cb?: ICallback) => {
      dispatch(
        OrdersActions.postBaseActionsRequest(
          {
            endPoint: `${API_ENDPOINT.ORDER.CALCULATE}`,
            formData: data,
          },
          cb,
        ),
      );
    },
    [dispatch],
  );

  const findCarAction = useCallback(
    (data: IBookTaxiRequest, cb?: ICallback) => {
      dispatch(
        OrdersActions.postBaseActionsRequest(
          {
            endPoint: `${API_ENDPOINT.MOTORCYCLE_TAXI.CREATE}`,
            formData: data,
          },
          cb,
        ),
      );
    },
    [dispatch],
  );
  const cancleFindDriver = useCallback(
    (data: any, cb?: ICallback) => {
      dispatch(
        OrdersActions.postBaseActionsRequest(
          {
            endPoint: `${API_ENDPOINT.MOTORCYCLE_TAXI.CANCEL}/${data.id}/cancelled`,
          },
          cb,
        ),
      );
    },
    [dispatch],
  );

  const ratingDriver = useCallback(
    (data: any, cb?: ICallback) => {
      dispatch(
        OrdersActions.postBaseActionsRequest(
          {
            endPoint: `${API_ENDPOINT.MOTORCYCLE_TAXI.CANCEL}/${data?.id}/evaluate`,
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

  const postRatingDiliveryFood = useCallback(
    (data: any, cb?: ICallback) => {
      dispatch(
        OrdersActions.postBaseActionsRequest(
          {
            endPoint: `${API_ENDPOINT.CATEGORY.POST_RATING}/${data?.id}/evaluate`,
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
  const getDriverLocationByDriverId = useCallback(
    (driverId: string, cb?: ICallback) => {
      dispatch(
        OrdersActions.getBaseActionsRequest(
          {
            endPoint: `${API_ENDPOINT.PUBLIC.DRIVER_LOCATION}/${driverId}/location`,
          },
          cb,
        ),
      );
    },
    [dispatch],
  );

  return {
    loading,
    createOrder: fetchCreateOrder,
    getOrderDetailByCode,
    onCancelOrderByCode,
    getFoodDetailByCode,
    keepFindDriverForOrderByCode,
    getInfoTaxiService,
    findCarAction,
    cancleFindDriver,
    onCalculate,
    ratingDriver,
    getDriverLocationByDriverId,
    postRatingDiliveryFood,
  };
};

export const useListOrder = ({
  limit = PAGING.LIMIT,
  customerCatalogId,
  status,
  type,
}: {
  limit?: number;
  customerCatalogId: string;
  status: OrderStatus[];
  type: string;
}) => {
  const dispatch = useDispatch();
  const [listData, setListData] = useState<IListOrderItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const page = useRef(1);
  const haveMore = useRef(true);

  const getList = useCallback(
    (data, cb?: ICallback) => {
      const endPoint =
        type === 'MOTORBIKE_BOOKING'
          ? API_ENDPOINT.ORDER.MOTORCYCLE_TAXI
          : type === 'FOOD'
          ? API_ENDPOINT.ORDER.GET_ORDER_LIST
          : type === 'DELIVERY'
          ? API_ENDPOINT.ORDER.GET_DELIVERY_LIST
          : type === 'DELIVERY_NATIONWIDE'
          ? API_ENDPOINT.ORDER.GET_DELIVERY_PROVINCE_LIST
          : type === 'CAR_BOOKING'
          ? API_ENDPOINT.ORDER.CAR_TAXI
          : '';

      const _data =
        type === 'MOTORBIKE_BOOKING'
          ? {}
          : type === 'DELIVERY' || type === 'DELIVERY_NATIONWIDE'
          ? { page: data.page, limit: data.limit, status: data.status }
          : type === 'CAR_BOOKING'
          ? {}
          : data;
      dispatch(
        OrdersActions.getBaseActionsRequest(
          {
            endPoint: endPoint,
            params: _data,
          },
          cb,
        ),
      );
    },
    [dispatch],
  );

  const fetchData = useCallback(() => {
    if (haveMore.current && !isLoading) {
      setIsLoading(true);
      getList(
        {
          page: page.current,
          limit,
          status,
          customerCatalogId,
        },
        handleFetchDataSuccess,
      );
    }
  }, [isLoading, customerCatalogId, page, limit, status]);

  const refreshData = useCallback(() => {
    setListData([]);
    page.current = 1;
    haveMore.current = true;
  }, []);

  const handleFetchDataSuccess = (result: IResponse) => {
    switch (result.status) {
      case 200:
        if (result.data) {
          if (Array.isArray(result.data.result)) {
            page.current += 1;
            setListData(state => [...state, ...result.data.result]);
            if (
              result.data.result.length === 0 ||
              result.data.result.length < limit
            ) {
              haveMore.current = false;
            }
          } else {
            haveMore.current = false;
          }
        }
        break;

      default:
        haveMore.current = false;
        break;
    }
    setIsLoading(false);
  };

  return {
    listData,
    fetchData,
    refreshData,
    isLoading,
  };
};
