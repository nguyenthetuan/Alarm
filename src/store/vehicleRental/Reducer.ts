import { createSlice } from '@reduxjs/toolkit';
import { IVehicleCategoryState, IPromotion } from 'types';

const initialState: IVehicleCategoryState = {
  loading: false,
  selectedPromos: [],
  listGarages: [],
  listExtraVehicle: {
    desc: '',
    extra_option_group_id: undefined,
    base_price: 0,
    status: '',
    order_count: 0,
    images: [],
    currency_type: '',
    food_catalog_id: '',
    food_name: '',
    price: 0,
    image: '',
    id: '',
    createdAt: '',
    updatedAt: '',
    restaurant_id: '',
    extra_options_group: [],
  },
  listVehicles: [],
  listVehicleCatalog: [],
  detailGarage: {
    open_time: {
      day: '',
      time: '',
    },
    contact: {
      phone: '',
      email: '',
    },
    status: false,
    stop_time: undefined,
    avatar: '',
    address: '',
    name: '',
    location: {
      long: '',
      lat: '',
    },
    id: '',
    createdAt: '',
    updatedAt: '',
    bank_information: {
      account_name: '',
      account_number: '',
      bank_name: '',
    },
    average_rating: 0,
    total_reviews: 0,
  },
  listDiscoutVehicle: [],
};

const categoriesVehicleSlice = createSlice({
  name: 'categories',
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
  categoriesVehicleSlice.actions;
export default categoriesVehicleSlice.reducer;
