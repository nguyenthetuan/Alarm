import { createSelector } from 'reselect';
import { IPromotionState } from 'types';

const selector = (state: { promotion }) => state.promotion;

export const getAttrByKey = (k: keyof IPromotionState) =>
  createSelector(selector, app => {
    return app[k];
  });
