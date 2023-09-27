import { useCallback, useRef, useState } from 'react';
import { IFood, IListVehicleParams, IResponse } from 'types';
import { useVehicleRental } from './useVehicleRental';
import { PAGING } from 'utils';

export const useListVehicle = () => {
  const { getListVehicles } = useVehicleRental();
  const [listVehicleData, setListVehicleData] = useState<IFood[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const page = useRef(1);
  const haveMore = useRef(true);

  // list food
  const fetchListVehicle = useCallback(
    (GarageId?: string, vehicleId?: string) => {
      setIsLoading(true);
      getListVehicles(
        {
          page: page.current,
          limit: PAGING.LIMIT,
          vehicleCatalogId: vehicleId ?? '',
          garageId: GarageId,
        } as IListVehicleParams,
        handleFetchFoodDataSuccess,
      );
    },
    [getListVehicles],
  );

  const fetchVehicleData = useCallback(
    (GarageId?: string, vehicleId?: string) => {
      if (haveMore.current && !isLoading) {
        fetchListVehicle(GarageId, vehicleId);
      }
    },
    [fetchListVehicle, isLoading],
  );

  const refreshVehicleData = useCallback(
    (GarageId?: string, vehicleId?: string) => {
      if (!isLoading) {
        setListVehicleData([]);
        page.current = 1;
        haveMore.current = true;
        fetchListVehicle(GarageId, vehicleId);
      }
    },
    [fetchListVehicle, isLoading],
  );

  const handleFetchFoodDataSuccess = (result: IResponse) => {
    setIsLoading(false);
    switch (result.status) {
      case 200:
        if (result.data) {
          if (Array.isArray(result.data.result)) {
            page.current += 1;
            setListVehicleData(state => [...state, ...result.data.result]);
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
    listVehicleData,
    fetchVehicleData,
    refreshVehicleData,
    isLoading,
  };
};
