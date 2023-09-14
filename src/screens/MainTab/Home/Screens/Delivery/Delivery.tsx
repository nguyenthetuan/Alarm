import { RouteProp, useIsFocused, useRoute } from '@react-navigation/native';
import { IconName } from 'assets';
import { Buttons, IconCus, TextCus, TouchCus, ViewCus } from 'components';
import { BottomSheetModalContainer } from 'components/BottomSheetModals';
import { useCart } from 'context/CartContext';
import { useAuth, useCustomerSocket, useNotify, useShippingType } from 'hooks';
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
import { Toast } from 'react-native-toast-message/lib/src/Toast';
import { useDispatch } from 'react-redux';
import { addOrderCode } from 'store/orders';
import { Colors } from 'theme';
import { ILongLocation, IOrderDetail, IRefBottom, OrderStatus } from 'types';
import { formatDistanceKm } from 'utils';
import {
  ChooseWayToDelivery,
  DriverAreComing,
  FindDriver,
  OrderOnProcess,
} from './Components';
import CannotFoundDriver from './Components/CannotFoundDriver';
import { DeliveryMapView } from './Components/DeliveryMapView';
import OrderIsCancel from './Components/OrderIsCancel';
import OrderIsSuccess from './Components/OrderIsSuccess';
import styles from './styles';

export enum ScreenStepView {
  NOT_READY = 0,
  CHOOSE_DELIVERY_OPTION = 1,
  FIND_DRIVER = 2,
  ON_PROCESS = 3,
  DRIVER_ARE_COMING = 4,
  CANNOT_FOUND_DRIVER = 5,
  ORDER_IS_CANCEL = 6,
  ORDER_IS_SUCCESS = 7,
}

