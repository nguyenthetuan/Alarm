/**
 * @format
 * @description get data from redux store when perform the user authentication
 */

import { createSelector } from 'reselect';
import { requestDelivery } from 'types';

const selector = (state: { requestDelivery: requestDelivery }) => {
  return state.requestDelivery;
};

export const getLoading = createSelector(
  selector,
  ({ loading }: requestDelivery) => loading,
);

export const getAttrByKey = (k: keyof requestDelivery) =>
  createSelector(selector, app => app[k]);
