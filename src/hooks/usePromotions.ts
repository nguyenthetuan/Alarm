import { useCallback, useEffect, useRef, useState } from 'react';
import { PromotionQuery } from 'store/promotions';
import { IPromotionListItem } from 'types';
export const usePromotionList = () => {
  //#region API
  const [fetch, { isLoading, data, error }] =
    PromotionQuery.useGetAllPromotionsMutation();
  //#endregion

  //#region Screen State
  const [listDataTable, setListDataTable] = useState<IPromotionListItem[]>([]);

  const [isRefreshing, setIsRefreshing] = useState(false);

  //#endregion

  //#region Ref value
  const fetchDataRunning = useRef<ReturnType<typeof fetch> | null>(null);
  //#endregion

  //#region Function
  const loadMore = useCallback(() => {
    if (!isLoading) {
      fetchDataRunning.current = fetch(null);
    }
  }, [isLoading, fetch]);

  /** Reset all value */
  const reset = useCallback(() => {
    setListDataTable([]);
  }, []);

  const refreshData = useCallback(() => {
    reset();
    setIsRefreshing(true);
    loadMore();
  }, [loadMore, reset]);
  //#endregion

  //#region Handle API status
  useEffect(() => {
    if (data) {
      switch (data.status) {
        case 200:
          {
            let fetchData = data?.data;

            if (
              Array.isArray(fetchData?.result) &&
              fetchData?.result.length > 0
            ) {
              const listData = fetchData?.result;
              setListDataTable(listData);
            } else {
              setListDataTable([]);
            }
          }
          break;

        default:
          setListDataTable([]);
          break;
      }
    }

    setIsRefreshing(false);
  }, [data]);

  useEffect(() => {
    if (error) {
      if ((error as any).name === 'AbortError') {
        refreshData();
      }
      setIsRefreshing(false);
    }
  }, [error]);
  //#endregion

  //#region Watch change
  //#endregion

  //#region Element view
  //#endregion

  return {
    listDataTable,
    isRefreshing,
    isLoading,
    refreshData,
  };
};
