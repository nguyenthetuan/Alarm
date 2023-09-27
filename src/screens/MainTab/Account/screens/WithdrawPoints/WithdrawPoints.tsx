import { Icons } from 'assets';
import Icon from 'assets/svg/Icon';
import {
  BottomSheetCommon,
  HomeLayout,
  TextCus,
  TouchCus,
  ViewCus,
} from 'components';
import React, { useEffect, useRef, useState } from 'react';
import { Image, Keyboard, StyleSheet, TextInput } from 'react-native';
import { useSelector } from 'react-redux';
import { UserSelectors } from 'store/user';
import { Colors } from 'theme';
import { IRefBottom, IUserInfo } from 'types';
import { formatMoney } from 'utils';
import { postDrawCashWalletAPI } from 'utils/APIManager';

export default function WithdrawPoints({ route }) {
  const refBottom = useRef<IRefBottom>(null);
  const [accountNumber, setAccountNumer] = useState<number>(0);
  const [accountName, setAccountName] = useState('');
  const [bank, setBank] = useState('');
  const [point, setPoint] = useState(0);
  //   const [trigger, setTrigger] = useState(false);
  const [isShowSuccess, setIsShowSuccess] = useState('success');
  const { wallet } = route?.params;
  const [isKeyboardVisible, setKeyboardVisible] = useState(false);
  const userInfo = useSelector(
    UserSelectors.getAttrByKey('userInfo'),
  ) as IUserInfo;

  const postDrawCashWallet = async () => {
    const body = {
      user_id: userInfo?.id,
      type: 'OUT',
      price: point,
      account_number: accountNumber,
      bank: bank,
      account_name: accountName,
    };
    Keyboard.dismiss();
    if (wallet?.total_amount > 500000) {
      try {
        const res: any = postDrawCashWalletAPI(body);
        if (res) {
          //   setTrigger(true);
          refBottom?.current?.show();
          setIsShowSuccess('success');
        }
      } catch (error) {}
    }
    // else if()
    else {
      refBottom?.current?.show();
      setIsShowSuccess('fail');
    }
  };

  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      'keyboardDidShow',
      () => {
        setKeyboardVisible(true); // or some other action
      },
    );
    const keyboardDidHideListener = Keyboard.addListener(
      'keyboardDidHide',
      () => {
        setKeyboardVisible(false); // or some other action
      },
    );

    return () => {
      keyboardDidHideListener.remove();
      keyboardDidShowListener.remove();
    };
  }, []);
  return (
    <HomeLayout
      bgColor={Colors.main}
      header={{
        notGoBack: false,
        title: 'Rút điểm',
        iconColor: Colors.white,
      }}>
      <ViewCus
        style={{
          backgroundColor: Colors.greyF7,
          flex: 1,
        }}>
        {/* {renderTopContent()} */}
        <ViewCus style={styles.viewChooseDate}>
          <ViewCus style={styles.viewChooseDate1}>
            <ViewCus
              style={{
                flexDirection: 'row',
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              <Image source={Icons.IconWallet} />
              <TextCus heading5 regular style={{ marginLeft: 8 }}>
                Số dư hiện tại
              </TextCus>
            </ViewCus>

            <ViewCus style={styles.textChooseDate}>
              <TextCus heading3 color={Colors.main} style={{ marginRight: 10 }}>
                {formatMoney(wallet?.total_amount || 0)}
              </TextCus>
            </ViewCus>
          </ViewCus>
        </ViewCus>
        <ViewCus style={{ paddingHorizontal: 16, marginTop: 8 }}>
          <ViewCus style={styles.viewContentInput}>
            <TextCus heading4 medium>
              Số tài khoản
            </TextCus>
            <ViewCus style={styles.viewInput}>
              <TextInput
                style={styles.inputStyle}
                placeholder="Nhập số tài khoản"
                keyboardType={'numeric'}
                onChangeText={(value: number) => setAccountNumer(value)}
              />
            </ViewCus>
          </ViewCus>
          <ViewCus style={styles.viewContentInput}>
            <TextCus heading4 medium>
              Ngân hàng
            </TextCus>
            <ViewCus style={styles.viewInput}>
              <TextInput
                style={styles.inputStyle}
                placeholder="Nhập tên ngân hàng"
                onChangeText={(value: string) => setBank(value)}
              />
            </ViewCus>
          </ViewCus>
          <ViewCus style={styles.viewContentInput}>
            <TextCus heading4 medium>
              Tên chủ thẻ
            </TextCus>
            <ViewCus style={styles.viewInput}>
              <TextInput
                style={styles.inputStyle}
                placeholder="Nhập tên chủ thẻ"
                onChangeText={(value: string) => setAccountName(value)}
              />
            </ViewCus>
          </ViewCus>
          <ViewCus style={styles.viewContentInput}>
            <TextCus heading4 medium>
              Rút điểm
            </TextCus>
            <ViewCus style={styles.viewInput}>
              <TextInput
                style={styles.inputStyle}
                placeholder="Nhập số điểm bạn muốn rút"
                keyboardType={'numeric'}
                value={point}
                onChangeText={value => {
                  if (value > wallet?.total_amount) {
                    return;
                  } else {
                    setPoint(value);
                  }
                }}
              />
            </ViewCus>
          </ViewCus>
        </ViewCus>
      </ViewCus>
      <ViewCus style={{ alignItems: 'center', backgroundColor: Colors.greyF7 }}>
        <TouchCus
          disabled={
            point === 0 ||
            accountName === '' ||
            accountNumber === 0 ||
            bank === ''
          }
          style={[styles.btn, { marginBottom: isKeyboardVisible ? 300 : 32 }]}
          onPress={() => postDrawCashWallet()}>
          <TextCus color={Colors.white}>Gửi yêu cầu</TextCus>
        </TouchCus>
      </ViewCus>
      <BottomSheetCommon ref={refBottom} hideBackdrop={true}>
        <ViewCus style={{ alignItems: 'center' }}>
          {isShowSuccess === 'success' ? (
            <Icon.IconSuccess />
          ) : (
            <Icon.IconError />
          )}
          <ViewCus style={{ marginTop: 20 }}>
            <TextCus
              heading1
              color={
                isShowSuccess === 'success' ? Colors.blue47 : Colors.redAF
              }>
              {isShowSuccess === 'success'
                ? 'Gửi yêu cầu thành công'
                : 'Rút điểm không thành công'}
            </TextCus>
          </ViewCus>
          <ViewCus style={{ marginTop: 20, width: 300 }}>
            <TextCus textAlign={'center'}>
              {isShowSuccess === 'success'
                ? 'Bạn vừa gửi yêu cầu rút tiền thành công.Yêu cầu sẽ được xử lý trong vòng 2 giờ.'
                : ' Số điểm hiện tại của bạn chưa đạt số tối thiểu. Số dư tối thiểu là500.000đ'}
            </TextCus>
          </ViewCus>
        </ViewCus>
        <ViewCus
          style={{ alignItems: 'center', backgroundColor: Colors.greyF7 }}>
          <TouchCus
            style={styles.btn1}
            onPress={() => refBottom.current?.close()}>
            <TextCus color={Colors.white}>Hoàn tất</TextCus>
          </TouchCus>
        </ViewCus>
      </BottomSheetCommon>
    </HomeLayout>
  );
}
const styles = StyleSheet.create({
  viewInput: {
    borderWidth: 1,
    width: 260,
    height: 36,
    borderRadius: 8,
    borderColor: Colors.greyD9,
    justifyContent: 'center',
  },
  inputStyle: {
    width: 244,
    height: 32,
    paddingHorizontal: 8,
  },
  viewContentInput: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 12,
  },
  btn: {
    width: '80%',
    justifyContent: 'center',
    backgroundColor: Colors.main,
    alignItems: 'center',
    borderRadius: 16,
    paddingVertical: 10,
    flexDirection: 'row',
    marginBottom: 32,
  },
  btn1: {
    width: '80%',
    justifyContent: 'center',
    backgroundColor: Colors.main,
    alignItems: 'center',
    borderRadius: 16,
    paddingVertical: 10,
    flexDirection: 'row',
    marginTop: 16,
  },
  viewChooseDate: {
    justifyContent: 'center',
    alignItems: 'center',
    height: 90,

    shadowColor: Colors.shadow,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 8,
    marginTop: 30,
  },
  viewChooseDate1: {
    width: '90%',
    height: 80,
    backgroundColor: Colors.white,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  textChooseDate: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 4,
  },
});
