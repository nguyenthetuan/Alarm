import { BottomSheetView } from '@gorhom/bottom-sheet';
import { Images } from 'assets';
import Icon from 'assets/svg/Icon';
import { ImageCus, TextCus, TouchCus, ViewCus } from 'components';
import { useOrders } from 'hooks';
import React, { useEffect, useState } from 'react';
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
}

const DriverAreComing: React.FC<IProps> = props => {
  //#region Static
  const { getFoodDetailByCode } = useOrders();
  //#endregion

  //#region ScreenState
  // const [listItemDetail, setListItemDetail] = useState({});
  const [isShowDetail, setisShowDetail] = useState(false);
  //#endregion
  //#region handle event
  // const callCenter = () => {
  //   openLink('telephone', '19008079');
  // };
  //#endregion

  useEffect(() => {
    if (
      props?.orderDetailData &&
      props?.orderDetailData?.order_items?.length > 0
    ) {
      const listFunc = props.orderDetailData.order_items.map(x => {
        return new Promise(res => {
          getFoodDetailByCode(x.item_id, res);
        });
      });
      if (listFunc.length > 0) {
        Promise.all(listFunc)
          .then((values: any[]) => {
            const listData: any = values.map(x => x?.data?.result?.[0]);
            const rs = {};
            listData?.forEach?.(x => {
              rs[`${x.id}`] = { ...x };
            });
            setListItemDetail(rs);
          })
          .catch((e: TypeError) => {
            console.log(
              '🚀 ~ file: DriverAreComing.tsx:63 ~ useEffect ~ e:',
              e,
            );
          });
      }
    }
  }, [props.orderDetailData]);

  // if (!props.orderDetailData) {
  //   return <></>;
  // }

  const driverInfomation = (
    driverInfo: IDriver_OrderDetail | null | undefined,
    onPress: () => void,
  ) => {
    console.log('onPress', onPress);
    const callDriver = () => {
      if (driverInfo?.phone_number) {
        openLink('telephone', driverInfo.phone_number);
      }
    };
    return (
      <ViewCus>
        <ViewCus style={styles.w100} px-16>
          <ViewCus
            style={{ width: width - 40 }}
            flex-row
            justify-space-between
            items-center>
            <TouchCus onPress={() => setisShowDetail(!isShowDetail)}>
              <TextCus>{isShowDetail ? 'Thu gọn' : 'Chi tiết'}</TextCus>
            </TouchCus>
            <ViewCus items-center w-68 h-68>
              {driverInfo?.avatar && (
                <ImageCus
                  source={{
                    uri: getImage({
                      image: driverInfo?.avatar,
                    }),
                  }}
                  style={BaseStyle.flexGrow1}
                  resizeMode="stretch"
                />
              )}

              {!driverInfo?.avatar && (
                <ImageCus
                  source={
                    driverInfo?.type === 'car'
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
            <TouchCus pr-20 onPress={callDriver}>
              <Icon.PhoneCircle width={32} height={32} />
            </TouchCus>
          </ViewCus>
        </ViewCus>
        {/* <ViewCus style={styles.w100} px-16>
          <ViewCus flex-column justify-center>
            <ViewCus mt-12>
              <TextCus textAlign="center" useI18n heading4>
                delivery.driverAreComing
              </TextCus>
            </ViewCus>
            {driverInfo?.full_name && (
              <ViewCus mt-12>
                <TextCus textAlign="center" heading2>
                  {driverInfo?.full_name}
                </TextCus>
              </ViewCus>
            )}
          </ViewCus>
          <ViewCus mt-12>{Icon.Line(getWidthBySpace(32))}</ViewCus>
        </ViewCus> */}
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
          {/* <TouchCus onPress={() => setisShowDetail(!isShowDetail)}> */}
          <BottomSheetView>
            {driverInfomation({
              ...props.DeliveryInfo.motorcycleTaxi.driver,
              type: props.type,
            })}
            <TextCus bole useI18n heading3 alignSelf="center">
              Tài xế đã đến nơi
            </TextCus>
          </BottomSheetView>
          {/* </TouchCus> */}

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
                    {props.fromToData.to.address}
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
                      props.DeliveryInfo.motorcycleTaxi.price?.toFixed(0),
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
                    props.DeliveryInfo.motorcycleTaxi.price?.toFixed(0),
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

export default DriverAreComing;
