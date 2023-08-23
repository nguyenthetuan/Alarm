/** @format */

import { createSlice } from '@reduxjs/toolkit';
import { IPromotionListItem, IPromotionState } from 'types';
// import api from './Api';

const initialState: IPromotionState = {
  allPromotions: [],
};

const promotionSlice = createSlice({
  name: 'promotion',
  initialState,
  reducers: {
    setListAllPromotions: (
      state,
      { payload }: { payload: IPromotionListItem[] },
    ) => {
      state.allPromotions = payload;
    },
  },
  // extraReducers: builder => {
  //   builder.addMatcher(
  //     orderApi.endpoints.getOrderByStatus.matchFulfilled,
  //     (state, { payload }) => {
  //       if (payload) {
  //         if (payload.data.result && payload.data.result.length > 0) {
  //         }
  //       }
  //     },
  //   );
  // },
});

export const { setListAllPromotions } = promotionSlice.actions;

export default promotionSlice;
