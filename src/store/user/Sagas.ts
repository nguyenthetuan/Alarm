/** @format */

import { API_ENDPOINT, axiosClient } from 'utils';
import { takeLatest, put, all, takeEvery } from 'redux-saga/effects';
import { IHomeActionPayload, INofifyState } from 'types';
import { UserActions } from './Actions';
import {
  actionRequest,
  getDataSuccess,
  reset,
  forceLogin,
  actionRequestDone,
} from './Reducer';
import { error } from 'store/notify';
import { NavigationService, Routes } from 'navigation';

function* onGetBaseActionsRequest(action: IHomeActionPayload) {
  try {
    yield put(actionRequest());
    const rs = yield axiosClient.get(`${action.payload.endPoint}`);

    if (rs.status === 200) {
      const dataKey = action?.payload?.dataKey;
      const payload = dataKey
        ? {
            [`${dataKey}`]: action?.payload?.isObject
              ? rs?.data?.result?.[0]
              : rs?.data?.result,
          }
        : {};
      yield put(getDataSuccess(payload));
      if (action?.callback) {
        action?.callback?.(rs);
      }
    }
  } catch (e: any) {
    yield put(
      error({
        message: 'some_thing_wrong',
        options: { useI18n: true },
      } as INofifyState),
    );
    yield put(getDataSuccess({}));
    return action?.callback?.({ ...e });
  } finally {
    yield put(actionRequestDone());
  }
}

function* watchGetBaseActions() {
  yield takeLatest(
    UserActions.GET_BASE_ACTIONS as any,
    onGetBaseActionsRequest,
  );
}

function* onPostBaseAction(action: IHomeActionPayload) {
  try {
    yield put(actionRequest());
    const rs = yield axiosClient.post(
      `${action.payload.endPoint}`,
      action?.payload?.formData,
      {
        headers: { ...action.payload?.headers },
      },
    );
    const dataKey = action?.payload?.dataKey;
    const payload = dataKey
      ? {
          [`${dataKey}`]: action?.payload?.isObject
            ? rs?.data?.result?.[0]
            : rs?.data?.result,
        }
      : {};

    yield put(getDataSuccess(payload));
    if (action?.callback) {
      action?.callback?.(rs);
    }
  } catch (e: any) {
    yield put(
      error({
        message: 'some_thing_wrong',
        options: { useI18n: true },
      } as INofifyState),
    );
    yield put(getDataSuccess({}));
    if (action?.callback) {
      action?.callback?.({ success: false, ...e });
    }
  } finally {
    yield put(actionRequestDone());
  }
}

function* watchPostBaseActions() {
  yield takeLatest(UserActions.POST_BASE_ACTIONS as any, onPostBaseAction);
  yield takeEvery(UserActions.POST_BASE_FCMTOKEN as any, onPostBaseAction);
}

function* onLogoutAction(action: IHomeActionPayload) {
  let rs: any = null;
  try {
    yield put(reset());
    action?.payload.redirect && NavigationService.reset(Routes.InputPhone);
    rs = yield axiosClient.post(`${API_ENDPOINT.AUTH.LOGOUT}`);
  } catch (e: any) {
  } finally {
    action?.callback?.(rs);
  }
}

function* watchLogout() {
  yield takeLatest(UserActions.LOGOUT as any, onLogoutAction);
}

function* onForceLoginAction(previousPath: Routes) {
  yield put(forceLogin(previousPath));
}

function* forceLoginAction() {
  yield takeLatest(UserActions.FORCE_LOGIN as any, onForceLoginAction);
}

export default function* userSagas() {
  yield all([
    watchGetBaseActions(),
    watchPostBaseActions(),
    watchLogout(),
    forceLoginAction(),
  ]);
}
