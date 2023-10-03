import { useCallback, useRef, useState } from 'react';
import {
  IFood,
  IListVehicleParams,
  IResponse,
  IListNotificationParams,
} from 'types';
import { useHome } from './useHome';
import { PAGING } from 'utils';
import { useAuth } from './useAuth';
export const useNotification = () => {
  const { getListNotifications } = useHome();
  const { userInfo } = useAuth();
  const [listNotificationData, setListNotificationData] = useState<IFood[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const page = useRef(1);
  const haveMore = useRef(true);

  // list food
  const fetchListNotification = useCallback(() => {
    setIsLoading(true);
    getListNotifications(
      {
        page: page.current,
        limit: PAGING.LIMIT,
        user_id: userInfo.id,
      } as IListNotificationParams,
      handleFetchFoodDataSuccess,
    );
  }, [getListNotifications]);

  const fetchNotificaitonData = useCallback(() => {
    if (haveMore.current && !isLoading) {
      fetchListNotification();
    }
  }, [fetchListNotification, isLoading]);

  const refreshNotificationData = useCallback(() => {
    if (!isLoading) {
      setListNotificationData([]);
      page.current = 1;
      haveMore.current = true;
      fetchListNotification();
    }
  }, [fetchListNotification, isLoading]);

  const handleFetchFoodDataSuccess = (result: IResponse) => {
    setIsLoading(false);
    switch (result.status) {
      case 200:
        if (result.data) {
          if (Array.isArray(result.data.result)) {
            page.current += 1;
            setListNotificationData(state => [...state, ...result.data.result]);
            if (
              result.data.result.length === 0 ||
              result.data.result.length < PAGING.LIMIT
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
  };

  return {
    listNotificationData,
    fetchNotificaitonData,
    refreshNotificationData,
    isLoading,
  };
};
