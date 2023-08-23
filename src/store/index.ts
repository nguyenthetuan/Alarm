import categories from './categories/Reducer';
import home from './home/Reducer';
import location from './location/Reducer';
import notify from './notify/Reducer';
import user from './user/Reducer';
import orders from './orders/Reducer';
import promotions from './promotions/Reducer';
// import { persistReducer } from 'redux-persist';
// const categoriesPersistConfig = {
//   key: 'categories',
//   storage: AsyncStorage,
//   blacklist: ['listRestaurants'],
// };
// export default combineReducers({
//   user,
//   notify,
//   location,
//   home,
//   categories,
//   orders,
// });

// Just in case want to switch
import promotionstApi from './promotions/Api';
import orderApi from './orders/Api';

const reducer = {
  user,
  notify,
  location,
  home,
  categories,
  orders,
  promotions: promotions.reducer,
};

const apiReducer = {
  [promotionstApi.reducerPath]: promotionstApi.reducer,
  [orderApi.reducerPath]: orderApi.reducer,
};

const apiMiddleware = [promotionstApi.middleware, orderApi.middleware];

export { reducer, apiReducer, apiMiddleware };

export default { ...reducer, ...apiReducer };
