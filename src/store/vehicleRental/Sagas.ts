import { all, put, takeEvery } from 'redux-saga/effects';
import { actionRequest, getDataSuccess } from './Reducer';
import { IHomeActionPayload, INofifyState } from 'types';
import { VehicleRentalActions } from './Actions';
import { axiosClient } from 'utils';
import { error } from 'store/notify';

// TODO: remove before PR
const mockExtraOptions = {
  _id: '647180d92537f194da961592',
  food_id: '79297efe-ce7b-4ff5-a5f5-efdd4956b855',
  desc: null,
  status: true,
  restaurant_id: '4b6d1f48-e971-4bd9-adb9-a40aa8fd8e44',
  group_name: 'Yêu cầu khác',
  id: 'cc99271a-8eb2-4656-82f2-b378a9aa2e5e',
  createdAt: '2023-05-18T09:11:39.622Z',
  updatedAt: '2023-05-18T09:11:39.622Z',
  __v: 0,
  extraOptions: [
    {
      _id: '6471810d2537f194da961594',
      price: 500000,
      desc: '',
      status: true,
      extra_option_group_id: 'cc99271a-8eb2-4656-82f2-b378a9aa2e5e',
      extra_option_name: 'Tài xế',
      id: 'e3d24b15-cbd3-4c3f-8982-9c1282c37351',
      createdAt: '2023-05-17T06:49:33.733Z',
      updatedAt: '2023-05-18T08:11:04.391Z',
      __v: 0,
    },
  ],
};

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
        : action?.payload?.isObject && Array.isArray(rs?.data?.result)
        ? rs?.data?.result[0]
        : rs?.data?.result;
      const payload = dataKey
        ? {
            [`${dataKey}`]:
              dataKey === 'listExtraVehicle'
                ? {
                    ...data,
                    extra_options_group: [
                      mockExtraOptions,
                      ...data.extra_options_group,
                    ],
                  }
                : data,
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
  }
}
function* watchGetBaseActions() {
  yield takeEvery(
    VehicleRentalActions.GET_LIST_GARAGE as any,
    onGetBaseActionsRequested,
  );
  yield takeEvery(
    VehicleRentalActions.GET_DETAIL_GARAGE as any,
    onGetBaseActionsRequested,
  );
  yield takeEvery(
    VehicleRentalActions.GET_LIST_VEHICLE as any,
    onGetBaseActionsRequested,
  );
  yield takeEvery(
    VehicleRentalActions.GET_LIST_CATALOG_VEHICLE as any,
    onGetBaseActionsRequested,
  );
}

function* onPostBaseActionsRequested(action: IHomeActionPayload) {
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

function* watchPostBaseActions() {
  yield takeEvery(
    VehicleRentalActions.POST_ODER_VEHICLE as any,
    onPostBaseActionsRequested,
  );
}

export default function* categoriesSagas() {
  yield all([watchGetBaseActions(), watchPostBaseActions()]);
}
