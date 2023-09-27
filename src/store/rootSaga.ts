import { all } from 'redux-saga/effects';
import userSagas from './user/Sagas';
import homeSagas from './home/Sagas';
import categoriesSagas from './categories/Sagas';
import ordersSagas from './orders/Sagas';
import requestDeliverySaga from './RequestDelivery/Sagas';
import vehicleRentalSaga from './vehicleRental/Sagas';

export default function* rootSaga() {
  yield all([
    userSagas(),
    homeSagas(),
    categoriesSagas(),
    ordersSagas(),
    requestDeliverySaga(),
    vehicleRentalSaga(),
  ]);
}
