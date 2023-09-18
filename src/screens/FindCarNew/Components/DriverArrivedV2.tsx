import { BottomSheetView } from '@gorhom/bottom-sheet';
import { Images } from 'assets';
import Icon from 'assets/svg/Icon';
import { ImageCus, StarsRating, TextCus, TouchCus, ViewCus } from 'components';
import React, { useState } from 'react';
import { ScrollView, View } from 'react-native';
import { BaseStyle, Colors } from 'theme';
import { FindCarType, IDriver_OrderDetail, IOrderDetail } from 'types';
import { formatMoney, getImage, height, openLink, width } from 'utils';
import styles from './styles';

interface IProps {
  type: FindCarType;
  orderDetailData?: IOrderDetail | null;
  fromToData?: {
    from: {
      address: string;
      lat: number;
      long: number;
    };
    to: {
      address: string;
      lat: number;
      long: number;
    };
  };
  DeliveryInfo: object;
  onCancel: () => void;
  onLayout: (height: number) => void;
  onMessageDetail?: (i: any) => void;
  infoDriverDb?: any;
}

const DriverArrivedV2: React.FC<IProps> = props => {
  const infoDriverDb = props?.infoDriverDb;
  const [isShowDetail, setisShowDetail] = useState(false);

  const driverInfomation = (
    driverInfo: IDriver_OrderDetail | null | undefined,
  ) => {
    const callDriver = () => {
      if (driverInfo?.phone_number) {
        openLink('telephone', driverInfo.phone_number);
      }
    };

    const messageDriver = () => {
      props?.onMessageDetail?.(infoDriverDb);
    };

    return (
      <ViewCus>
        <ViewCus style={styles.w100} px-16>
          {!isShowDetail && (
            <ViewCus
              flex-row
              pb-20
              pt-5
              items-center
              style={styles.headerStatus}>
              <Icon.IconClock />
              <TextCus color={Colors.black} useI18n heading4 medium ml-10>
                Tài xế đã đến nơi
              </TextCus>
            </ViewCus>
          )}
          {isShowDetail && (
            <TouchCus onPress={() => setisShowDetail(!isShowDetail)}>
              <TextCus>{'Thu gọn'}</TextCus>
            </TouchCus>
          )}
          <ViewCus
            style={{ width: width - 40 }}
            flex-row
            mt-22
            mb-32
            justify-space-between
            items-center>
            <ViewCus flex-row items-center style={{ width: '68%' }}>
              <ViewCus flex-row items-center>
                <ViewCus items-center w-60 h-60>
                  {infoDriverDb?.avatar && (
                    <ImageCus
                      source={{
                        uri: getImage({
                          image: infoDriverDb?.avatar,
                        }),
                      }}
                      style={[
                        BaseStyle.flexGrow1,
                        BaseStyle['w100%'],
                        BaseStyle['h100%'],
                        {
                          borderRadius: 100,
                          borderWidth: 1,
                          borderColor: Colors.greyEE,
                        },
                      ]}
                      resizeMode="stretch"
                    />
                  )}
                  {!infoDriverDb?.avatar && (
                    <ImageCus
                      source={
                        infoDriverDb?.type === 'car'
                          ? Images.carDriverAvatar
                          : Images.bikeDriverAvatar
                      }
                      style={[
                        BaseStyle.flexGrow1,
                        BaseStyle['w100%'],
                        BaseStyle['h100%'],
                      ]}
                      resizeMode="stretch"
                    />
                  )}
                </ViewCus>
                <ViewCus ml-10 mb-5 style={{ width: '70%' }}>
                  <TextCus
                    numberOfLines={1}
                    color={'#2E2E2E'}
                    useI18n
                    heading5
                    regular
                    mb-5>
                    {`Tài xế ${infoDriverDb?.full_name}`}
                  </TextCus>
                  <StarsRating point={5} onChangePoint={() => {}} size={15} />
                </ViewCus>
              </ViewCus>
            </ViewCus>

            <ViewCus flex-row items-center>
              <TouchCus pr-8 onPress={callDriver}>
                <Icon.PhoneDriver width={44} height={44} />
              </TouchCus>
              <TouchCus onPress={messageDriver}>
                <Icon.MessageDriver width={44} height={44} />
              </TouchCus>
            </ViewCus>
          </ViewCus>
          {!isShowDetail && (
            <ViewCus>
              <TouchCus
                onPress={() => {
                  setisShowDetail(!isShowDetail);
                }}
                style={styles.btnDetail}>
                <TextCus color={Colors.main} useI18n heading4 medium>
                  Chi tiết đơn hàng
                </TextCus>
              </TouchCus>
              <ViewCus items-center>
                <TextCus color={'#4772D7'} mt-12>
                  Liên hệ tổng đài để hủy đơn
                </TextCus>
              </ViewCus>
            </ViewCus>
          )}
        </ViewCus>
      </ViewCus>
    );
  };
  return (
    <ViewCus>
      <ScrollView>
        <View
          onLayout={e =>
            props.onLayout(e.nativeEvent.layout.height + (height * 100) / 812)
          }>
          <BottomSheetView>
            {driverInfomation({
              ...props.DeliveryInfo?.motorcycleTaxi?.driver,
              type: props.type,
            })}
          </BottomSheetView>
          {isShowDetail && (
            <>
              <ViewCus mt-20 pl-30 pr-30>
                <TextCus mb-10 color={'#6D7E91'}>
                  Điểm bắt đầu:
                </TextCus>
                <ViewCus items-center flex-row>
                  <Icon.CurrentLocation color={'#24c062'} />
                  <TextCus ml-10 fl-1 numberOfLines={1}>
                    {props.fromToData.from.address}
                  </TextCus>
                </ViewCus>
              </ViewCus>

              <ViewCus mt-20 pl-30 pr-30>
                <TextCus mb-10 color={'#6D7E91'}>
                  Điểm đến:
                </TextCus>
                <ViewCus items-center flex-row>
                  <Icon.IconLocationActive color={'#24c062'} />
                  <TextCus ml-10 fl-1 numberOfLines={1}>
                    {props?.fromToData?.to?.address}
                  </TextCus>
                </ViewCus>
              </ViewCus>

              <ViewCus
                mt-12
                mb-12
                style={[styles.w100, { backgroundColor: '#EEEEEE', height: 4 }]}
              />

              <ViewCus pl-30 pr-30>
                <TextCus heading5 color={'#6D7E91'}>
                  Thông tin cuốc
                </TextCus>
                <ViewCus mt-10 flex-row items-center justify-space-between>
                  <TextCus>Loại dịch vụ</TextCus>
                  <TextCus>Tài xế ce máy</TextCus>
                </ViewCus>
                <ViewCus mt-10 flex-row items-center justify-space-between>
                  <TextCus>Loại xe</TextCus>
                  <TextCus>Honde Air Black</TextCus>
                </ViewCus>

                <ViewCus mt-10 flex-row items-center justify-space-between>
                  <TextCus>Biển số xe</TextCus>
                  <TextCus>99-H7 7060</TextCus>
                </ViewCus>

                <ViewCus mt-10 flex-row items-center justify-space-between>
                  <TextCus>Cước phí</TextCus>
                  <TextCus>
                    {formatMoney(
                      props?.DeliveryInfo?.motorcycleTaxi?.price?.toFixed(0),
                    )}
                  </TextCus>
                </ViewCus>

                <ViewCus mt-10 flex-row items-center justify-space-between>
                  <TextCus>Ưu đãi</TextCus>
                  <TextCus>-0đ</TextCus>
                </ViewCus>
              </ViewCus>
              <ViewCus
                btw-1
                style={{ borderColor: '#EEEEEE' }}
                mt-10
                flex-row
                pl-30
                pr-30
                items-center
                pt-10
                justify-space-between>
                <TextCus>Thanh toán tiền mặt</TextCus>
                <TextCus bold color={Colors.main}>
                  {formatMoney(
                    props?.DeliveryInfo?.motorcycleTaxi?.price?.toFixed(0),
                  )}
                </TextCus>
              </ViewCus>

              <ViewCus mt-30 items-center>
                <TouchCus
                  items-center
                  pt-10
                  pb-10
                  br-10
                  disabled={true}
                  style={{ backgroundColor: '#ADB1B9', width: width - 30 }}>
                  <TextCus color={Colors.white}>Huỷ đơn</TextCus>
                </TouchCus>
                <TextCus color={'#4772D7'} mt-12>
                  Liên hệ tổng đài để hủy đơn
                </TextCus>
              </ViewCus>
            </>
          )}
        </View>
      </ScrollView>
    </ViewCus>
  );
};

export default DriverArrivedV2;
