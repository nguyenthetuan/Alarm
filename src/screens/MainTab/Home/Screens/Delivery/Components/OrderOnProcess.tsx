import React, { useEffect, useState } from 'react';
import { BottomSheetScrollView } from '@gorhom/bottom-sheet';
import Icon from 'assets/svg/Icon';
import {
  Card,
  ImageCus,
  RoutineLocaltion,
  RoutineStep,
  StarsRating,
  TextCus,
  TouchCus,
  ViewCus,
} from 'components';
import { BaseStyle, Colors } from 'theme';
import { IOrderDetail } from 'types';
// import { useCategories } from 'hooks';
// import { useEffect } from 'react';
import {
  STEP_DATA,
  formatMoney,
  getWidthBySpace,
  width,
  getImage,
  openLink,
} from 'utils';
import styles from './styles';
import { useGeo } from 'hooks';
import { Images } from 'assets';

interface IProps {
  orderDetailData?: IOrderDetail | null;
  onCancel: () => void;
  onMessageDetail?: (i: any) => void;
  infoDriverDb?: any;
  priceDelivery?: any;
}

const OrderOnProcess: React.FC<IProps> = props => {
  //#region Static
  const { onNameByLatLng } = useGeo();
  //#endregion

  const [fromName, setFromName] = useState('');
  const [toName, setToName] = useState('');

  useEffect(() => {
    if (props.orderDetailData) {
      onNameByLatLng(
        {
          latitude: props.orderDetailData.restaurant.location.lat,
          longitude: props.orderDetailData.restaurant.location.long,
        },
        rs => {
          if (rs) {
            setFromName(rs);
          }
        },
      );
      onNameByLatLng(
        {
          latitude: props.orderDetailData.customer.lat,
          longitude: props.orderDetailData.customer.long,
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

  const callDriver = () => {
    if (props?.infoDriverDb?.phone_number) {
      openLink('telephone', props?.infoDriverDb?.phone_number);
    }
  };
  const messageDriver = () => {
    props?.onMessageDetail?.(props?.infoDriverDb);
  };

  return (
    <ViewCus flex-1 flex-column flexGrow-1 style={[styles.w100]}>
      <BottomSheetScrollView>
        <ViewCus style={styles.w100} px-16>
          <ViewCus flex-row pt-5 pb-15 items-center style={styles.headerStatus}>
            <Icon.IconClock />
            <TextCus color={Colors.black} useI18n heading4 medium ml-10>
              delivery.driverAreComingStore
            </TextCus>
          </ViewCus>
          <ViewCus
            style={{ width: width - 40 }}
            flex-row
            mt-22
            justify-space-between
            items-center>
            <ViewCus flex-row items-center style={{ width: '68%' }}>
              <ViewCus flex-row items-center>
                <ViewCus items-center w-60 h-60>
                  {props?.infoDriverDb?.avatar && (
                    <ImageCus
                      source={{
                        uri: getImage({
                          image: props?.infoDriverDb?.avatar,
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
                  {!props?.infoDriverDb?.avatar && (
                    <ImageCus
                      source={
                        props?.infoDriverDb?.type === 'car'
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
                <ViewCus ml-10 mb-5>
                  <TextCus
                    numberOfLines={1}
                    color={'#2E2E2E'}
                    useI18n
                    heading5
                    regular
                    mb-5
                    style={{ width: '110%' }}>
                    {props?.infoDriverDb?.full_name}
                  </TextCus>
                  <TextCus style={styles.infor}>99-H7 7060</TextCus>
                  <TextCus style={styles.infor}>Honda Air Blade</TextCus>
                  {/*<StarsRating point={5} onChangePoint={() => {}} size={15} />*/}
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
        </ViewCus>
        <TouchCus onPress={props.onCancel} style={styles.btnDetail} m-16 mt-32>
          <TextCus color={Colors.main} useI18n heading4 medium>
            Huỷ yêu cầu
          </TextCus>
        </TouchCus>
        <ViewCus p-16 flex-row justify-space-between items-center>
          <ViewCus flex-row>
            <ViewCus>
              <TextCus heading4 bold useI18n color={Colors.black3A}>
                delivery.onProcessing
              </TextCus>
              <TextCus
                useI18n
                mainSize
                style={{
                  color: Colors.grey85,
                }}>
                delivery.orderIsSending
              </TextCus>
            </ViewCus>
            <TextCus
              mainSize
              style={{
                color: Colors.grey85,
              }}>
              ...
            </TextCus>
          </ViewCus>
          <TouchCus onPress={props.onCancel}>
            <TextCus
              useI18n
              mainSize
              style={{
                color: Colors.success,
              }}>
              action.cancel
            </TextCus>
          </TouchCus>
        </ViewCus>

        <ViewCus items-center p-6 p-16>
          <RoutineStep keyValue={2} listData={STEP_DATA} />
        </ViewCus>

        <Card hasShadow={true} mt-40 mr-16 ml-16 style={styles.boxShadow}>
          <ViewCus>
            <ViewCus>
              <TextCus mainSize bold color={Colors.black3A}>
                {props.orderDetailData?.restaurant?.name}
              </TextCus>
            </ViewCus>

            <ViewCus flex-row justify-space-between>
              <ViewCus flex-row>
                <TextCus mainSize color={Colors.grey85} useI18n>
                  delivery.totalMoney
                </TextCus>
                <TextCus mainSize color={Colors.grey85}>
                  :
                </TextCus>
              </ViewCus>

              <TextCus heading5 bold color={Colors.main}>
                {formatMoney(
                  props.orderDetailData?.order_price + props.priceDelivery,
                )}
              </TextCus>
            </ViewCus>
            <ViewCus flex-row justify-space-between>
              <ViewCus flex-row>
                <TextCus mainSize color={Colors.grey85} useI18n>
                  category.special_fee
                </TextCus>
                <TextCus mainSize color={Colors.grey85}>
                  :
                </TextCus>
              </ViewCus>

              <TextCus heading8>{formatMoney(props.priceDelivery)}</TextCus>
            </ViewCus>
            <ViewCus flex-row justify-space-between>
              <TextCus mainSize color={Colors.grey85} />
              <TextCus
                heading5
                bold
                color={Colors.grey85}
                style={{
                  textDecorationLine: 'line-through',
                }}>
                {formatMoney(props.orderDetailData?.discount_order)}
              </TextCus>
            </ViewCus>
            <ViewCus mt-12>{Icon.Line(getWidthBySpace(32))}</ViewCus>

            {/* List item in order */}
            <ViewCus>
              {props.orderDetailData.order_items.map((itemData, index) => {
                return (
                  <ViewCus key={index} mt-12 flex-row justify-space-between>
                    <ViewCus flex-row>
                      <TextCus mainSize bold mr-4 color={Colors.black3A}>
                        {itemData.quantity}x
                      </TextCus>
                      <TextCus mainSize color={Colors.black3A}>
                        {itemData.item_name}
                      </TextCus>
                    </ViewCus>

                    <TextCus mainSize color={Colors.grey85}>
                      {formatMoney(itemData.price)}
                    </TextCus>
                  </ViewCus>
                );
              })}
            </ViewCus>
            {/* End list item in order */}
          </ViewCus>
        </Card>

        <Card mt-12 mr-16 ml-16 hasShadow={true}>
          <RoutineLocaltion
            style={[styles.w100]}
            from={fromName}
            to={toName}
            note={props.orderDetailData?.note}
          />
        </Card>
      </BottomSheetScrollView>
    </ViewCus>
  );
};

export default OrderOnProcess;
