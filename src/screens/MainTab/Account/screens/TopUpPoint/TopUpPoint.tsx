import Clipboard from '@react-native-clipboard/clipboard';
import { Icons } from 'assets';
import Icon from 'assets/svg/Icon';
import { HomeLayout, ScrollViewCus, TextCus, ViewCus } from 'components';
import React, { useState } from 'react';
import { Image, StyleSheet, TouchableOpacity } from 'react-native';
import Toast from 'react-native-toast-message';
import { Colors } from 'theme';

export default function TopUpPoint() {
  const [chooseBank, setChooseBank] = useState('VCB');

  const showToast = () => {
    Toast.show({
      type: 'success',
      text2: 'Sao chép thành công',
    });
  };
  const copyVCB = data => {
    Clipboard.setString(data);
    showToast();
  };
  return (
    <HomeLayout
      bgColor={Colors.main}
      header={{
        notGoBack: false,
        title: 'Thông tin chuyển khoản',
        iconColor: Colors.white,
      }}>
      <ScrollViewCus>
        <ViewCus
          style={{ backgroundColor: Colors.greyF7, flex: 1, marginBottom: 40 }}>
          <ViewCus
            style={{
              backgroundColor: Colors.white,
              paddingHorizontal: 16,
              paddingVertical: 12,
              marginBottom: 12,
            }}>
            <TextCus heading4 medium>
              Để hoàn tất yêu cầu vui lòng cọc tiền thuê xe
            </TextCus>
            <TextCus>
              Sao chép nội dung chuyển khoản bên dưới và thực hiện thanh toán
              chuyển khoản. Sau khi đã hoàn thành phần chuyển khoản, bấm “Hoàn
              tất” để trở về trang chủ.
            </TextCus>
          </ViewCus>
          <ViewCus
            style={{
              backgroundColor: Colors.white,
              paddingHorizontal: 16,
              paddingVertical: 12,
            }}>
            <TextCus heading3 medium>
              THÔNG TIN CHUYỂN KHOẢN
            </TextCus>
            <ViewCus style={{ flexDirection: 'row', marginBottom: 12 }}>
              {/* <TouchableOpacity
              style={{ marginRight: 12 }}
              onPress={() => setChooseBank('VCB')}>
              <Image
                source={
                  chooseBank === 'VCB' ? Icons.IconVCBChoose : Icons.IconVCB
                }
              />
            </TouchableOpacity> */}
              <TouchableOpacity onPress={() => setChooseBank('TECH')}>
                <Image
                  source={
                    //   chooseBank === 'VCB' ? Icons.IconTech : Icons.IconTechChoose
                    Icons.IconMbBank
                  }
                />
              </TouchableOpacity>
            </ViewCus>
            {/* {chooseBank === 'VCB' ? ( */}
            <ViewCus>
              <TextCus heading5 medium style={{ marginBottom: 4 }}>
                MB Bank{' '}
              </TextCus>
              <TextCus heading5 medium style={{ marginBottom: 4 }}>
                Ngân hàng Thương mại cổ phần Quân đội{' '}
              </TextCus>
              <TextCus heading5 regular style={{ marginBottom: 4 }}>
                Tên tài khoản:{' '}
                <TextCus heading5 medium>
                  CTY TNHH ĐT PT CÔNG NGHỆ BIGCODE{' '}
                </TextCus>
              </TextCus>
              <ViewCus style={{ flexDirection: 'row', alignItems: 'center' }}>
                <TextCus
                  heading5
                  regular
                  style={{ marginBottom: 4, marginRight: 4 }}>
                  Số tài khoản:{' '}
                  <TextCus heading5 medium>
                    000935319739
                  </TextCus>
                </TextCus>
                <TouchableOpacity onPress={() => copyVCB('000935319739')}>
                  <Icon.IconCopy />
                </TouchableOpacity>
              </ViewCus>
            </ViewCus>
          </ViewCus>
          <ViewCus
            style={{
              backgroundColor: Colors.white,
              paddingHorizontal: 16,
              paddingVertical: 12,
            }}>
            <TextCus heading4 medium style={{ marginBottom: 8 }}>
              Vui lòng chuyển khoản theo đúng nội dung
            </TextCus>
            <TouchableOpacity
              onPress={() => copyVCB('Kich hoat tai khoan GBM')}>
              <Image source={Icons.IconCopyContent} resizeMode="center" />
            </TouchableOpacity>
            <ViewCus
              style={{
                marginTop: 12,
                flexDirection: 'row',
                alignItems: 'center',
              }}>
              <Icon.IconSp />
              <TextCus heading5 medium style={{ marginLeft: 4 }}>
                Chú ý
              </TextCus>
            </ViewCus>
            <ViewCus>
              <ViewCus style={{ flexDirection: 'row' }}>
                <TextCus style={{ marginRight: 4 }}>.</TextCus>
                <TextCus style={{ marginTop: 4 }}>
                  Chuyển tiền trong cùng hệ thống ngân hàng sẽ nhanh chóng hơn.
                  Việc thanh toán chỉ hoàn tất sau khi chuyển khoản hoàn tất và
                  chúng tôi đã nhận được thanh toán
                </TextCus>
              </ViewCus>
              <ViewCus style={{ flexDirection: 'row' }}>
                <TextCus style={{ marginRight: 4 }}>.</TextCus>
                <TextCus style={{ marginTop: 4 }}>
                  Vào thứ 7 và chủ nhật, hình thức chuyển khoản thường sẽ được
                  ngân hàng xử lý vào đầu tuần tiếp theo. Vì vậy hãy lựa chọn
                  hình thức chuyển khoản nhanh hoặc đổi sang phương thức thanh
                  toán khác để hoàn thành quá trình đặt cọc
                </TextCus>
              </ViewCus>
            </ViewCus>
            <ViewCus>
              <ViewCus>
                <ViewCus
                  style={{
                    marginTop: 12,
                    flexDirection: 'row',
                    alignItems: 'center',
                  }}>
                  <TextCus style={{ marginRight: 6 }}>Hỗ trợ:</TextCus>
                  <TextCus heading5 color={Colors.redFF}>
                    0969 111 561
                  </TextCus>
                </ViewCus>
                <ViewCus
                  style={{
                    marginTop: 12,
                    flexDirection: 'row',
                    alignItems: 'center',
                  }}>
                  <TextCus style={{ marginRight: 6 }}>Email:</TextCus>
                  <TextCus heading5 color={Colors.redFF}>
                    gobervietnam@gmail.com{' '}
                  </TextCus>
                </ViewCus>
              </ViewCus>
            </ViewCus>
          </ViewCus>
        </ViewCus>
      </ScrollViewCus>

      <Toast visibilityTime={1000} topOffset={0} />
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
