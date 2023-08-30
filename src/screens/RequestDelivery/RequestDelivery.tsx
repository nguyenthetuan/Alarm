import { Buttons, HomeLayout, TextCus, ViewCus } from 'components';
import React, { useCallback, useMemo, useRef, useState } from 'react';
import { Colors } from 'theme';
// import styles from './styles';
import { BottomSheetModalProvider } from '@gorhom/bottom-sheet';
import { useBackHandler } from '@react-native-community/hooks';
import { NavigationService } from 'navigation';
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
} from 'react-native';
import ChooseFromTo from './components/ChooseFromTo';
import EnterReceiver from './screens/EnterReceiver';
import SetUpOrder from './screens/SetUpOrder';

enum RequestDeliveryStep {
  CHOOSE_FROM_TO,
  SETUP_ORDER,
  ENTER_RECEIVER,
  CHECK_FINAL_TO_ORDER,
}
export default function RequestDelivery() {
  //#region Static

  //#endregion

  //#region Ref control
  const chooseFromToRef = useRef();
  const enterReceiverRef = useRef();
  //#endregion

  //#region State
  const [viewStep, setViewStep] = useState(RequestDeliveryStep.CHOOSE_FROM_TO);
  const [fromToData, setFromToData] = useState(null);
  const [receiverInfo, setReceiverInfo] = useState(null);
  //#endregion

  //#region Values
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

      default:
        return 'Giao hàng';
    }
  }, [viewStep]);
  //#endregion

  //#region Func
  const onBackHandle = useCallback(() => {
    switch (viewStep) {
      case RequestDeliveryStep.CHOOSE_FROM_TO:
        NavigationService.goBack();
        break;
      case RequestDeliveryStep.SETUP_ORDER:
        if (receiverInfo) {
          setViewStep(RequestDeliveryStep.ENTER_RECEIVER);
        } else {
          setViewStep(RequestDeliveryStep.CHOOSE_FROM_TO);
        }
        break;

      case RequestDeliveryStep.ENTER_RECEIVER:
        setReceiverInfo(null);
        setViewStep(RequestDeliveryStep.SETUP_ORDER);
        break;

      default:
        break;
    }
    return true;
  }, [viewStep, receiverInfo]);
  //#endregion

  //#region Render
  const bottomView = useMemo(() => {
    switch (viewStep) {
      case RequestDeliveryStep.CHOOSE_FROM_TO:
        return (
          <ViewCus px-16 style={[styles.spacingBottom]}>
            <Buttons
              onPress={() => {
                if (chooseFromToRef.current?.isValid?.()) {
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
          <ViewCus
            p-16
            // pt-20
            style={[
              {
                backgroundColor: Colors.white,
                borderTopStartRadius: 16,
                borderTopEndRadius: 16,
                shadowColor: Colors.black,
                shadowOffset: { width: 0, height: 0 },
                shadowOpacity: 0.3,
                elevation: 20,
              },
            ]}>
            <ViewCus flex-row style={[{}]}>
              <TextCus heading5 f-1>
                Tổng cộng{' '}
              </TextCus>
              <TextCus heading1 bold color={Colors.main}>
                19.000đ
              </TextCus>
            </ViewCus>
            <ViewCus mt-16 mb-16>
              <Buttons
                onPress={() => {
                  if (receiverInfo == null) {
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
                  setViewStep(RequestDeliveryStep.SETUP_ORDER);
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

      default:
        return <></>;
    }
  }, [viewStep, receiverInfo]);
  const mainView = useMemo(() => {
    switch (viewStep) {
      case RequestDeliveryStep.CHOOSE_FROM_TO:
        return (
          <ScrollView keyboardShouldPersistTaps="always">
            <ChooseFromTo ref={chooseFromToRef} />
          </ScrollView>
        );

      case RequestDeliveryStep.SETUP_ORDER:
        if (fromToData) {
          return (
            <ScrollView>
              <SetUpOrder fromToData={fromToData} />
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
              <EnterReceiver ref={enterReceiverRef} fromToData={fromToData} />
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

  //#endregion

  //#region Watch change

  useBackHandler(onBackHandle);

  //#endregion

  return (
    <BottomSheetModalProvider>
      <HomeLayout
        bgColor={Colors.main}
        header={{
          title: titleView,
          iconColor: Colors.white,
          onPressLeft: onBackHandle,
        }}>
        <KeyboardAvoidingView
          style={[styles.content]}
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
          {mainView}

          {bottomView}
        </KeyboardAvoidingView>
      </HomeLayout>
    </BottomSheetModalProvider>
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
});
