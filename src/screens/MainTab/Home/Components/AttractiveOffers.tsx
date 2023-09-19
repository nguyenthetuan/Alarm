import { Images } from 'assets';
import {
  CarouselHorizontal,
  ImageCus,
  TextCus,
  TouchCus,
  ViewCus,
} from 'components';
import { NavigationService, Routes } from 'navigation';
import React, { useCallback } from 'react';
import { Image, StyleSheet } from 'react-native';
import { Colors } from 'theme';
import { getImage, width } from 'utils';
interface IProps {
  promotions: [];
  title: string;
}
const AttractiveOffers: React.FC<IProps> = ({ promotions, title }) => {
  const onPressItem = useCallback(item => {
    NavigationService.navigate(Routes.RestaurantDetail, {
      restaurantId: item.id,
      distance: item?.distance,
    });
  }, []);

  const renderItem = useCallback(
    ({ item }) => {
      return (
        <TouchCus onPress={() => onPressItem(item)} style={[styles.mr5]} b-5>
          <ViewCus style={styles.container}>
            <ImageCus
              source={{ uri: getImage({ image: `${item.avatar}` }) }}
              style={styles.imagePromotion}
            />
            <ViewCus fex-1 p-18>
              <TextCus heading5 useI18n numberOfLines={1}>
                {item?.name}
              </TextCus>
              <ViewCus style={{ width: '95%' }}>
                <TextCus useI18n numberOfLines={1}>
                  {item?.address}
                </TextCus>
              </ViewCus>
              <ViewCus flex-row justify-space-between mt-24>
                <ViewCus
                  style={{
                    width: '48%',
                  }}
                  flex-row
                  items-center
                  justify-center
                  bg-seashellPeach
                  br-6
                  pt-5
                  pb-5>
                  <Image source={Images.map} />
                  <TextCus l-3 ml-2>
                    {Number(item?.distance || 0).toFixed(0)}km
                  </TextCus>
                </ViewCus>
                <ViewCus
                  style={{
                    width: '48%',
                  }}
                  flex-row
                  items-center
                  justify-center
                  bg-seashellPeach
                  br-6
                  pt-5
                  pb-5>
                  <Image source={Images.clock} />
                  <TextCus l-3 ml-2>
                    {item?.open_time?.time}
                  </TextCus>
                </ViewCus>
              </ViewCus>
            </ViewCus>
          </ViewCus>
        </TouchCus>
      );
    },
    [promotions],
  );
  return (
    <CarouselHorizontal
      data={promotions}
      title={title}
      onPress={() => NavigationService.navigate(Routes.Categories)}
      renderItem={renderItem}
    />
  );
};

const styles = StyleSheet.create({
  mr5: {
    marginHorizontal: 10,
    marginBottom: 10,
    borderRadius: 16,
  },
  imagePromotion: {
    height: 158,
    width: '100%',
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
  },
  container: {
    width: width / 1.4,
    shadowColor: '#8a8989',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.22,
    shadowRadius: 10.24,
    backgroundColor: Colors.white,
    elevation: 5,
    borderRadius: 16,
  },
});
export default AttractiveOffers;
