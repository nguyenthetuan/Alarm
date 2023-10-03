import { all, put, takeEvery } from 'redux-saga/effects';
import { actionRequest, getDataSuccess } from './Reducer';
import { IHomeActionPayload, INofifyState } from 'types';
import { HomeActions } from './Actions';
import { axiosClient } from 'utils';
import { error } from 'store/notify';

function* onGetBaseActionsRequested(action: IHomeActionPayload) {
  try {
    yield put(actionRequest());
    const rs = yield axiosClient.get(`${action.payload.endPoint}`, {
      params: action.payload.params,
    });
    if (rs.status === 200) {
      const dataKey = action?.payload?.dataKey;
      const data = action?.payload?.isPaginate
        ? rs?.data
        : action?.payload?.isObject
        ? rs?.data?.result[0]
        : rs?.data?.result;
      const payload = dataKey ? { [`${dataKey}`]: data } : {};

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
  }
}
function* watchGetBaseActions() {
  yield takeEvery(
    HomeActions.GET_LIST_CATEGORY as any,
    onGetBaseActionsRequested,
  );
  yield takeEvery(
    HomeActions.GET_LIST_RESTAURANT_NEAR_ME as any,
    onGetBaseActionsRequested,
  );
  yield takeEvery(
    HomeActions.NOTIFICATION_GET_ALL as any,
    onGetBaseActionsRequested,
  );
}

function* onPostBaseActionsRequested(action: IRequestActionPayload) {
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
    return action?.callback?.({ ...e });
  }
}

function* watchPosttBaseActions() {
  yield takeEvery(
    HomeActions.POST_BASE_FCMTOKEN as any,
    onPostBaseActionsRequested,
  );
}

export default function* homeSagas() {
  yield all([watchGetBaseActions(), watchPosttBaseActions()]);
}
