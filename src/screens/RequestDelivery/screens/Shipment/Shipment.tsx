import { RouteProp, useIsFocused, useRoute } from '@react-navigation/native';
import { IconName } from 'assets';
import { Buttons, IconCus, TextCus, TouchCus, ViewCus, Card } from 'components';
import { BottomSheetModalContainer } from 'components/BottomSheetModals';
import { useCart } from 'context/CartContext';
import {
  useAuth,
  useCustomerSocket,
  useNotify,
  useRequestDelivery,
} from 'hooks';
import { useOrders } from 'hooks/useOrders';
import { NavigationService, RootStackParamList, Routes } from 'navigation';
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { useTranslation } from 'react-i18next';
import { BackHandler } from 'react-native';
import { Colors } from 'theme';
import { ILongLocation, IOrderDetail, IRefBottom } from 'types';
import { DriverAreComing, FindDriver, OrderOnProcess } from './Components';
import CannotFoundDriver from './Components/CannotFoundDriver';
import { DeliveryMapView } from './Components/DeliveryMapView';
import OrderIsCancel from './Components/OrderIsCancel';
import OrderIsSuccess from './Components/OrderIsSuccess';
import ModoalCancelOder from './Components/ModoalCancelOder';
import styles from './styles';

export enum ScreenStepView {
  NOT_READY = 0,
  FIND_DRIVER = 1,
  ON_PROCESS = 2,
  DRIVER_ARE_COMING = 3,
  CANNOT_FOUND_DRIVER = 4,
  ORDER_IS_CANCEL = 5,
  ORDER_IS_SUCCESS = 6,
  DRVER_MOVING = 7,
}

