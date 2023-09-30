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
import { BottomSheetModalProvider } from '@gorhom/bottom-sheet';
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
import { useRequestDelivery, useLocation } from 'hooks';
import PreviewOder from './screens/PreiewOder';
import { IPage, location } from 'types';
import { formatMoney } from 'utils';
import { useCart } from 'context/CartContext';
import { Portal } from 'react-native-paper';

enum RequestDeliveryStep {
  CHOOSE_FROM_TO,
  SETUP_ORDER,
  ENTER_RECEIVER,
  CHECK_FINAL_TO_ORDER,
  PREVIEW_ODER,
}
export default function RequestDelivery() {
  const {
    getListProductType,
    getListDeliveryMethod,
    getListAddon,
    distance,
    postDelivery,
  } = useRequestDelivery();
  const { updateLocationOrder: updateLocation, setDeliveryFee } = useCart();
  const chooseFromToRef = useRef();
  const enterReceiverRef = useRef();
  const setUpOderRef = useRef();
  const [viewStep, setViewStep] = useState(RequestDeliveryStep.CHOOSE_FROM_TO);
  const [fromToData, setFromToData] = useState<location>(null);
  const [receiverInfo, setReceiverInfo] = useState<any>(null);
  const [inforOder, setInforOder] = useState<any>({});
  const { locationUser } = useLocation();
  const titleView = useMemo(() => {
    switch (viewStep) {
      case RequestDeliveryStep.SETUP_ORDER:
        if (receiverInfo) {
          return 'Kiểm tra đơn';
        } else {
          return 'Chi tiết đơn hàng';
        }

      case RequestDeliveryStep.ENTER_RECEIVER:
        return 'Thông tin người nhận';
      case RequestDeliveryStep.PREVIEW_ODER:
        return 'Chi tiết đơn hàng';

      default:
        return 'Giao hàng';
    }
  }, [viewStep]);
  const onBackHandle = useCallback(() => {
    switch (viewStep) {
      case RequestDeliveryStep.CHOOSE_FROM_TO:
        NavigationService.goBack();
        break;
      case RequestDeliveryStep.SETUP_ORDER:
        setViewStep(RequestDeliveryStep.CHOOSE_FROM_TO);
        break;

      case RequestDeliveryStep.ENTER_RECEIVER:
        setViewStep(RequestDeliveryStep.SETUP_ORDER);
        break;
      case RequestDeliveryStep.PREVIEW_ODER:
        setViewStep(RequestDeliveryStep.ENTER_RECEIVER);
        break;
      default:
        break;
    }
    return true;
  }, [viewStep, receiverInfo]);

  const bottomView = useMemo(() => {
    switch (viewStep) {
      case RequestDeliveryStep.CHOOSE_FROM_TO:
        return (
          <ViewCus px-16 style={[styles.spacingBottom]}>
            <Buttons
              onPress={() => {
                if (
                  chooseFromToRef.current?.isValid?.() &&
                  chooseFromToRef.current?.checkFromTo
                ) {
                  setFromToData(chooseFromToRef.current?.getValue());
                  setViewStep(RequestDeliveryStep.SETUP_ORDER);
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
      case RequestDeliveryStep.SETUP_ORDER:
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
                  if (setUpOderRef.current?.isValid?.()) {
                    setInforOder(setUpOderRef.current?.getValue?.());
                    setViewStep(RequestDeliveryStep.ENTER_RECEIVER);
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

      case RequestDeliveryStep.ENTER_RECEIVER:
        return (
          <ViewCus px-16 style={[styles.spacingBottom]}>
            <Buttons
              onPress={() => {
                if (enterReceiverRef.current?.isValid?.()) {
                  setReceiverInfo(enterReceiverRef.current?.getValue());
                  setViewStep(RequestDeliveryStep.PREVIEW_ODER);
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
      case RequestDeliveryStep.PREVIEW_ODER:
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
                        setDeliveryFee(response.data.result[0].price);
                        NavigationService.navigate(Routes.shipment, {
                          order_code: response.data.result[0].id,
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
      case RequestDeliveryStep.CHOOSE_FROM_TO:
        return (
          <ScrollView
            keyboardShouldPersistTaps="always"
            onPointerUpCapture={() => Keyboard.dismiss()}>
            <ChooseFromTo ref={chooseFromToRef} fromToData={fromToData} />
          </ScrollView>
        );

      case RequestDeliveryStep.SETUP_ORDER:
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
          setViewStep(RequestDeliveryStep.CHOOSE_FROM_TO);
          return <></>;
        }

      case RequestDeliveryStep.ENTER_RECEIVER:
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
          setViewStep(RequestDeliveryStep.CHOOSE_FROM_TO);
          return <></>;
        }
      case RequestDeliveryStep.PREVIEW_ODER:
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
          setViewStep(RequestDeliveryStep.CHOOSE_FROM_TO);
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
      bgColor={Colors.main}
      header={{
        title: titleView,
        iconColor: Colors.white,
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
    backgroundColor: Colors.greyF7,
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
