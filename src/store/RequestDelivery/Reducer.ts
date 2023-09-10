import { createSlice } from '@reduxjs/toolkit';
import { requestDelivery, IPromotion } from 'types';

const initialState: requestDelivery = {
  loading: false,
  listProductType: [],
  listDeliveryMethod: [],
  listAddon: [],
  distance: [],
  delivery: {},
  detailDelivery: {},
};

const requestDeliverySlice = createSlice({
  name: 'requestDelivery',
  initialState,
  reducers: {
    actionRequest: state => {
      return {
        ...state,
        loading: true,
      };
    },
    getDataSuccess: (state, { payload }: { payload: any }) => {
      return {
        ...state,
        loading: false,
        ...payload,
      };
    },
    setSelectedPromos: (
      state,
      { payload }: { payload: { selectedPromos: IPromotion[] } },
    ) => {
      return {
        ...state,
        ...payload,
      };
    },
  },
});
export const { actionRequest, getDataSuccess, setSelectedPromos } =
  requestDeliverySlice.actions;
export default requestDeliverySlice;
