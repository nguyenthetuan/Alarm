import { BottomSheetView } from '@gorhom/bottom-sheet';
import { Images } from 'assets';
import Icon from 'assets/svg/Icon';
import { ImageCus, TextCus, TouchCus, ViewCus } from 'components';
import React from 'react';
import { ScrollView, View } from 'react-native';
import { BaseStyle } from 'theme';
import { FindCarType, IDriver_OrderDetail, IOrderDetail } from 'types';
import { getImage, height, openLink, width } from 'utils';
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

const DriverArrived: React.FC<IProps> = props => {
  const driverInfomation = (
    driverInfo: IDriver_OrderDetail | null | undefined,
  ) => {
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
            <ViewCus w-32 />
            <ViewCus ml-20 items-center w-68 h-68>
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
            <TextCus bold useI18n heading3 alignSelf="center">
              Tài xế đã đến nơi
            </TextCus>
          </BottomSheetView>
        </View>
      </ScrollView>
    </ViewCus>
  );
};

export default DriverArrived;
