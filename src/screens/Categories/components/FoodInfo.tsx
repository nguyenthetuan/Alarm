import React, { useCallback } from 'react';
import { IconApp, StarsRating, TextCus, TouchCus, ViewCus } from 'components';
import { StyleSheet } from 'react-native';
import { IconName } from 'assets';
import { BaseStyle, Colors } from 'theme';
import { NavigationService, Routes } from 'navigation';
import { useCategories } from 'hooks';
import { IRestaurantDetail } from 'types';
import { formatDistanceKm } from 'utils';

interface IProps {
  detailRestaurant: IRestaurantDetail;
  promotionNumber: number;
}

const FoodInfo: React.FC<IProps> = props => {
  const { detailRestaurant } = useCategories();
  const onFoodDetail = useCallback(() => {}, []);
  const onCounpon = useCallback(() => {
    NavigationService.navigate(Routes.Promotion, {
      backPath: Routes.RestaurantDetail,
      params: { restaurantId: detailRestaurant.id },
    });
  }, [detailRestaurant]);
  return (
    <ViewCus style={styles.wrapperContent}>
      <TouchCus
        onPress={onFoodDetail}
        flex-row
        items-center
        justify-space-between>
        <TextCus
          heading4
          style={[BaseStyle.flex1, BaseStyle.flexShrink1]}
          numberOfLines={2}>
          {props.detailRestaurant.name}
        </TextCus>
        <IconApp name={IconName.ChevronRight} size={12} style={[styles.icon]} />
      </TouchCus>
      <ViewCus style={[styles.contentStar, BaseStyle.flexRowCenter]}>
        <StarsRating point={props.detailRestaurant.average_rating ?? 0} />
        <ViewCus f-1 flex-row>
          <TextCus mr-4>{props.detailRestaurant.average_rating ?? 0}</TextCus>
          <TextCus color-grey82>
            ({`${props.detailRestaurant.total_reviews}`} đánh giá)
          </TextCus>
          {props.detailRestaurant.distance && (
            <ViewCus style={[BaseStyle.flexRowCenter, { flex: 1 }]}>
              <TextCus color-grey82 px-5>
                |
              </TextCus>
              <TextCus color-grey82 numberOfLines={1} ellipsizeMode="tail">
                {' '}
                Trong bán kính{' '}
                {formatDistanceKm(props.detailRestaurant.distance)} km gần bạn
              </TextCus>
            </ViewCus>
          )}
        </ViewCus>
      </ViewCus>
      <TouchCus onPress={onCounpon} flex-row items-center justify-space-between>
        <ViewCus flex-row items-center>
          <IconApp name={IconName.Coupon} size={16} color={Colors.main} />
          <TextCus
            useI18n
            main
            paramI18n={{ number: props.promotionNumber }}
            ml-8>
            category.coupon
          </TextCus>
        </ViewCus>
        <IconApp name={IconName.ChevronRight} size={12} style={[styles.icon]} />
      </TouchCus>
    </ViewCus>
  );
};
const styles = StyleSheet.create({
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
export default FoodInfo;
