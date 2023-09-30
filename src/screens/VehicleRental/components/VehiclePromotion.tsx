import {
  CarouselHorizontal,
  ImageCus,
  TextCus,
  TouchCus,
  ViewCus,
} from 'components';
import { Images } from 'assets';
import { NavigationService, Routes } from 'navigation';
import React, { useCallback } from 'react';
import { ListRenderItem, StyleSheet } from 'react-native';
import { Colors } from 'theme';
import { IFood } from 'types';
import { formatMoney, getImage, width } from 'utils';
interface IProps {
  foods: IFood[];
}
const VehiclePromotion: React.FC<IProps> = ({ foods }) => {
  const onPressItem = useCallback((item: string) => {
    NavigationService.navigate(Routes.ExtraVehicle, {
      foodId: item,
    });
  }, []);
  const renderItem: ListRenderItem<IFood> = useCallback(({ item, index }) => {
    const { avatar, base_price, name, id, price } = item;
    return (
      <TouchCus
        onPress={() => onPressItem(id)}
        style={styles.boxShadowItem}
        key={index}>
        <ViewCus flex-row justify-space-between style={styles.wrapperContent}>
          <ViewCus>
            <TextCus heading5>{name}</TextCus>
            <ViewCus flex-row f-1 style={styles.contentPrice}>
              <TextCus heading5 main mr-5>
                {formatMoney(price)}
              </TextCus>
              {/* <TextCus style={styles.price}>{formatMoney(55000)}</TextCus> */}
            </ViewCus>
          </ViewCus>
          <ImageCus
            source={
              avatar
                ? { uri: getImage({ image: avatar }) }
                : Images.defaultStore
            }
            style={styles.imagePromotion}
            resizeMode="cover"
          />
        </ViewCus>
      </TouchCus>
    );
  }, []);
  return (
    <CarouselHorizontal
      data={foods}
      title={'home.title_promotion'}
      onPress={() => NavigationService.navigate(Routes.Promotion)}
      renderItem={renderItem}
    />
  );
};
const styles = StyleSheet.create({
  imagePromotion: {
    height: 90,
    width: 90,
    borderRadius: 4,
  },
  wrapperContent: {
    overflow: 'hidden',
  },
  boxShadowItem: {
    padding: 12,
    borderRadius: 8,
    backgroundColor: Colors.white,
    shadowColor: Colors.black,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowRadius: 8,
    shadowOpacity: 0.12,
    elevation: 8,
    width: width * 0.8,
    marginLeft: 16,
    marginBottom: 8,
    marginTop: 8,
  },
  contentPrice: {
    alignItems: 'center',
  },
  price: {
    textDecorationLine: 'line-through',
    color: Colors.grey85,
  },
});
export default VehiclePromotion;
