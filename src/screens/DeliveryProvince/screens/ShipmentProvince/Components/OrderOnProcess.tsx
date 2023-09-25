import { BottomSheetScrollView } from '@gorhom/bottom-sheet';
import { HomeLayout, IconCus, RoutineStep, TextCus, ViewCus } from 'components';
import React, { useEffect, useState } from 'react';
import { Image } from 'react-native';
import { Colors } from 'theme';
import { IOrderDetail } from 'types';
// import { useCategories } from 'hooks';
// import { useEffect } from 'react';
import { Images } from 'assets';
import { useAuth, useGeo } from 'hooks';
import { STEP_DATA, formatMoney } from 'utils';
import styles from './styles';
interface IProps {
  orderDetailData?: IOrderDetail | null;
  onCancel: () => void;
}

const OrderOnProcess: React.FC<IProps> = props => {
  const { userInfo } = useAuth();
  const { onNameByLatLng } = useGeo();
  const [fromName, setFromName] = useState('');
  const [toName, setToName] = useState('');
  useEffect(() => {
    if (props.orderDetailData) {
      onNameByLatLng(
        {
          latitude: props.orderDetailData.dropoff_location.lat,
          longitude: props.orderDetailData.dropoff_location.long,
        },
        rs => {
          if (rs) {
            setFromName(rs);
          }
        },
      );
      onNameByLatLng(
        {
          latitude: props.orderDetailData.pickup_location.lat,
          longitude: props.orderDetailData.pickup_location.long,
        },
        rs => {
          if (rs) {
            setToName(rs);
          }
        },
      );
    }
  }, [props.orderDetailData]);

  if (!props.orderDetailData) {
    return <></>;
  }

  const rerderInforSenderReceiver = () => {
    return (
      <>
        <ViewCus f-1>
          <ViewCus flex-row>
            <Image
              source={Images.personActive}
              style={styles.imagePersonSender}
            />
            <TextCus l-10 style={styles.text}>
              Đang xác nhận đơn hàng
            </TextCus>
          </ViewCus>
          <TextCus l-10 style={styles.subHeader}>
            Thông tin giao hàng của bạn đang được xử lý.
          </TextCus>
          <TextCus l-10 style={styles.text} mt-20>
            Chi tiết đơn hàng
          </TextCus>
          <ViewCus flex-row mt-10>
            <Image
              source={Images.personActive}
              style={styles.imagePersonSender}
            />
            <TextCus l-10 style={styles.text}>
              Người gửi
            </TextCus>
          </ViewCus>
          <TextCus style={styles.textInfor}>
            {props?.orderDetailData?.customer?.full_name} -{' '}
            {props?.orderDetailData?.customer?.phone_number} -{' '}
            {userInfo?.address}
          </TextCus>
        </ViewCus>
        <ViewCus f-1 mt-10 mb-10>
          <ViewCus flex-row>
            <Image source={Images.person} style={styles.imageReceive} />
            <TextCus l-10 style={styles.text}>
              Người nhận
            </TextCus>
          </ViewCus>
          <TextCus style={styles.textInfor}>
            {props?.orderDetailData?.receiver_name} -{' '}
            {props?.orderDetailData?.receiver_phone} -{' '}
            {props?.orderDetailData?.receiver_house_number}
          </TextCus>
        </ViewCus>

        <ViewCus f-1 mt-10 mb-10 flex-row justify-space-between>
          <TextCus style={styles.editDetail}>Chỉnh sửa chi tiết</TextCus>
          <IconCus name={'arrow-right'} size={15} color={Colors.grey85} />
        </ViewCus>
      </>
    );
  };

  return (
    <HomeLayout
      bgColor={Colors.white}
      header={{
        title: 'Kiểm tra đơn hàng',
        iconColor: Colors.black,
        // onPressLeft: onBackHandle,
      }}>
      <ViewCus flex-1 flex-column flexGrow-1 style={[styles.w100]}>
        <BottomSheetScrollView>
          <ViewCus items-center p-6 p-16>
            <RoutineStep keyValue={3} listData={STEP_DATA} />
          </ViewCus>
          <ViewCus pl-20 pr-20>
            {rerderInforSenderReceiver()}
          </ViewCus>
          {/* <Card hasShadow={true} mt-40 mr-16 ml-16 style={styles.boxShadow}> */}
          <ViewCus>
            <ViewCus mt-12 style={styles.line} />
            <ViewCus flex-row justify-space-between pl-20 pr-20 mt-50>
              <ViewCus flex-row>
                <TextCus mainSize bold useI18n>
                  Tổng cộng
                </TextCus>
                <TextCus mainSize color={Colors.grey85}>
                  :
                </TextCus>
              </ViewCus>
              <TextCus heading5 bold>
                {formatMoney(props.orderDetailData?.price)}
              </TextCus>
            </ViewCus>
            <ViewCus flex-row justify-space-between pl-20 pr-20 mt-2>
              <ViewCus flex-row>
                <TextCus mainSize color={Colors.grey85} useI18n>
                  Phí áp dụng
                </TextCus>
                <TextCus mainSize color={Colors.grey85}>
                  :
                </TextCus>
              </ViewCus>
              <TextCus bold>
                {formatMoney(
                  props.orderDetailData?.price -
                    props.orderDetailData?.addon.price,
                )}
              </TextCus>
            </ViewCus>
            <ViewCus flex-row justify-space-between pl-20 pr-20 mt-2>
              <ViewCus flex-row>
                <TextCus mainSize color={Colors.grey85} useI18n>
                  Đảm bảo hàng hoá
                </TextCus>
                <TextCus mainSize color={Colors.grey85}>
                  :
                </TextCus>
              </ViewCus>
              <TextCus bold>
                {formatMoney(props.orderDetailData?.addon.price)}
              </TextCus>
            </ViewCus>

            <ViewCus flex-row justify-space-between pl-20 pr-20 mt-30>
              <ViewCus flex-row>
                <TextCus mainSize color={Colors.grey85} useI18n>
                  Người gưi trả tiền mặt
                </TextCus>
                <TextCus mainSize color={Colors.grey85}>
                  :
                </TextCus>
              </ViewCus>
              <TextCus bold style={styles.change}>
                Thay đổi
              </TextCus>
            </ViewCus>
          </ViewCus>
        </BottomSheetScrollView>
      </ViewCus>
    </HomeLayout>
  );
};

export default OrderOnProcess;
