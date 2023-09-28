import React, { useCallback } from 'react';
import { ImageCus, TextCus, TouchCus, ViewCus } from 'components';
import { BaseStyle, Colors } from 'theme';
import { Images } from 'assets';
import { ImageBackground, Platform, StyleSheet } from 'react-native';
import { getImage, width } from 'utils';
import { IPromotionListItem } from 'types';
import { useTranslation } from 'react-i18next';
import moment from 'moment';
import { useCart } from 'context/CartContext';

interface IProps {
  item: IPromotionListItem;
  isAppliable?: boolean;
  onPress?: () => void | undefined;
}

const PromotionItem: React.FC<IProps> = ({ onPress, item, isAppliable }) => {
  const { t } = useTranslation();
  // const { setSelectedPromos, selectedPromos } = useCategories();
  const { setPromotions, promotions } = useCart();
  const isApplied = promotions[0] && promotions[0]?.id === item?.id;
  const handleApplyPromo = useCallback(() => {
    if (item && !isApplied) {
      setPromotions([item]);
      return;
    } else {
      setPromotions([]);
    }
    // setSelectedPromos([]);
  }, [item, isApplied]);

  if (!item) {
    return <></>;
  }

  return (
    <ImageBackground source={Images.bgPromotion} style={styles.bgImageCover}>
      <TouchCus style={styles.wrapperItem} onPress={onPress!}>
        <ViewCus mr-12>
          {item && (
            <ImageCus
              source={{ uri: getImage({ image: item.image_url }) }}
              style={styles.image}
              resizeMode="contain"
            />
          )}
        </ViewCus>
        <ViewCus style={{ flex: 1 }} ml-15>
          <TextCus subhead bold>
            {item?.code}
          </TextCus>
          <TextCus bold color={Colors.blue47}>
            {item?.name}
          </TextCus>
          <TextCus
            useI18n
            color-grey85
            mb-5
            numberOfLines={1}
            paramI18n={{ name: t(item.usable_catalog) }}>
            {item?.usable_catalog === 'ALL'
              ? 'promotion.apply_for_all'
              : 'promotion.apply_for'}
          </TextCus>
          <ViewCus style={[BaseStyle.flexRowSpaceBetwwen]}>
            <TextCus
              useI18n
              caption
              fl-1
              color-grey85
              paramI18n={{
                time: moment(Number(item.end_date ?? 0)).format('DD/MM/yyyy'),
              }}>
              promotion.expired
            </TextCus>
            {isAppliable && (
              <TouchCus onPress={handleApplyPromo}>
                <TextCus
                  semiBold
                  useI18n
                  {...{ [`color-${isApplied ? 'grey84' : 'main'}`]: true }}>
                  {!isApplied ? 'promotion.apply' : 'action.cancel'}
                </TextCus>
              </TouchCus>
            )}
          </ViewCus>
        </ViewCus>
      </TouchCus>
    </ImageBackground>
  );
};
const styles = StyleSheet.create({
  image: {
    width: 75,
    height: 75,
  },
  wrapperItem: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  bgImageCover: {
    width: width - 32,
    resizeMode: 'contain',
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.12,
    shadowRadius: 20,
    elevation: 20,
    marginBottom: 16,
    ...Platform.select({
      android: {
        paddingHorizontal: 18,
        height: 120,
      },
      ios: {
        paddingHorizontal: 16,
        height: 114,
      },
    }),
    borderRadius: 6,
  },
});
export default PromotionItem;
