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
import { getImage, isIos } from 'utils';
import { IPromotion } from 'types';
interface IProps {
  promotions: [];
  title: string;
}
const AttractiveOffers: React.FC<IProps> = ({ promotions, title }) => {
  const onPressItem = useCallback(() => {
    NavigationService.navigate(Routes.Categories);
  }, []);

  const renderItem = useCallback(
    ({ item }) => {
      return (
        <TouchCus onPress={onPressItem} style={[styles.mr5]} b-5>
          <ViewCus style={styles.container}>
            <ImageCus
              source={{ uri: getImage({ image: `/${item.avatar}` }) }}
              style={styles.imagePromotion}
              resizeMode="cover"
            />
            <ViewCus fex-1 pb-10>
              <TextCus heading5 useI18n>
                {item?.name}
              </TextCus>
              <ViewCus style={{ width: '60%' }}>
                <TextCus useI18n l-5 numberOfLines={1}>
                  {item?.address}
                </TextCus>
              </ViewCus>
              <ViewCus flex-row justify-space-between pl-5 pr-5>
                <ViewCus
                  flex-row
                  items-center
                  bg-seashellPeach
                  pl-20
                  pr-20
                  br-6
                  pt-5
                  pb-5>
                  <Image source={Images.map} />
                  <TextCus l-3>{item?.distance}</TextCus>
                </ViewCus>
                <ViewCus
                  flex-row
                  items-center
                  bg-seashellPeach
                  pl-30
                  pr-20
                  br-6
                  pt-5
                  pb-5>
                  <Image source={Images.clock} />
                  <TextCus l-3>{item?.open_time?.time}</TextCus>
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
      onPress={() => NavigationService.navigate(Routes.Promotion)}
      renderItem={renderItem}
    />
  );
};
const styles = StyleSheet.create({
  mr5: {
    marginHorizontal: 10,
    borderRadius: 16,
  },
  imagePromotion: {
    height: 148,
    width: 240,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
  },
  container: {
    shadowOffset: { width: 1, height: 1 },
    shadowColor: 'rgba(171, 78, 43, 0.16)',
    shadowOpacity: 1,
    elevation: 10,
    shadowRadius: 1,
    borderRadius: 16,
    backgroundColor: Colors.white,
  },
});
export default AttractiveOffers;