const Shipment = () => {
  const { danger } = useNotify();
  const { t } = useTranslation();
  const timeOutNotFoundDriver = 60_000;
  const route = useRoute<RouteProp<RootStackParamList, 'Delivery'>>();

  const {
    onConnect,
    onConnectError,
    onOrderDelivered,
    onOrderDelivering,

    onFoundDriverDelivery,
    onNotFoundDriverDelivery,
    onCompleteDriverDelivery,
    onArrivedDriverDelivery,
    onCancelDriverDelivery,
    onMovingDriverDelivery,
    socket: customerSocket,
  } = useCustomerSocket();

  const {
    orderItems: carts,
    selectedRestaurant,
    location: cartLocation,
    removeAll: onRemoveAll,
    orderRequest,
  } = useCart();

  const { loading: isOrderLoading, getDriverLocationByDriverId } = useOrders();
  const { putDeleteDelivery, keepFindDriverForOrderByCode } =
    useRequestDelivery();
  const { getOrderDetailByCode } = useRequestDelivery();
  const [infoDriverDb, setInfoDriverDb] = useState();

  const refContentBottom = useRef<IRefBottom>(null);
  const refModal = useRef(null);
  const [cancelOder, setCancelOder] = useState<any>(false);
  const currentOrderCodeRef = useRef<string | null>(null);
  const [orderDetailData, setOrderDetailData] = useState<IOrderDetail | null>(
    null,
  );
  console.log('orderDetailData', orderDetailData);

  const [status, setStatus] = useState(ScreenStepView.DRIVER_ARE_COMING);
  const [location, setLocation] = useState<ILongLocation | undefined>(
    cartLocation,
  );
  const [DeliveryInfo, setDeliveryInfo] = useState({});
  const { getInfoUser } = useAuth();
  const isFocused = useIsFocused();

  const [driverLocation, setDriverLocation] = useState<
    ILongLocation | undefined
  >(undefined);

  const setCurrentOrderCode = (code: string) => {
    currentOrderCodeRef.current = code;
  };

  const getCurrentOrderCode = () => {
    return currentOrderCodeRef.current;
  };

  const getInfoDriver = (data: any) => {
    if (data?.driver) {
      getInfoUser(data?.driver?.user_id, res => {
        const info = res?.data?.result?.[0];
        setInfoDriverDb(info);
      });
    }
  };

  const [stepView, setStepView] = useState(ScreenStepView.NOT_READY);
  const snapPointModal = useMemo(() => {
    let rs: [number | string, number | string] = ['25%', '25%'];
    switch (stepView) {
      case ScreenStepView.FIND_DRIVER:
        rs = [322, '80%'];
        break;

      case ScreenStepView.ON_PROCESS:
        rs = ['50%', '100%'];
        break;

      case ScreenStepView.DRIVER_ARE_COMING:
        if (cancelOder) {
          rs = ['5%', '5%', '5'];
        } else {
          rs = ['30%', '5%', '50%'];
        }
        break;
      case ScreenStepView.CANNOT_FOUND_DRIVER:
        rs = [310, '30%'];
        break;
      case ScreenStepView.ORDER_IS_CANCEL:
        rs = [310, '35%'];
        break;

      case ScreenStepView.ORDER_IS_SUCCESS:
        rs = [334, '35%'];
        break;

      default:
        break;
    }
    return rs;
  }, [stepView, cancelOder]);

  const refTimeOutCacheRunningFunction = useRef<ReturnType<
    typeof setTimeout
  > | null>(null);

  const reFetchOrderDetailData = () => {
    if (currentOrderCodeRef.current) {
      getOrderDetailByCode(currentOrderCodeRef.current, response => {
        const orderDetail: IOrderDetail = response.data?.result?.[0];
        setOrderDetailData(orderDetail);
      });
    }
  };
  const renderFooterModal = useCallback(() => {
    switch (stepView) {
      case ScreenStepView.FIND_DRIVER:
        return (
          <Card flex-row p-16>
            <ViewCus f-1>
              <Buttons
                mt-10
                ml-10
                mr-10
                style={styles.buttoCancel}
                onPress={() => {
                  if (currentOrderCodeRef.current) {
                    putDeleteDelivery(currentOrderCodeRef.current, () => {
                      if (refTimeOutCacheRunningFunction.current) {
                        clearTimeout(refTimeOutCacheRunningFunction.current);
                      }
                      refContentBottom.current?.close();
                      NavigationService.goBack();
                    });
                  } else {
                    if (refTimeOutCacheRunningFunction.current) {
                      clearTimeout(refTimeOutCacheRunningFunction.current);
                    }

                    refContentBottom.current?.close();
                    NavigationService.goBack();
                  }
                }}
                disabled={false}>
                <TextCus
                  bold
                  useI18n
                  mainSize
                  style={{
                    color: Colors.white,
                  }}>
                  cancelDrive
                </TextCus>
              </Buttons>
            </ViewCus>
          </Card>
        );
      case ScreenStepView.CANNOT_FOUND_DRIVER:
        return (
          <ViewCus flex-row p-16>
            <ViewCus f-1>
              <Buttons
                h-48
                mr-12
                round={false}
                style={[
                  {
                    backgroundColor: Colors.greyAD,
                  },
                  styles.bo8,
                ]}
                onPress={() => {
                  if (currentOrderCodeRef.current) {
                    putDeleteDelivery(currentOrderCodeRef.current, () => {
                      if (refTimeOutCacheRunningFunction.current) {
                        clearTimeout(refTimeOutCacheRunningFunction.current);
                      }
                      refContentBottom.current?.close();
                      NavigationService.goBack();
                    });
                  } else {
                    if (refTimeOutCacheRunningFunction.current) {
                      clearTimeout(refTimeOutCacheRunningFunction.current);
                    }

                    refContentBottom.current?.close();
                    NavigationService.goBack();
                  }
                }}>
                <TextCus useI18n bold semiBold color={Colors.white}>
                  delivery.cancelFind
                </TextCus>
              </Buttons>
            </ViewCus>
            <ViewCus f-1>
              <Buttons
                h-48
                round={false}
                style={[styles.bo8]}
                onPress={() => {
                  if (currentOrderCodeRef.current) {
                    keepFindDriverForOrderByCode(
                      currentOrderCodeRef.current,
                      rs => {
                        switch (rs.status) {
                          case 200:
                            setStepView(ScreenStepView.FIND_DRIVER);
                            break;

                          default:
                            danger(t('error'), 'Tìm lại thất bại');
                            break;
                        }
                      },
                    );
                  }
                }}>
                <TextCus useI18n bold semiBold color={Colors.white}>
                  delivery.continueFind
                </TextCus>
              </Buttons>
            </ViewCus>
          </ViewCus>
        );

      case ScreenStepView.ORDER_IS_CANCEL:
        return (
          <ViewCus flex-row p-16>
            <ViewCus f-1>
              <Buttons
                h-48
                mr-12
                round={false}
                style={[
                  {
                    backgroundColor: Colors.greyAD,
                  },
                  styles.bo8,
                ]}
                onPress={() => {
                  refContentBottom.current?.close();
                  NavigationService.replace(Routes.Categories);
                }}>
                <TextCus useI18n bold semiBold color={Colors.white}>
                  cancel
                </TextCus>
              </Buttons>
            </ViewCus>
            <ViewCus f-1>
              <Buttons
                h-48
                round={false}
                style={[styles.bo8]}
                onPress={() => {
                  refContentBottom.current?.close();
                  NavigationService.resetTo(
                    [
                      {
                        name: Routes.HomeTabs,
                      },
                      {
                        name: Routes.Categories,
                      },
                      {
                        name: Routes.RestaurantDetail,
                        params: {
                          restaurantId: selectedRestaurant,
                        },
                      },
                    ],
                    2,
                  );
                }}>
                <TextCus useI18n bold semiBold color={Colors.white}>
                  delivery.createNewOrder
                </TextCus>
              </Buttons>
            </ViewCus>
          </ViewCus>
        );

      case ScreenStepView.ORDER_IS_SUCCESS:
        return (
          <ViewCus flex-row p-16>
            <ViewCus f-1>
              <Buttons
                h-48
                mr-12
                round={false}
                style={[
                  {
                    backgroundColor: Colors.greyAD,
                  },
                  styles.bo8,
                ]}
                onPress={() => {
                  onRemoveAll();
                  refContentBottom.current?.close();
                  NavigationService.reset(Routes.Home);
                  NavigationService.navigate(Routes.Home);
                }}>
                <TextCus useI18n bold semiBold color={Colors.white}>
                  exit
                </TextCus>
              </Buttons>
            </ViewCus>
            <ViewCus f-1>
              <Buttons
                h-48
                round={false}
                style={[
                  styles.bo8,
                  {
                    backgroundColor: Colors.success,
                  },
                ]}
                onPress={() => {
                  onRemoveAll();
                  refContentBottom.current?.close();
                  NavigationService.resetTo(
                    [
                      {
                        name: Routes.HomeTabs,
                      },
                      {
                        name: Routes.Rating,
                        params: {
                          type: 'bike',
                          deliveryInfo: DeliveryInfo,
                        },
                      },
                    ],
                    1,
                  );
                }}>
                <TextCus useI18n bold semiBold color={Colors.white}>
                  activity.rating
                </TextCus>
              </Buttons>
            </ViewCus>
          </ViewCus>
        );

      default:
        return <></>;
    }
  }, [
    stepView,
    putDeleteDelivery,
    keepFindDriverForOrderByCode,
    danger,
    t,
    selectedRestaurant,
    onRemoveAll,
  ]);

  const renderContentModal = (step: ScreenStepView) => {
    switch (step) {
      case ScreenStepView.FIND_DRIVER:
        return (
          <OrderOnProcess
            orderDetailData={orderDetailData}
            onCancel={() => {
              if (orderDetailData?.order_code) {
                putDeleteDelivery(orderDetailData?.order_code, rs => {
                  if (Array.isArray(rs.data.result)) {
                    if (
                      rs.data.result[0]?.order?.order_code ===
                      currentOrderCodeRef.current
                    ) {
                      setStepView(ScreenStepView.CHOOSE_DELIVERY_OPTION);
                      if (refTimeOutCacheRunningFunction.current) {
                        clearTimeout(refTimeOutCacheRunningFunction.current);
                      }
                      setOrderDetailData(null);
                    } else {
                      danger(t('error'), 'Huỷ thất bại');
                    }
                  }
                });
              }
            }}
          />
        );

      case ScreenStepView.DRIVER_ARE_COMING:
        return (
          <DriverAreComing
            status={status}
            orderDetailData={orderDetailData}
            onCancel={() => {
              refModal?.current.show();
              setCancelOder(true);
              // setStepView(ScreenStepView.CHOOSE_DELIVERY_OPTION);
              if (orderDetailData?.order_code) {
                putDeleteDelivery(orderDetailData?.order_code, rs => {
                  if (Array.isArray(rs.data.result)) {
                    if (rs.status === 200) {
                      setStepView(ScreenStepView.CHOOSE_DELIVERY_OPTION);
                      if (refTimeOutCacheRunningFunction.current) {
                        clearTimeout(refTimeOutCacheRunningFunction.current);
                      }
                      setOrderDetailData(null);
                    } else {
                      danger(t('error'), 'Huỷ thất bại');
                    }
                  }
                });
              }
            }}
            infoDriverDb={infoDriverDb}
            onMessageDetail={driverInfo => {
              if (driverInfo) {
                refContentBottom.current?.close();
                NavigationService.push(Routes.MessageDetail, {
                  partner: driverInfo,
                });
              }
            }}
          />
        );

      case ScreenStepView.ORDER_IS_CANCEL:
        return <OrderIsCancel />;

      case ScreenStepView.CANNOT_FOUND_DRIVER:
        return <CannotFoundDriver />;

      case ScreenStepView.ORDER_IS_SUCCESS:
        return <OrderIsSuccess />;

      default:
        return <></>;
    }
  };

  const handleCustomerSocketFoundDriver = args => {
    setDeliveryInfo(args?.result[0]?.delivery);
    getInfoDriver(args?.result[0]?.delivery);
    setStepView(ScreenStepView.DRIVER_ARE_COMING);
    if (args.result) {
      const code = args.result[0]?.order?.order_code;
      if (code === getCurrentOrderCode()) {
        reFetchOrderDetailData();
      }
    }
  };
  const handleCustomerSocketOrderDelivered = useCallback(
    (args: { order: IOrderDetail }) => {
      if (args.order.order_code === getCurrentOrderCode()) {
        reFetchOrderDetailData();
      }
    },
    [customerSocket],
  );

  const handleCustomerSocketOrderDelivering = useCallback(
    (args: { order: IOrderDetail }) => {
      if (args.order.order_code === getCurrentOrderCode()) {
        reFetchOrderDetailData();
      }
    },
    [customerSocket, currentOrderCodeRef.current],
  );
  const onSocketCustomerConnectionError = useCallback(
    err => {
      console.log('onSocketCustomerConnectionError', err);
    },
    [customerSocket],
  );

  const handleSocketLocationDriverMove = useCallback(
    (data?: { result: { lat: number; long: number; orderCode: string }[] }) => {
      if (data && Array.isArray(data?.result) && data?.result.length > 0) {
        if (orderDetailData) {
          const sockerData = data?.result[0];
          const { lat, long, orderCode } = sockerData;

          if (orderDetailData.order_code === orderCode) {
            setDriverLocation({
              lat,
              long,
            });
          }
        }
      }
    },
    [orderDetailData],
  );

  useEffect(() => {
    if (orderDetailData && orderDetailData.driver?.user_id) {
      getDriverLocationByDriverId(orderDetailData.driver?.user_id, rs => {
        if (Array.isArray(rs.data.result) && rs.data.result.length > 0) {
          const { lat, long } = rs.data.result[0];
          if (lat && long) {
            setDriverLocation({
              lat,
              long,
            });
          }
        }
      });
    }
    onArrivedDriverDelivery(handleSocketLocationDriverMove);
  }, [orderDetailData, handleSocketLocationDriverMove]);

  useEffect(() => {
    let funcRun: (() => void) | null = null;
    let timeOut = 1000;

    if (stepView === ScreenStepView.FIND_DRIVER) {
      timeOut = timeOutNotFoundDriver;
      funcRun = () => {
        setStepView(ScreenStepView.CANNOT_FOUND_DRIVER);
      };
    }

    if (refTimeOutCacheRunningFunction.current) {
      clearTimeout(refTimeOutCacheRunningFunction.current);
    }

    if (funcRun) {
      refTimeOutCacheRunningFunction.current = setTimeout(() => {
        funcRun?.();
      }, timeOut);
    }

    return () => {
      if (refTimeOutCacheRunningFunction.current !== null) {
        clearTimeout(refTimeOutCacheRunningFunction.current);
      }
    };
  }, [stepView]);

  useEffect(() => {
    const handle = BackHandler.addEventListener('hardwareBackPress', () => {
      return true;
    });
    return () => {
      if (refTimeOutCacheRunningFunction.current !== null) {
        clearTimeout(refTimeOutCacheRunningFunction.current);
      }
      handle.remove();
    };
  }, []);

  useEffect(() => {
    if (route.params?.order_code) {
      setCurrentOrderCode(route.params?.order_code);
      reFetchOrderDetailData();
    } else {
      if (carts?.length > 0) {
        setStepView(ScreenStepView.CHOOSE_DELIVERY_OPTION);
        refContentBottom.current?.show();
      }
    }
  }, [route, carts]);
  const updateStatus = () => {
    setStatus(ScreenStepView.DRVER_MOVING);
  };

  const complateDilivery = () => {
    setStepView(ScreenStepView.ORDER_IS_SUCCESS);
  };

  //#region Watch change
  useEffect(() => {
    if (isFocused) {
      refContentBottom.current?.show();
    }
  }, [isFocused]);

  useEffect(() => {
    refContentBottom.current?.show();
    setStepView(ScreenStepView.FIND_DRIVER);
    if (cartLocation) {
      setLocation(cartLocation);
    }
  }, [cartLocation]);

  useEffect(() => {
    onFoundDriverDelivery(handleCustomerSocketFoundDriver);
    onNotFoundDriverDelivery(() => {
      setStepView(ScreenStepView.CANNOT_FOUND_DRIVER);
    });
    onConnect(() => {
      console.log('onSocketCustomerConnected');
    });
    onOrderDelivered(handleCustomerSocketOrderDelivered);
    onOrderDelivering(handleCustomerSocketOrderDelivering);
    onConnectError(onSocketCustomerConnectionError);
    onMovingDriverDelivery(updateStatus);
    onCompleteDriverDelivery(complateDilivery);
  }, []);

  return (
    <>
      <ViewCus l-16 t-90 style={styles.posAbsolute}>
        <TouchCus
          onPress={() => {
            switch (stepView) {
              // case ScreenStepView.FIND_DRIVER:
              //   console.log(orderDetailData);
              //   break;

              default:
                NavigationService.goBack();
                break;
            }
          }}>
          <ViewCus bg-white br-12 w-32 h-32 items-center justify-center>
            <IconCus name={IconName.ChevronLeft} color={Colors.main} />
          </ViewCus>
        </TouchCus>
      </ViewCus>
      <ViewCus f-1>
        {location && (
          <DeliveryMapView
            defaultNumberDriver={10}
            drivers={[]}
            pickup_location={orderDetailData?.pickup_location}
            destination={location}
            startFind={stepView === ScreenStepView.FIND_DRIVER}
            stepView={stepView}
            driverLocation={driverLocation}
          />
        )}

        <BottomSheetModalContainer
          footerComponent={renderFooterModal}
          hideBackdrop={true}
          ref={refContentBottom}
          showIndicator={true}
          snapPoints={snapPointModal}
          index={0}>
          {renderContentModal(stepView)}
        </BottomSheetModalContainer>
        <ModoalCancelOder ref={refModal} orderDetailData={orderDetailData} />
      </ViewCus>
    </>
  );
};

export default Shipment;
