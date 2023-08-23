import AsyncStorage from '@react-native-async-storage/async-storage';
import { combineReducers, configureStore } from '@reduxjs/toolkit';
// TODO: uncomment before PR
// import logger from 'redux-logger';
import { persistReducer, persistStore } from 'redux-persist';
import createSagaMiddleware from 'redux-saga';
import reducers, { apiMiddleware } from './';
import rootSaga from './rootSaga';

const persistConfig = {
  key: 'root',
  storage: AsyncStorage,
  timeout: 100000,
  whitelist: ['user', 'location', 'home'], // Saved State when open inital app
  blackList: ['categories', 'orders'], // Don't Saved State
};

export const configStore = () => {
  const middleware: any = [];
  // const enhancers = [];

  const sagaMiddleware = createSagaMiddleware();
  middleware.push(sagaMiddleware);

  // TODO: uncomment before PR
  // if (process.env.NODE_ENV === 'development') {
  //   middleware.push(logger);
  // }
  middleware.push(...apiMiddleware);

  // enhancers.push(applyMiddleware(...middleware));
  const rootReducer = combineReducers(reducers);

  const persistedReducer = persistReducer(persistConfig, rootReducer);

  const store = configureStore({
    reducer: persistedReducer,
    middleware: getDefaultMiddleware => {
      const middlewareD = getDefaultMiddleware({
        serializableCheck: false,
      });

      if (__DEV__) {
        //   const createDebugger = require('redux-flipper').default
        //   middleware.push(createDebugger())
      }

      return middlewareD.concat(apiMiddleware).concat(middleware);
    },
  });
  const persistor = persistStore(store);

  sagaMiddleware.run(rootSaga);

  return { store, persistor };
};
