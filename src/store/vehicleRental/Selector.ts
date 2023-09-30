/**
 * @format
 * @description get data from redux store when perform the user authentication
 */

import { createSelector } from 'reselect';
import { IVehicleCategoryState } from 'types';

const selector = (state: { categories: IVehicleCategoryState }) => state.categories;

export const getLoading = createSelector(
  selector,
  ({ loading }: IVehicleCategoryState) => loading,
);

export const getAttrByKey = (k: keyof IVehicleCategoryState) =>
  createSelector(selector, app => app[k]);
