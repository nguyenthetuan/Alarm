import { useCallback } from 'react';
import { useSocket } from './useSocket';
import { IP_HOST } from '@env';

export const useCustomerSocket = () => {
  const { onConnect, onConnectError, socket } = useSocket({
    uri: `ws://${IP_HOST}/customer`,
    opts: {
      autoConnect: true,
      reconnection: true,
    },
  });

  const onFoundDriver = useCallback(
    (callback: (data: any) => void) => {
      socket.removeListener('customer:found-driver');
      socket.on('customer:found-driver', callback);
    },
    [socket],
  );

  const onFoundMotobikeDriver = useCallback(
    (callback: (data: any) => void) => {
      // socket.removeListener('customer:found-driver');
      socket.on('customer:found-driver-for-motorcycle-taxi', callback);
    },
    [socket],
  );

  const onCompleteMotoTaxi = useCallback(
    (callback: (data: any) => void) => {
      // socket.removeListener('customer:found-driver');
      socket.on('customer:completed-motorcycle-taxi', callback);
    },
    [socket],
  );
  const onDriverArrived = useCallback(
    (callback: (data: any) => void) => {
      socket.on('customer:driver-arrived-motorcycle-taxi', callback);
    },
    [socket],
  );
  const onOrderDelivered = useCallback(
    (callback: (data: any) => void) => {
      socket.removeListener('customer:order-delivered');
      socket.on('customer:order-delivered', callback);
    },
    [socket],
  );

  const onNotFoundDriver = useCallback(
    (callback: (data: any) => void) => {
      socket.removeListener('customer:not-found-driver');
      socket.on('customer:not-found-driver', callback);
    },
    [socket],
  );

  const onNotFoundMotoDriver = useCallback(
    (callback: (data: any) => void) => {
      socket.on('customer:not-found-driver-for-motorcycle-taxi', callback);
    },
    [socket],
  );

  const onCancelMotoDriver = useCallback(
    (callback: (data: any) => void) => {
      socket.on('customer:cancelled-motorcycle-taxi', callback);
    },
    [socket],
  );

  const onOrderDelivering = useCallback(
    (callback: (data: any) => void) => {
      socket.removeListener('customer:order-delivering');
      socket.on('customer:order-delivering', callback);
    },
    [socket],
  );

  const connect = useCallback(() => {
    console.log('connect');

    socket.connect();
    socket.on('connect');
  }, [socket]);

  const onOrderDriverMoving = useCallback(
    (callback: (data: any) => void) => {
      socket.removeListener('customer:order-driver-moving');
      socket.on('customer:order-driver-moving', callback);
    },
    [socket],
  );
  const onTaxiOrderDriverMoving = useCallback(
    (callback: (data: any) => void) => {
      socket.removeListener('customer:motorcycle-taxi-driver-moving');
      socket.on('customer:motorcycle-taxi-driver-moving', callback);
    },
    [socket],
  );

  const onFoundDriverDelivery = useCallback(
    (callback: (data: any) => void) => {
      socket.removeListener('customer:found-driver-for-delivery');
      socket.on('customer:found-driver-for-delivery', callback);
    },
    [socket],
  );

  const onNotFoundDriverDelivery = useCallback(
    (callback: (data: any) => void) => {
      socket.removeListener('customer:not-found-driver-for-delivery');
      socket.on('customer:not-found-driver-for-delivery', callback);
    },
    [socket],
  );

  const onCompleteDriverDelivery = useCallback(
    (callback: (data: any) => void) => {
      socket.removeListener('customer:completed-delivery');
      socket.on('customer:completed-delivery', callback);
    },
    [socket],
  );

  const onArrivedDriverDelivery = useCallback(
    (callback: (data: any) => void) => {
      socket.removeListener('customer:driver-arrived-delivery');
      socket.on('customer:driver-arrived-delivery', callback);
    },
    [socket],
  );

  const onCancelDriverDelivery = useCallback(
    (callback: (data: any) => void) => {
      socket.removeListener('customer:cancelled-delivery');
      socket.on('customer:cancelled-delivery', callback);
    },
    [socket],
  );

  const onMovingDriverDelivery = useCallback(
    (callback: (data: any) => void) => {
      socket.removeListener('customer:delivery-driver-moving');
      socket.on('customer:delivery-driver-moving', callback);
    },
    [socket],
  );

  return {
    onOrderDelivered,
    onFoundDriver,
    onOrderDelivering,
    onConnect,
    onConnectError,
    onNotFoundDriver,
    onOrderDriverMoving,
    onTaxiOrderDriverMoving,
    isConnected: socket.connected,
    onFoundMotobikeDriver,
    socket,
    connect,
    onCompleteMotoTaxi,
    onNotFoundMotoDriver,
    onCancelMotoDriver,
    onDriverArrived,

    onFoundDriverDelivery,
    onNotFoundDriverDelivery,
    onCompleteDriverDelivery,
    onArrivedDriverDelivery,
    onCancelDriverDelivery,
    onMovingDriverDelivery,
  };
};
