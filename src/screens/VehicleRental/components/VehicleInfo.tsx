import React, { useCallback } from 'react';
import {
  IconApp,
  StarsRating,
  TextCus,
  TouchCus,
  ViewCus,
  ImageCus,
} from 'components';
import { StyleSheet } from 'react-native';
import { IconName } from 'assets';
import { BaseStyle, Colors } from 'theme';
import { NavigationService, Routes } from 'navigation';
import { useVehicleRental } from 'hooks';
import { IRestaurantDetail } from 'types';
import { formatDistanceKm } from 'utils';
import { Images } from 'assets';

interface IProps {
  detailRestaurant: IRestaurantDetail;
  promotionNumber: number;
}

const VehicleInfo: React.FC<IProps> = props => {
  const { detailGarage } = useVehicleRental();
  return (
    <ViewCus style={styles.wrapperContent}>
      <ViewCus style={styles.avatar}>
        <ImageCus source={Images.AvatarVehicle} size={80} />
      </ViewCus>
      <ViewCus items-center mt-30>
        <TextCus
          heading4
          style={[BaseStyle.flex1, BaseStyle.flexShrink1]}
          numberOfLines={2}>
          {detailGarage?.name}
        </TextCus>
      </ViewCus>
      <ViewCus mt-10 mb-10>
        <ViewCus
          f-1
          flex-row
          items-center
          justify-space-between
          style={styles.infor}>
          <TextCus color-grey82>{detailGarage?.address}</TextCus>
        </ViewCus>
      </ViewCus>
      <ViewCus flex-row items-center justify-space-between>
        <ViewCus flex-row items-center>
          <IconApp name={IconName.Start} size={16} color={Colors.yellowF8} />
          <TextCus useI18n paramI18n={{ number: props.promotionNumber }} ml-8>
            Vote
          </TextCus>
        </ViewCus>
        <ViewCus h-30 w-2 bg-grey84 />
        <ViewCus flex-row items-center>
          <TextCus useI18n paramI18n={{ number: props.promotionNumber }} ml-8>
            {detailGarage?.number_responses}+ phản hồi
          </TextCus>
        </ViewCus>
        <ViewCus h-30 w-2 bg-grey84 />
        <ViewCus flex-row items-center>
          <TextCus useI18n paramI18n={{ number: props.promotionNumber }} ml-8>
            {detailGarage?.number_rentals}+ lượt thuê
          </TextCus>
        </ViewCus>
      </ViewCus>
    </ViewCus>
  );
};
const styles = StyleSheet.create({
  infor: {
    justifyContent: 'center',
  },
  avatar: {
    height: 80,
    width: 80,
    position: 'absolute',
    top: -30,
    alignSelf: 'center',
  },
  wrapperContent: {
    margin: 16,
    backgroundColor: Colors.white,
    shadowColor: Colors.black,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowRadius: 8,
    shadowOpacity: 0.12,
    elevation: 8,
    padding: 16,
    borderRadius: 12,
    marginBottom: 24,
  },
  icon: {
    flex: 0.1,
    alignItems: 'flex-end',
    textAlign: 'right',
  },
  contentStar: {
    flexDirection: 'row',
    paddingVertical: 12,
    marginVertical: 12,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderTopColor: Colors.greyEE,
    borderBottomColor: Colors.greyEE,
  },
});
export default VehicleInfo;
