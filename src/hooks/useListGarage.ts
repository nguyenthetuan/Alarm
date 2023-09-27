import { useCallback, useRef, useState } from 'react';
import { IPage, IResponse, IRestaurantDetail } from 'types';
import { useVehicleRental } from './useVehicleRental';
import { PAGING } from 'utils';

export const useListGarage = () => {
  const { getListGarages } = useVehicleRental();
  const [listGaraData, setListData] = useState<IRestaurantDetail[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const page = useRef(1);
  const haveMore = useRef(true);

  const fetchListGarage = useCallback(
    (newSearch?: string) => {
      if (haveMore.current && !isLoading) {
        setIsLoading(true);
        getListGarages(
          {
            page: page.current,
            limit: PAGING.LIMIT,
            search: newSearch,
          } as IPage,
          handleFetchDataSuccess,
        );
      }
    },
    [isLoading],
  );

  const fetchGaraData = useCallback(
    (newSearch?: string) => {
      if (haveMore.current && !isLoading) {
        fetchListGarage(newSearch);
      }
    },
    [fetchListGarage, isLoading],
  );

  const refreshGaraData = useCallback(
    (newSearch?: string) => {
      if (!isLoading) {
        setListData([]);
        page.current = 1;
        haveMore.current = true;
        fetchListGarage(newSearch);
      }
    },
    [fetchListGarage, isLoading],
  );

  const handleFetchDataSuccess = (result: IResponse) => {
    switch (result.status) {
      case 200:
        if (result.data) {
          if (Array.isArray(result.data.result)) {
            page.current += 1;
            setListData(state => [...state, ...result.data.result]);
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
    setIsLoading(false);
  };

  return {
    listGaraData,
    fetchGaraData,
    refreshGaraData,
    isLoading,
  };
};
