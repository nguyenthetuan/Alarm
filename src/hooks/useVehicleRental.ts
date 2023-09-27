import { useCallback, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { CategoriesSelectors } from 'store/categories';
import * as VehicleRentalActions from 'store/vehicleRental';
import * as CategoriesReducer from 'store/categories/Reducer';
import {
  IExtraFood,
  IFood,
  IFoodCatalog,
  IHomeActionPayload,
  IListFoodParams,
  IPage,
  IPromotion,
  IRestaurantDetail,
} from 'types';

import { API_ENDPOINT, axiosClient } from 'utils';
import { useLocation } from 'hooks/useLocation';
import * as OrderVehicleQuery from 'store/vehicleRental';
// import { useLocation } from './useLocation';
export const useVehicleRental = () => {
  const [fetchCreateOrder, { isLoading: isLoadingCreateOrder }] =
    OrderVehicleQuery.OrderQuery.useCreateOrderMutation();
  const dispatch = useDispatch();
  const { locationUser } = useLocation();
  const loading = useSelector(CategoriesSelectors.getLoading);
  const listGarages: null | { result: IRestaurantDetail[] } = useSelector(
    CategoriesSelectors.getAttrByKey('listGarages'),
  ) as any;
  const detailGarage = useSelector(
    CategoriesSelectors.getAttrByKey('detailGarage'),
  ) as IRestaurantDetail;
  const listVehicleCatalog = useSelector(
    CategoriesSelectors.getAttrByKey('listVehicleCatalog'),
  ) as IFoodCatalog[];
  const listVehicles = useSelector(
    CategoriesSelectors.getAttrByKey('listVehicles'),
  ) as IFood[];
  const listExtraVehicle = useSelector(
    CategoriesSelectors.getAttrByKey('listExtraVehicle'),
  ) as IExtraFood;
  const selectedPromos = useSelector(
    CategoriesSelectors.getAttrByKey('selectedPromos'),
  ) as IPromotion[];

  const [estimatedPrice, setEstimatedPrice] = useState<any>();
  const onCalculate = useCallback(
    (data: { shippingTypeId: string } & IOrderRequest, cb?: ICallback) => {
      dispatch(
        VehicleRentalActions.postBaseActionsRequest(
          {
            endPoint: `${API_ENDPOINT.RENTAL_VEHICLE.CALCULATE_PRICE}`,
            formData: data,
          },
          cb,
        ),
      );
    },
    [dispatch],
  );
  const estimatePrices = useCallback(
    async (data: any) => {
      const result = await axiosClient.post(
        API_ENDPOINT.CATEGORY.CALCULATE_PRICE,
        data,
      );

      setEstimatedPrice(result);
    },
    [setEstimatedPrice],
  );

  const setSelectedPromos = useCallback(
    (selected: IPromotion[]) => {
      dispatch(
        CategoriesReducer.setSelectedPromos({ selectedPromos: selected }),
      );
    },
    [dispatch],
  );
  const getListGarages = useCallback(
    ({ ...rest }: IPage, cb?: IHomeActionPayload['callback']) => {
      dispatch(
        VehicleRentalActions.getBaseActionsRequest(
          {
            dataKey: 'listGarages',
            endPoint: API_ENDPOINT.RENTAL_VEHICLE.GARAGE,
            isPaginate: true,
            params: {
              // long: 106.64354939796388,
              // lat: 10.864089278331392,
              ...locationUser,
              ...rest,
            },
          },
          cb,
        ),
      );
    },
    [dispatch],
  );

  const getDetailGarage = useCallback(
    (garageId: string, cb) => {
      dispatch(
        VehicleRentalActions.getBaseActionsRequest(
          {
            dataKey: 'detailGarage',
            endPoint:
              API_ENDPOINT.RENTAL_VEHICLE.DETAIL_GARAGE + `/${garageId}`,
            isObject: true,
            type: VehicleRentalActions.VehicleRentalActions.GET_DETAIL_GARAGE,
          },
          cb,
        ),
      );
    },
    [dispatch],
  );

  const getListVehicleCatalog = useCallback((garageId: string) => {
    dispatch(
      VehicleRentalActions.getBaseActionsRequest({
        dataKey: 'listVehicleCatalog',
        endPoint:
          API_ENDPOINT.RENTAL_VEHICLE.LIST_VEHICLE_CATALOG + `/${garageId}`,
        type: VehicleRentalActions.VehicleRentalActions
          .GET_LIST_CATALOG_VEHICLE,
      }),
    );
  }, []);

  const getListVehicles = useCallback(
    ({ ...rest }: IListFoodParams, cb?: IHomeActionPayload['callback']) => {
      dispatch(
        VehicleRentalActions.getBaseActionsRequest(
          {
            endPoint: API_ENDPOINT.RENTAL_VEHICLE.LIST_VEHICLE,
            params: { ...rest },
            dataKey: 'listVehicles',
            type: VehicleRentalActions.VehicleRentalActions.GET_LIST_VEHICLE,
          },
          cb,
        ),
      );
    },
    [],
  );

  const getExtraVehicle = useCallback((garageId: string) => {
    dispatch(
      VehicleRentalActions.getBaseActionsRequest({
        endPoint: API_ENDPOINT.RENTAL_VEHICLE.EXTRA_VEHICLE + `/${garageId}`,
        dataKey: 'listExtraVehicle',
        isObject: true,
      }),
    );
  }, []);

  return {
    detailGarage,
    listVehicleCatalog,
    listVehicles,
    listExtraVehicle,
    listGarages: listGarages && listGarages?.result ? listGarages?.result : [],
    selectedPromos,
    loading,
    getListGarages,
    getDetailGarage,
    getListVehicleCatalog,
    getListVehicles,
    getExtraVehicle,
    setSelectedPromos,
    estimatePrices,
    estimatedPrice,
    createVehicleOrder: fetchCreateOrder,
    onCalculate,
  };
};