const Delivery = () => {
  //#region Static
  const { danger } = useNotify();
  const { t } = useTranslation();
  const timeOutNotFoundDriver = 60_000;
  const { listData: listShippingType } = useShippingType();
  const route = useRoute<RouteProp<RootStackParamList, 'Delivery'>>();
  const {
    onConnect,
    onConnectError,
    onFoundDriver,
    onNotFoundDriver,
    onOrderDelivered,
    onOrderDelivering,
    onOrderDriverMoving,
    socket: customerSocket,
  } = useCustomerSocket();

  const dispatch = useDispatch();
  const isFocused = useIsFocused();

  const {
    orderItems: carts,
    selectedRestaurant,
    location: cartLocation,
    removeAll: onRemoveAll,
    promotions,
    orderRequest,
    distance,
  } = useCart();

  const deliveryDriverOptions = useMemo(() => {
    return listShippingType.map(item => {
      return {
        ...item,
        fast: item.name === 'Giao nhanh',
        price: item.pricePerKm * Number(formatDistanceKm(distance)).valueOf(),
        distance: formatDistanceKm(distance),
        orderRequest,
      };
    });
  }, [listShippingType, distance, orderRequest]);

  const {
    createOrder,
    loading: isOrderLoading,
    getOrderDetailByCode,
    onCancelOrderByCode,
    keepFindDriverForOrderByCode,
    getDriverLocationByDriverId,
  } = useOrders();

  //#endregion

  //#region Ref control
  const refContentBottom = useRef<IRefBottom>(null);
  //#endregion

  //#region State screen
  /** Current orderCode working with (useRef because this will use in socket handle , cannot useState function handle socket cannot find correct data) */
  const currentOrderCodeRef = useRef<string | null>(null);
  /** This is the orderHasCreated */
  const [orderDetailData, setOrderDetailData] = useState<IOrderDetail | null>(
    null,
  );
  const [infoDriverDb, setInfoDriverDb] = useState();

  const [location, setLocation] = useState<ILongLocation | undefined>(
    cartLocation,
  );
  const [driverLocation, setDriverLocation] = useState<
    ILongLocation | undefined
  >(undefined);

  const { getInfoUser } = useAuth();

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
  }, [orderDetailData]);

  const getInfoDriver = (data: any) => {
    if (data?.order?.driver) {
      getInfoUser(data?.order?.driver?.user_id, res => {
        const info = res?.data?.result?.[0];
        setInfoDriverDb(info);
      });
    }
  };

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
    onOrderDriverMoving(handleSocketLocationDriverMove);
  }, [handleSocketLocationDriverMove]);

  // const { selectedPromos } = useCategories();

  const setCurrentOrderCode = (code: string) => {
    currentOrderCodeRef.current = code;
  };

  const getCurrentOrderCode = () => {
    return currentOrderCodeRef.current;
  };

  const [stepView, setStepView] = useState(ScreenStepView.NOT_READY);
  const [deliveryDriverSelected, setDeliveryDriverSelected] = useState(null);

  const snapPointModal = useMemo(() => {
    let rs: [number | string, number | string] = ['25%', '25%'];
    switch (stepView) {
      case ScreenStepView.CHOOSE_DELIVERY_OPTION:
        rs = [230, '50%'];
        break;

      case ScreenStepView.FIND_DRIVER:
        rs = [322, '80%'];
        break;

      case ScreenStepView.ON_PROCESS:
        rs = ['50%', '100%'];
        break;

      case ScreenStepView.DRIVER_ARE_COMING:
        rs = [280, '80%'];
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
  }, [stepView]);

  //#endregion

  //#region Ref value
  const refTimeOutCacheRunningFunction = useRef<ReturnType<
    typeof setTimeout
  > | null>(null);
  //#endregion

  //#region Screen function
  const reFetchOrderDetailData = () => {
    if (currentOrderCodeRef.current) {
      getOrderDetailByCode(currentOrderCodeRef.current, response => {
        const orderDetail: IOrderDetail = response.data?.result?.[0];
        setOrderDetailData(orderDetail);
      });
    }
  };
  //#endregion

  //#region Render function
  const renderFooterModal = useCallback(() => {
    switch (stepView) {
      case ScreenStepView.CHOOSE_DELIVERY_OPTION:
        return (
          <ViewCus flex-row p-16>
            <ViewCus f-1>
              <Buttons
                disabled={isOrderLoading}
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
                  NavigationService.goBack();
                }}>
                <TextCus useI18n bold semiBold color={Colors.white}>
                  delivery.cancelOrder
                </TextCus>
              </Buttons>
            </ViewCus>
            <ViewCus f-1>
              <Buttons
                // disabled={isOrderLoading || carts.length === 0}
                h-48
                round={false}
                style={[styles.bo8]}
                onPress={
                  isOrderLoading || carts.length === 0
                    ? () => {}
                    : () => {
                        if (deliveryDriverSelected !== null) {
                          onFindDriverClick();
                        } else {
                          Toast.show({
                            text1: 'Vui lòng chọn phương thức giao hàng',
                            position: 'top',
                            type: 'error',
                          });
                        }
                      }
                }>
                <TextCus useI18n bold semiBold color={Colors.white}>
                  delivery.findADriver
                </TextCus>
              </Buttons>
            </ViewCus>
          </ViewCus>
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
                    onCancelOrderByCode(currentOrderCodeRef.current, () => {
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
                          type: route.params?.type,
                          deliveryInfo: orderDetailData,
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
  }, [stepView, deliveryDriverSelected, isOrderLoading, carts, orderRequest]);

  const renderContentModal = (step: ScreenStepView) => {
    switch (step) {
      case ScreenStepView.CHOOSE_DELIVERY_OPTION:
        return (
          <ChooseWayToDelivery
            initialValue={deliveryDriverSelected}
            options={deliveryDriverOptions}
            onCancel={() => {
              refContentBottom.current?.close();
              NavigationService.replace(Routes.Categories);
            }}
            onSubmit={data => {
              setDeliveryDriverSelected(data);
            }}
          />
        );

      case ScreenStepView.FIND_DRIVER:
        return (
          <FindDriver
            orderDetailData={orderDetailData}
            onCancel={() => {
              if (orderDetailData?.order_code) {
                onCancelOrderByCode(orderDetailData?.order_code, rs => {
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
            onSubmit={() => {
              setStepView(ScreenStepView.DRIVER_ARE_COMING);
            }}
          />
        );

      case ScreenStepView.ON_PROCESS:
        return (
          <OrderOnProcess
            orderDetailData={orderDetailData}
            infoDriverDb={infoDriverDb}
            onMessageDetail={driverInfo => {
              if (driverInfo) {
                refContentBottom.current?.close();
                NavigationService.push(Routes.MessageDetail, {
                  partner: driverInfo,
                });
              }
            }}
            onCancel={() => {
              if (orderDetailData?.order_code) {
                onCancelOrderByCode(orderDetailData?.order_code, rs => {
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
            orderDetailData={orderDetailData}
            infoDriverDb={infoDriverDb}
            onMessageDetail={driverInfo => {
              if (driverInfo) {
                refContentBottom.current?.close();
                NavigationService.push(Routes.MessageDetail, {
                  partner: driverInfo,
                });
              }
            }}
            onCancel={() => {
              // setStepView(ScreenStepView.CHOOSE_DELIVERY_OPTION);
              if (orderDetailData?.order_code) {
                onCancelOrderByCode(orderDetailData?.order_code, rs => {
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

  //#endregion

  //#region Watch change
  useEffect(() => {
    if (isFocused) {
      refContentBottom.current?.show();
    }
  }, [stepView, isFocused]);

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
    refContentBottom.current?.show();

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
    refContentBottom.current?.show();
    setStepView(ScreenStepView.CHOOSE_DELIVERY_OPTION);
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

  useEffect(() => {
    refContentBottom.current?.show();

    if (cartLocation) {
      setLocation(cartLocation);
    }
  }, [cartLocation]);

  useEffect(() => {
    refContentBottom.current?.show();

    if (orderDetailData) {
      if (orderDetailData.customer) {
        setLocation({
          lat: Number(orderDetailData.customer.lat),
          long: Number(orderDetailData.customer.long),
        });
      }
      setStepView(ScreenStepView.FIND_DRIVER);
      if (
        [OrderStatus.DRIVER_PICKING, OrderStatus.RESTAURANT_DONE].includes(
          orderDetailData.status,
        )
      ) {
        setStepView(ScreenStepView.ON_PROCESS);
      }
      if (orderDetailData.status === OrderStatus.DRIVER_DELIVERING) {
        setStepView(ScreenStepView.DRIVER_ARE_COMING);
      }
      if (orderDetailData.status === OrderStatus.DELIVERED) {
        setStepView(ScreenStepView.ORDER_IS_SUCCESS);
      }

      refContentBottom.current?.show();
    }
  }, [orderDetailData]);
  //#endregion

  //#region Handle socket
  const handleCustomerSocketFoundDriver = args => {
    if (args.result) {
      getInfoDriver(args?.result[0]);
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

  useEffect(() => {
    onFoundDriver(handleCustomerSocketFoundDriver);
    onNotFoundDriver(() => {
      setStepView(ScreenStepView.CANNOT_FOUND_DRIVER);
    });
    onConnect(() => {
      console.log('onSocketCustomerConnected');
    });
    onOrderDelivered(handleCustomerSocketOrderDelivered);
    onOrderDelivering(handleCustomerSocketOrderDelivering);
    onConnectError(onSocketCustomerConnectionError);
  }, []);
  //#endregion

  //#region Handle event

  const onFindDriverClick = useCallback(() => {
    if (orderRequest) {
      createOrder({
        ...orderRequest,
        shippingTypeId: deliveryDriverSelected?.id,
        promotionCode: promotions?.[0]?.code,
      }).then(rs => {
        if (rs?.data?.orderCode) {
          dispatch(addOrderCode(rs?.data?.orderCode));
          setCurrentOrderCode(rs?.data?.orderCode);
          setStepView(ScreenStepView.FIND_DRIVER);
          reFetchOrderDetailData();
        } else {
          setStepView(ScreenStepView.CANNOT_FOUND_DRIVER);
        }
      });
    }
  }, [orderRequest, createOrder, deliveryDriverSelected]);
  //#endregion

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
            restaurant={orderDetailData?.restaurant}
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
      </ViewCus>
    </>
  );
};

export default Delivery;
