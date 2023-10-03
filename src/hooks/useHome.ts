import { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import * as HomeActions from 'store/home';
import { HomeSelectors } from 'store/home';
import {
  ICategory,
  IHomeActionPayload,
  IPromotion,
  ISuggestRestaurant,
  IPage,
} from 'types';

import { API_ENDPOINT } from 'utils';
import { useLocation } from './useLocation';
export const useHome = () => {
  const dispatch = useDispatch();
  const { locationUser } = useLocation();
  const loading = useSelector(HomeSelectors.getLoading);
  const listCategories = useSelector(
    HomeSelectors.getAttrByKey('listCategories'),
  ) as ICategory[];
  const listPromotions = useSelector(
    HomeSelectors.getAttrByKey('listPromotions'),
  ) as IPromotion[];
  const listSuggests: null | { result: ISuggestRestaurant[] } = useSelector(
    HomeSelectors.getAttrByKey('listSuggests'),
  ) as any;
  const listRestaurantNearMe: null | { result: ISuggestRestaurant[] } =
    useSelector(HomeSelectors.getAttrByKey('listRestaurantNearMe')) as any;
  const getListCategories = useCallback(() => {
    dispatch(
      HomeActions.getBaseActionsRequest({
        dataKey: 'listCategories',
        endPoint: API_ENDPOINT.HOME.CATELOG,
      }),
    );
  }, [dispatch]);
  const getListPromotions = useCallback(
    (restaurantId?: string) => {
      dispatch(
        HomeActions.getBaseActionsRequest({
          dataKey: 'listPromotions',
          endPoint: API_ENDPOINT.HOME.PROMOTION,
          params: {
            restaurantId,
          },
        }),
      );
    },
    [dispatch],
  );
  const reloadSuggestHome = useCallback(
    (limit = 4) => {
      dispatch(
        HomeActions.getBaseActionsRequest({
          dataKey: 'listSuggests',
          endPoint: API_ENDPOINT.HOME.SUGGEST_RESTAURANTS,
          // endPoint: API_ENDPOINT.CATEGORY.RESTAURANT,
          isPaginate: true,
          params: {
            page: 1,
            limit,
            ...locationUser,
          },
        }),
      );
    },
    [locationUser, dispatch],
  );
  const getListSuggests = useCallback(
    (page = 1, limit = 10, cb?: IHomeActionPayload['callback']) => {
      dispatch(
        HomeActions.getBaseActionsRequest(
          {
            endPoint: API_ENDPOINT.HOME.SUGGEST_RESTAURANTS,
            // endPoint: API_ENDPOINT.CATEGORY.RESTAURANT,
            isPaginate: true,
            params: {
              page,
              limit,
              ...locationUser,
            },
          },
          cb,
        ),
      );
    },
    [locationUser, dispatch],
  );

  const getRestaurantNearMe = useCallback(
    ({ ...rest }: IPage, cb?: IHomeActionPayload['callback']) => {
      dispatch(
        HomeActions.getBaseActionsRequest(
          {
            dataKey: 'listRestaurantNearMe',
            endPoint: API_ENDPOINT.HOME.GET_RESTAURANTS_NEAR_ME,
            isPaginate: true,
            params: {
              ...locationUser,
            },
          },
          cb,
        ),
      );
    },
    [dispatch, locationUser],
  );
  const onFCMToken = useCallback(
    async (formData: any, userId, callback: (error: string) => void) => {
      dispatch(
        HomeActions.postBaseActionsRequest(
          {
            formData,
            endPoint: `${API_ENDPOINT.AUTH.ON_FCM_TOKEN}/${userId}`,
            type: HomeActions.HomeActions.POST_BASE_FCMTOKEN,
          },
          () => {},
        ),
      );
    },
    [dispatch],
  );

  const getListNotifications = useCallback(
    ({ ...rest }: any, cb?: IHomeActionPayload['callback']) => {
      dispatch(
        HomeActions.getBaseActionsRequest(
          {
            endPoint: API_ENDPOINT.HOME.NOTIFICATION_GET_ALL,
            params: { ...rest },
            dataKey: 'listNotification',
            type: HomeActions.HomeActions.NOTIFICATION_GET_ALL,
          },
          cb,
        ),
      );
    },
    [],
  );
  return {
    loading,
    listCategories,
    listPromotions,
    listRestaurantNearMe,
    listSuggests:
      listSuggests && listSuggests.result ? listSuggests.result : [],
    reloadSuggestHome,
    getListCategories,
    getListPromotions,
    getListSuggests,
    getRestaurantNearMe,
    onFCMToken,
    getListNotifications,
  };
};
