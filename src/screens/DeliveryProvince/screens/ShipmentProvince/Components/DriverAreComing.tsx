import { BottomSheetScrollView, BottomSheetView } from '@gorhom/bottom-sheet';
import { Images } from 'assets';
import {
  Buttons,
  Card,
  ImageCus,
  TextCus,
  TouchCus,
  ViewCus,
} from 'components';
import { useAuth, useGeo, useOrders } from 'hooks';
import React, { useCallback, useEffect, useState } from 'react';
import { Image, Text, View } from 'react-native';
import { BaseStyle, Colors } from 'theme';
import { IDriver_OrderDetail, IOrderDetail } from 'types';
import { formatMoney, getImage, openLink } from 'utils';
import { ScreenStepView } from '../Shipment';
import styles from './styles';
interface IProps {
  orderDetailData?: IOrderDetail | null;
  onCancel: () => void;
  status: any;
  onMessageDetail?: (i: any) => void;
  infoDriverDb?: any;
}

const driverInfomation = (
  driverInfo: IDriver_OrderDetail | null | undefined,
  infoDriverDb?: any,
  onMessageDetail?: (i: any) => void,
) => {
  const callDriver = () => {
    if (infoDriverDb?.phone_number) {
      openLink('telephone', infoDriverDb.phone_number);
    }
  };

  const messageDriver = () => {
    onMessageDetail?.(infoDriverDb);
  };

  return (
    <ViewCus>
      <ViewCus pt-10 pl-10 pr-10 flex-row justify-space-between items-center>
        <ViewCus flex-row items-center px-5 mb-5>
          {/* <ViewCus items-flex-start w-32 /> */}
          <ViewCus>
            {infoDriverDb?.avatar && (
              <ImageCus
                source={{
                  uri: getImage({
                    image: infoDriverDb?.avatar,
                  }),
                }}
                style={[
                  {
                    width: 48,
                    height: 48,
                    borderRadius: 100,
                    borderWidth: 1,
                    borderColor: Colors.greyEE,
                    marginRight: 10,
                  },
                ]}
                resizeMode="cover"
              />
            )}

            {!infoDriverDb?.avatar && (
              <ImageCus
                source={Images.driver}
                style={[
                  BaseStyle.flexGrow1,
                  BaseStyle['w100%'],
                  BaseStyle['h100%'],
                ]}
                resizeMode="cover"
              />
            )}
          </ViewCus>
          <ViewCus>
            <TextCus style={styles.name}>{infoDriverDb?.full_name}</TextCus>
            <TextCus style={styles.infor}>Air Blade 99-H7 7060</TextCus>
          </ViewCus>
        </ViewCus>
        <ViewCus flex-row>
          <TouchCus onPress={callDriver} style={styles.btnCall}>
            <Image source={Images.call} />
          </TouchCus>
          <TouchCus onPress={messageDriver} style={styles.btnCall} ml-10>
            <Image source={Images.message} />
          </TouchCus>
        </ViewCus>
      </ViewCus>
      <ViewCus style={styles.w100} px-16>
        <ViewCus flex-column justify-center>
          {driverInfo?.full_name && (
            <ViewCus mt-12>
              <TextCus textAlign="center" heading2>
                {driverInfo?.full_name}
              </TextCus>
            </ViewCus>
          )}
        </ViewCus>
      </ViewCus>
    </ViewCus>
  );
};
const DriverAreComing: React.FC<IProps> = props => {
  const { getFoodDetailByCode } = useOrders();
  const [listItemDetail, setListItemDetail] = useState({});
  const callCenter = () => {
    openLink('telephone', '19008079');
  };
  const { userInfo } = useAuth();
  const { onNameByLatLng } = useGeo();
  const [fromName, setFromName] = useState('');
  const [toName, setToName] = useState('');
  const [status, setStatus] = useState(
    props.status || ScreenStepView.DRIVER_ARE_COMING,
  );
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
          .catch((e: TypeError) => {});
      }
    }
  }, [props.orderDetailData]);

  const cancelOder = () => {
    // refModal?.current?.show();
    refModal.current.handleClosePress();
  };

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
    setStatus(props.status);
  }, [props.orderDetailData, props.status]);

  if (!props.orderDetailData) {
    return <></>;
  }
  const renderStatus = useCallback(() => {
    if (status === ScreenStepView.DRIVER_ARE_COMING) {
      return <Text style={styles.txtPick}>Tài xế đang đến </Text>;
    } else if (status === ScreenStepView.DRVER_MOVING) {
      return <Text style={styles.txtPick}>Tài xế đang giao hàng</Text>;
    }
  }, [status]);

  const headerInformation = () => {
    return (
      <ViewCus flex-1 ml-20 mr-20>
        <ViewCus mt-12 style={styles.lineBack} />
        <ViewCus mt-10 mb-10>
          <ViewCus flex-row mt-10 item-center>
            <ViewCus style={styles.dot} />
            {renderStatus()}
          </ViewCus>
          <TextCus style={styles.textWeadth}>Thời tiết xấu</TextCus>
        </ViewCus>
        <ViewCus mt-12 style={styles.lineBack} />
        <ViewCus mt-20 mb-20>
          <TextCus style={styles.textWeadth}>Thời gian dự kiến</TextCus>
          <Text ml-0 style={styles.txtPick}>
            12:41
          </Text>
        </ViewCus>
        <ViewCus mt-12 style={styles.lineBack} />
      </ViewCus>
    );
  };

  const renderRoutineLocation = () => {
    return (
      <ViewCus flex-1 flex-row pl-20 items-center mt-20>
        <ViewCus>
          <View style={styles.wrapImage}>
            <Image source={Images.dot} style={{ marginBottom: 10 }} />
            <Image source={Images.colum} />
            <Image source={Images.place} style={{ marginTop: 10 }} />
            <ViewCus />
          </View>
        </ViewCus>
        <ViewCus>
          <ViewCus mb-10>
            <TextCus>{userInfo.full_name}</TextCus>
            <TextCus>{fromName}</TextCus>
          </ViewCus>
          <ViewCus mt-10>
            <TextCus>{props?.orderDetailData?.receiver_name}</TextCus>
            <TextCus>{toName}</TextCus>
          </ViewCus>
        </ViewCus>
      </ViewCus>
    );
  };
  return (
    <ViewCus pb-30>
      <BottomSheetScrollView showsVerticalScrollIndicator={false}>
        <BottomSheetView>
          {headerInformation()}
          {driverInfomation(
            props?.orderDetailData?.driver,
            props?.infoDriverDb,
            props?.onMessageDetail,
          )}
          <Card mt-10 pt-5 pb-5 mr-16 ml-16 hasShadow={true}>
            <TextCus bold>Chi tiết đơn hàng</TextCus>
          </Card>
          {renderRoutineLocation()}
          <ViewCus
            flex-row
            items-center
            justify-space-between
            pl-10
            pr-20
            mt-20>
            <ViewCus justify-center>
              <TextCus style={styles.txtPick}>Mã đơn hàng</TextCus>
              <TextCus ml-3 style={styles.infor}>
                {props?.orderDetailData?.order_code}
              </TextCus>
            </ViewCus>
            <Image source={Images.code} />
          </ViewCus>
          <ViewCus mt-12 style={styles.lineBack} />
          <Card mt-10 pt-5 pb-5 mr-16 ml-16 hasShadow={true}>
            <TextCus bold>Chỉnh sửa chi tiết</TextCus>
          </Card>
        </BottomSheetView>
        <ViewCus>
          <ViewCus p-16>
            <ViewCus flex-row justify-space-between mt-2>
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
            <ViewCus flex-row justify-space-between mt-2>
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
            <ViewCus flex-row justify-space-between>
              <ViewCus flex-row>
                <TextCus mainSize bold useI18n>
                  Tổng cộng
                </TextCus>
                <TextCus mainSize color={Colors.grey85}>
                  :
                </TextCus>
              </ViewCus>
              <TextCus heading5 bold color={Colors.main}>
                {formatMoney(props.orderDetailData?.price)}
              </TextCus>
            </ViewCus>
          </ViewCus>
          <Buttons
            mt-10
            ml-10
            mr-10
            style={styles.buttoCancel}
            onPress={props.onCancel}
            disabled={false}>
            <TextCus
              bold
              useI18n
              mainSize
              style={{
                color: Colors.main,
              }}>
              cencalRequire
            </TextCus>
          </Buttons>
        </ViewCus>
      </BottomSheetScrollView>
    </ViewCus>
  );
};

export default DriverAreComing;
