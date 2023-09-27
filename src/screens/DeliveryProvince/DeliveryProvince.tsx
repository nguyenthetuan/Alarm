import { Buttons, HomeLayout, TextCus, ViewCus } from 'components';
import React, {
  useCallback,
  useMemo,
  useRef,
  useState,
  useEffect,
} from 'react';
import { Colors } from 'theme';
// import styles from './styles';
import { useBackHandler } from '@react-native-community/hooks';
import { NavigationService, Routes } from 'navigation';
import {
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  TouchableWithoutFeedback,
} from 'react-native';
import ChooseFromTo from './components/ChooseFromTo';
import EnterReceiver from './screens/EnterReceiver';
import SetUpOrder from './screens/SetUpOrder';
import { useDeliveryProvince, useLocation } from 'hooks';
import PreviewOder from './screens/PreiewOder';
import { IPage, location } from 'types';
import { formatMoney } from 'utils';
import { useCart } from 'context/CartContext';
import Toast from 'react-native-toast-message';

enum DeliveryProvinceStep {
  CHOOSE_FROM_TO,
  SETUP_ORDER,
  ENTER_RECEIVER,
  PREVIEW_ODER,
}
export default function DeliveryProvince() {
  const {
    getListProductType,
    getListSpecificationType,
    getListDeliveryMethod,
    getListAddon,
    distance,
    postDelivery,
  } = useDeliveryProvince();
  const {
    orderItems: carts,
    price,
    updateLocationOrder: updateLocation,
    location: cartLocation,
    note,
    setNote,
    setOrderRequest,
    setDeliveryFee,
  } = useCart();
  const chooseFromToRef = useRef();
  const enterReceiverRef = useRef();
  const setUpOderRef = useRef();
  const [viewStep, setViewStep] = useState(DeliveryProvinceStep.CHOOSE_FROM_TO);
  const [fromToData, setFromToData] = useState<location>(null);
  const [receiverInfo, setReceiverInfo] = useState<any>(null);
  const [inforOder, setInforOder] = useState<any>({});
  const { locationUser } = useLocation();
  const titleView = useMemo(() => {
    switch (viewStep) {
      case DeliveryProvinceStep.SETUP_ORDER:
        if (receiverInfo) {
          return 'Kiểm tra đơn';
        } else {
          return 'Chi tiết đơn hàng';
        }

      case DeliveryProvinceStep.ENTER_RECEIVER:
        return 'Thông tin người nhận';
      case DeliveryProvinceStep.PREVIEW_ODER:
        return 'Chi tiết đơn hàng';

      default:
        return 'Giao hàng liên tỉnh';
    }
  }, [viewStep]);
  const onBackHandle = useCallback(() => {
    switch (viewStep) {
      case DeliveryProvinceStep.CHOOSE_FROM_TO:
        NavigationService.goBack();
        break;
      case DeliveryProvinceStep.SETUP_ORDER:
        setViewStep(DeliveryProvinceStep.CHOOSE_FROM_TO);
        break;

      case DeliveryProvinceStep.ENTER_RECEIVER:
        setViewStep(DeliveryProvinceStep.SETUP_ORDER);
        break;
      case DeliveryProvinceStep.PREVIEW_ODER:
        setViewStep(DeliveryProvinceStep.ENTER_RECEIVER);
        break;
      default:
        break;
    }
    return true;
  }, [viewStep, receiverInfo]);

  const bottomView = useMemo(() => {
    switch (viewStep) {
      case DeliveryProvinceStep.CHOOSE_FROM_TO:
        return (
          <ViewCus px-16 style={[styles.spacingBottom]}>
            <Buttons
              onPress={() => {
                if (
                  chooseFromToRef.current?.isValid?.() &&
                  chooseFromToRef.current?.checkFromTo
                ) {
                  setFromToData(chooseFromToRef.current?.getValue());
                  setViewStep(DeliveryProvinceStep.SETUP_ORDER);
                }
              }}
              disabled={false}
              loading={false}
              style={[]}>
              <TextCus useI18n bold heading5 color={Colors.white}>
                Bắt đầu đặt đơn
              </TextCus>
            </Buttons>
          </ViewCus>
        );
      case DeliveryProvinceStep.SETUP_ORDER:
        return (
          <ViewCus p-16 style={styles.popUpCaculator}>
            <ViewCus flex-row style={[{}]}>
              <TextCus heading5 f-1>
                Tổng cộng{' '}
              </TextCus>
              <TextCus heading1 bold color={Colors.main}>
                {formatMoney(distance[0]?.price || 0)}
              </TextCus>
            </ViewCus>
            <ViewCus mt-16 mb-16>
              <Buttons
                onPress={() => {
                    console.log('Tom log  => setUpOderRef.current?.getValue?.()?.specification', setUpOderRef.current?.getValue?.()?.specification);
                    
                  if (setUpOderRef?.current?.isValid?.()) {
                    setInforOder(setUpOderRef.current?.getValue?.());
                    setViewStep(DeliveryProvinceStep.ENTER_RECEIVER);
                  } else if (
                    !setUpOderRef.current?.getValue?.()?.deliveryMethod
                  ) {
                    Toast.show({
                      text1: 'Vui lòng chọn hình thức vận chuyển',
                      position: 'top',
                      type: 'error',
                    });
                  } else if (!setUpOderRef.current?.getValue?.()?.weight) {
                    Toast.show({
                      text1: 'Vui lòng nhập khối lượng',
                      position: 'top',
                      type: 'error',
                    });
                  } else if (!setUpOderRef.current?.getValue?.()?.productType) {
                    Toast.show({
                      text1: 'Vui lòng chọn loại hàng hóa',
                      position: 'top',
                      type: 'error',
                    });
                  } else if (
                    !setUpOderRef.current?.getValue?.()?.specification
                  ) {
                    Toast.show({
                      text1: 'Vui lòng chọn loại quy cách',
                      position: 'top',
                      type: 'error',
                    });
                  }
                }}
                disabled={false}
                loading={false}
                style={[]}>
                <TextCus useI18n bold heading5 color={Colors.white}>
                  Tiếp tục
                </TextCus>
              </Buttons>
            </ViewCus>
          </ViewCus>
        );

      case DeliveryProvinceStep.ENTER_RECEIVER:
        return (
          <ViewCus px-16 style={[styles.spacingBottom]}>
            <Buttons
              onPress={() => {
                if (enterReceiverRef.current?.isValid?.()) {
                  setReceiverInfo(enterReceiverRef.current?.getValue());
                  setViewStep(DeliveryProvinceStep.PREVIEW_ODER);
                }
              }}
              disabled={false}
              loading={false}
              style={[]}>
              <TextCus useI18n bold heading5 color={Colors.white}>
                Xem đơn hàng
              </TextCus>
            </Buttons>
          </ViewCus>
        );
      case DeliveryProvinceStep.PREVIEW_ODER:
        return (
          <ViewCus p-16 style={styles.popUpCaculator}>
            <ViewCus flex-row style={[{}]}>
              <TextCus heading5 f-1>
                Tổng cộng{' '}
              </TextCus>
              <TextCus heading1 bold color={Colors.main}>
                {formatMoney(distance[0]?.price || 0)}
              </TextCus>
            </ViewCus>
            <ViewCus mt-16 mb-16>
              <Buttons
                onPress={() => {
                  postDelivery(
                    {
                      pickupLocation: fromToData.from,
                      dropoffLocation: fromToData.to,
                      addon: inforOder.addon,
                      vehicle: 'MOTORBIKE',
                      productType: inforOder.productType,
                      specification: inforOder.specification,
                      deliveryMethod: inforOder.deliveryMethod,
                      distance: inforOder.distance,
                      weight: inforOder.weight,
                      receiverPhone: receiverInfo.receiverPhone,
                      receiverName: receiverInfo.receiverName,
                      receiverHouseNumber: receiverInfo.receiverHouseNumber,
                      driverNote: receiverInfo.driverNote,
                      price: distance[0]?.price,
                    },
                    response => {
                      if (response.status === 200) {
                        Toast.show({
                          text1: 'Tạo đơn hàng thành công',
                          position: 'top',
                          type: 'success',
                        });
                        NavigationService.navigate(Routes.HomeTabs);
                        // setDeliveryFee(response.data.result[0].price);
                        // NavigationService.navigate(Routes.shipment, {
                        //   order_code: response.data.result[0].id,
                        // });
                      } else {
                        Toast.show({
                          text1: 'Tạo đơn hàng thất bại',
                          text2: 'Vui lòng thử lại sau',
                          position: 'top',
                          type: 'error',
                        });
                      }
                    },
                  );
                }}
                disabled={false}
                loading={false}
                style={[]}>
                <TextCus useI18n bold heading5 color={Colors.white}>
                  Đặt giao hàng
                </TextCus>
              </Buttons>
            </ViewCus>
          </ViewCus>
        );
      default:
        return <></>;
    }
  }, [viewStep, receiverInfo, distance]);
  const mainView = useMemo(() => {
    switch (viewStep) {
      case DeliveryProvinceStep.CHOOSE_FROM_TO:
        return (
          <ScrollView
            keyboardShouldPersistTaps="always"
            onPointerUpCapture={() => Keyboard.dismiss()}>
            <ChooseFromTo ref={chooseFromToRef} fromToData={fromToData} />
          </ScrollView>
        );

      case DeliveryProvinceStep.SETUP_ORDER:
        if (fromToData) {
          return (
            <ScrollView>
              <SetUpOrder
                fromToData={fromToData}
                ref={setUpOderRef}
                inforOder={inforOder}
              />
            </ScrollView>
          );
        } else {
          setViewStep(DeliveryProvinceStep.CHOOSE_FROM_TO);
          return <></>;
        }

      case DeliveryProvinceStep.ENTER_RECEIVER:
        if (fromToData) {
          return (
            <ScrollView>
              <EnterReceiver
                receiverInfo={receiverInfo}
                ref={enterReceiverRef}
                fromToData={fromToData}
              />
            </ScrollView>
          );
        } else {
          setViewStep(DeliveryProvinceStep.CHOOSE_FROM_TO);
          return <></>;
        }
      case DeliveryProvinceStep.PREVIEW_ODER:
        if (fromToData) {
          return (
            <ScrollView>
              <PreviewOder
                fromToData={fromToData}
                ref={setUpOderRef}
                inforOder={inforOder}
                receiverInfo={receiverInfo}
              />
            </ScrollView>
          );
        } else {
          setViewStep(DeliveryProvinceStep.CHOOSE_FROM_TO);
          return <></>;
        }
      default:
        return <></>;
    }
  }, [viewStep, fromToData]);
  useBackHandler(onBackHandle);

  useEffect(() => {
    getListDeliveryMethod(
      {
        page: 1,
        limit: 1,
        search: '',
      } as IPage,
      () => {},
    );
    getListProductType(
      {
        page: 1,
        limit: 1,
        search: '',
      } as IPage,
      () => {},
    );
    getListSpecificationType(
      {
        page: 1,
        limit: 1,
        search: '',
      } as IPage,
      () => {},
    );
    getListAddon(
      {
        page: 1,
        limit: 1,
        search: '',
      } as IPage,
      () => {},
    );
    updateLocation(fromToData?.to || locationUser);
  }, [getListProductType, getListDeliveryMethod, getListAddon, fromToData]);
  return (
    // <BottomSheetModalProvider>
    <HomeLayout
      bgColor={Colors.white}
      header={{
        title: titleView,
        iconColor: Colors.black,
        onPressLeft: onBackHandle,
      }}
      f-1>
      <TouchableWithoutFeedback
        onPress={() => {
          Keyboard.dismiss();
        }}>
        <KeyboardAvoidingView
          style={[styles.content]}
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
          <>
            {mainView}
            {bottomView}
          </>
        </KeyboardAvoidingView>
      </TouchableWithoutFeedback>
    </HomeLayout>
    // </BottomSheetModalProvider>
  );
}

const styles = StyleSheet.create({
  content: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  flex1: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  spacingBottom: {
    ...Platform.select({
      android: {
        paddingBottom: 10,
      },
      ios: {
        paddingBottom: 30,
      },
    }),
    paddingTop: 10,
  },
  popUpCaculator: {
    backgroundColor: Colors.white,
    borderTopStartRadius: 16,
    borderTopEndRadius: 16,
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.3,
    elevation: 20,
  },
});
