import { RouteProp, useRoute } from '@react-navigation/native';
import { IconName, Images } from 'assets';
import {
  Buttons,
  IconApp,
  RNFlatList,
  TextCus,
  TouchCus,
  ViewCus,
  StarsRating,
  ImageCus,
} from 'components';
import { useCart } from 'context/CartContext';
import { useHome, useVehicleRental } from 'hooks';
import { useListGarage } from 'hooks/useListGarage';
import { useListVehicle } from 'hooks/useListVehicle';
import { NavigationService, RootStackParamList, Routes } from 'navigation';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  Platform,
  StatusBar,
  StyleSheet,
  useWindowDimensions,
  FlatList,
  Image,
} from 'react-native';
import Animated, {
  interpolate,
  runOnJS,
  useAnimatedRef,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  useScrollViewOffset,
  useSharedValue,
} from 'react-native-reanimated';
import { Colors, FontWeight } from 'theme';
import { EStatusBar, IFood, IFoodCatalog } from 'types';
import { dataDefaults, getImage, width } from 'utils';
import { TabView } from 'react-native-tab-view';
import {
  VehicleCategoryItem,
  VehicleForYou,
  VehicleInfo,
  VehiclePromotion,
} from '../components';
import moment from 'moment';

const AnimatedTouch = Animated.createAnimatedComponent(TouchCus);
const HEIGHT_IMAGE = 220;
const DetailVehicle: React.FC = () => {
  const route = useRoute<RouteProp<RootStackParamList, 'RestaurantDetail'>>();
  const [height, setHeight] = useState(0);
  const [index, setIndex] = React.useState(0);
  const layout = useWindowDimensions();
  const { orderItems: carts } = useCart();
  const {
    getDetailGarage,
    getListVehicleCatalog,
    detailGarage,
    listVehicleCatalog,
    getListDiscountVehicle,
    listDiscoutVehicle,
  } = useVehicleRental();
  const { listPromotions, getListPromotions } = useHome();
  const { listVehicleData, fetchVehicleData, refreshVehicleData, isLoading } =
    useListVehicle();
  const [routes] = React.useState([
    { key: 'all', title: 'Thuê xe' },
    { key: 'moneyIn', title: 'Review' },
    { key: 'moneyOut', title: 'Thông tin' },
  ]);
  useEffect(() => {
    getListDiscountVehicle(
      {
        page: 1,
        limit: 10,
        garageId: route.params?.garageId,
      },
      () => {},
    );
    getDetailGarage(route.params?.garageId, () => {});
    getListVehicleCatalog(route.params?.garageId);
  }, [route.params.garageId, getListVehicleCatalog, getDetailGarage]);

  useEffect(() => {
    if (listVehicleCatalog?.length === 0) {
      return;
    }

    refreshVehicleData(route.params.garageId);
  }, [route.params.garageId, listVehicleCatalog]);

  useEffect(() => {
    if (route.params?.garageId && getListPromotions) {
      getListPromotions(route.params.garageId);
    }
  }, [route.params?.garageId, getListPromotions]);

  const listVehicleCatalogs = useMemo(() => {
    return [
      {
        vehicle_catalog_name: 'Tất cả',
        id: '',
        desc: '',
        restaurant_id: '',
      },
      ...(Array.isArray(listVehicleCatalog) ? listVehicleCatalog : []),
    ];
  }, [listVehicleCatalog]);

  const aref = useAnimatedRef<Animated.ScrollView>();
  const scrollHandle = useScrollViewOffset(aref);
  const headerOpacity = useAnimatedStyle(() => {
    const opacity = interpolate(
      scrollHandle.value,
      [0, HEIGHT_IMAGE / 4, HEIGHT_IMAGE / 2],
      [0, 0.8, 1],
      'clamp',
    );
    return {
      opacity,
    };
  });
  const hideOpacity = useAnimatedStyle(() => {
    const opacity = interpolate(
      scrollHandle.value,
      [0, HEIGHT_IMAGE / 4, HEIGHT_IMAGE / 2],
      [1, 0.5, 0],
      'clamp',
    );
    return {
      opacity,
    };
  });
  const onGoBack = useCallback(() => {
    NavigationService.goBack();
  }, []);
  const scrollOffset = useSharedValue(0);
  const onGetHeight = useCallback((h: number) => {
    setHeight(h);
  }, []);
  const scrollHandler = useAnimatedScrollHandler({
    onScroll: event => {
      scrollOffset.value = event.contentOffset.y;
      if (event.contentOffset.y > 0) {
        runOnJS(onGetHeight)(1);
      } else {
        runOnJS(onGetHeight)(0);
      }
    },
  });
  const onChooseCatalogFood = useCallback(
    item => {
      refreshVehicleData(route.params.garageId, item);
    },
    [route.params?.garageId],
  );
  const renderTabBar = props => {
    return (
      <ViewCus style={styles.tabBar}>
        {props.navigationState.routes.map((route, i) => {
          const selectedItem = index === i;
          return (
            <TouchCus
              key={route.key}
              style={[styles.tabItem, selectedItem && styles.selectedTabItem]}
              onPress={() => setIndex(i)}>
              <TextCus>
                <TextCus
                  useI18n
                  style={[styles.label, selectedItem && styles.selectedLabel]}>
                  {route.title}
                </TextCus>
              </TextCus>
            </TouchCus>
          );
        })}
      </ViewCus>
    );
  };
  const renderItemReview = ({ item }) => {
    return (
      <ViewCus mt-10 pl-20 pr-20>
        <ViewCus justify-space-between flex-row>
          <ViewCus flex-row>
            <ImageCus
              source={{
                uri: getImage({
                  image: detailGarage?.avatar,
                }),
              }}
              style={styles.avatar}
            />
            <ViewCus>
              <TextCus>{item.customer[0].full_name}</TextCus>
              <StarsRating point={item.rating} />
            </ViewCus>
          </ViewCus>
          <TextCus>{moment(item.createdAt).format('DD/MM/YYYY')}</TextCus>
        </ViewCus>
        <TextCus>{item.desc}</TextCus>
      </ViewCus>
    );
  };

  const renderScene = ({ route }) => {
    switch (route.key) {
      case 'all': {
        return (
          <ViewCus f-1>
            <ViewCus style={styles.content}>
              <VehiclePromotion foods={listDiscoutVehicle?.slice(0, 5)} />
              <TextCus heading5 px-16 useI18n>
                category.for_you
              </TextCus>
              <VehicleForYou
                data={listVehicleCatalogs as IFoodCatalog[]}
                onChooseCatalogFood={onChooseCatalogFood}
              />
              <RNFlatList
                data={isLoading ? dataDefaults : listVehicleData}
                renderItem={({
                  item,
                  index,
                }: {
                  item: IFood;
                  index: number;
                }) => (
                  <VehicleCategoryItem
                    onPress={() =>
                      NavigationService.navigate(Routes.ExtraVehicle, {
                        foodId: item?.id,
                      })
                    }
                    isDetail
                    key={index}
                    {...item}
                    name={item?.name ?? ''}
                    avatar={item.avatar}
                    basePrice={item?.base_price}
                    loading={isLoading}
                  />
                )}
                onEndReached={() => {
                  if (!isLoading) {
                    fetchVehicleData(route.params?.garageId);
                  }
                }}
                onEndReachedThreshold={0.7}
              />
            </ViewCus>
          </ViewCus>
        );
      }
      case 'moneyIn': {
        return (
          <FlatList
            data={detailGarage?.reviews}
            renderItem={renderItemReview}
          />
        );
      }
      case 'moneyOut': {
        return (
          <ViewCus f-1>
            <ViewCus pl-20 pr-20 f-1>
              <TextCus useI18n bold heading5>
                infor
              </TextCus>
              <ViewCus flex-row mt-10>
                <ImageCus source={Images.iconCarGara} size={20} />
                <TextCus ml-10>{detailGarage?.name}</TextCus>
              </ViewCus>
              <ViewCus flex-row mt-10>
                <Image source={Images.place} tintColor={Colors.main} />
                <TextCus ml-10>{detailGarage?.address}</TextCus>
              </ViewCus>
              <ViewCus flex-row mt-10>
                <ImageCus
                  source={Images.IconEarth}
                  tintColor={Colors.main}
                  size={20}
                />
                <TextCus ml-10>
                  {detailGarage?.contact?.email || detailGarage?.contact?.phone}
                </TextCus>
              </ViewCus>
              <TextCus useI18n bold heading5 mt-10>
                openDood
              </TextCus>
              <FlatList
                data={detailGarage?.time}
                renderItem={({ item }) => {
                  return (
                    <ViewCus flex-row mt-10 justify-space-between f-1>
                      <TextCus ml-10>{item?.date}</TextCus>
                      <TextCus ml-10>{item?.time}</TextCus>
                    </ViewCus>
                  );
                }}
              />
            </ViewCus>
          </ViewCus>
        );
      }
      default:
        break;
    }
  };

  return (
    <ViewCus f-1 bg-white>
      <StatusBar barStyle={height > 0 ? EStatusBar.DARK : EStatusBar.LIGHT} />
      <ViewCus style={[styles.wrapperImage]}>
        <Animated.Image
          source={{
            uri: getImage({
              image: detailGarage?.avatar,
            }),
          }}
          style={styles.image}
        />
      </ViewCus>
      <Animated.View style={[styles.header, headerOpacity]}>
        <ViewCus style={styles.boxShadow}>
          <ViewCus style={[styles.actionHeader, styles.flexStart]}>
            <AnimatedTouch
              onPress={onGoBack}
              style={[
                styles.coverIcon,
                { backgroundColor: Colors.transparent },
              ]}>
              <IconApp
                name={IconName.ChevronLeft}
                size={16}
                color={Colors.black3A}
              />
            </AnimatedTouch>
            <TextCus bold heading5 ml-8>
              {detailGarage?.name}
            </TextCus>
          </ViewCus>
        </ViewCus>
      </Animated.View>
      <Animated.ScrollView
        ref={aref}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.contentContainer}
        onScroll={scrollHandler}
        scrollEventThrottle={16}>
        <Animated.View style={styles.actionHeader}>
          <AnimatedTouch
            onPress={onGoBack}
            style={[styles.coverIcon, hideOpacity]}>
            <IconApp
              name={IconName.ChevronLeft}
              size={16}
              color={Colors.white}
            />
          </AnimatedTouch>
        </Animated.View>
        <ViewCus style={styles.flexEmpty} />
        <VehicleInfo
          promotionNumber={listPromotions.length}
          detailRestaurant={{
            ...detailGarage,
            distance: route?.params?.distance,
          }}
        />
        <TabView
          navigationState={{ index, routes }}
          renderScene={renderScene}
          onIndexChange={setIndex}
          initialLayout={{ width: layout.width }}
          renderTabBar={renderTabBar}
        />
        {carts?.length > 0 && (
          <ViewCus
            flex-row
            justify-space-between
            items-center
            px-16
            bg-white
            btw-1
            pt-12
            pb-30
            btc-greyEE>
            <ViewCus flex-row items-center mr-24 style={styles.cart}>
              <IconApp
                name={IconName.CartFood}
                size={20}
                color={Colors.white}
              />
              <ViewCus style={styles.circle}>
                <TextCus bold>
                  {carts?.reduce((prev, cart) => cart.quantity + prev, 0)}
                </TextCus>
              </ViewCus>
            </ViewCus>
            <Buttons
              textBtn="Thanh toán"
              style={styles.btnAddFood}
              onPress={() =>
                NavigationService.navigate(Routes.CartOrderVehicle, {
                  title: detailGarage?.name,
                  distance: route?.params?.distance,
                })
              }
            />
          </ViewCus>
        )}
      </Animated.ScrollView>
    </ViewCus>
  );
};
const styles = StyleSheet.create({
  avatar: {
    height: 50,
    width: 50,
    borderRadius: 25,
    marginRight: 10,
  },
  selectedTabItem: {
    borderBottomColor: Colors.main,
    borderBottomWidth: 3,
    borderRadius: 0,
  },
  label: {
    fontSize: 16,
    fontWeight: FontWeight.semibold,
    color: Colors.frenchGray,
  },
  selectedLabel: {
    fontSize: 16,
    fontWeight: FontWeight.semibold,
    color: Colors.main,
  },
  coverIcon: {
    width: 30,
    height: 30,
    backgroundColor: Colors.blackShadow04,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabItem: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 10,
    borderRadius: 6,
  },
  tabBar: {
    flexDirection: 'row',
    marginVertical: 8,
    shadowColor: '#8a8989',
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    backgroundColor: Colors.white,
    elevation: 1,
  },
  actionHeader: {
    position: 'absolute',
    ...Platform.select({
      android: {
        top: 15,
      },
      ios: {
        top: 60,
      },
    }),
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width,
    paddingHorizontal: 16,
    zIndex: 10,
  },
  btnAddFood: {
    flex: 1,
    borderRadius: 8,
  },
  circle: {
    width: 27,
    height: 27,
    borderRadius: 27 / 2,
    backgroundColor: Colors.white,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 20,
  },
  cart: {
    justifyContent: 'space-between',
    backgroundColor: Colors.main,
    borderRadius: 37,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  contentContainer: {
    flexGrow: 1,
    overflow: 'visible',
    backgroundColor: Colors.transparent,
  },
  wrapperImage: {
    position: 'relative',
  },
  image: {
    height: HEIGHT_IMAGE,
    width,
    position: 'absolute',
  },
  bgCover: {
    position: 'absolute',
    width,
    height: HEIGHT_IMAGE,
    zIndex: 1,
  },
  flexEmpty: {
    height: HEIGHT_IMAGE / 1.8,
  },
  content: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  header: {
    position: 'absolute',
    zIndex: 2,
    ...Platform.select({
      android: {},
      ios: {
        top: 0,
      },
    }),
    backgroundColor: Colors.white,
  },
  boxShadow: {
    shadowColor: Colors.black,
    shadowOffset: { width: 1, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 5,
    backgroundColor: Colors.white,
    width,
    paddingHorizontal: 16,
    ...Platform.select({
      android: {
        height: 60,
      },
      ios: {
        height: 105,
      },
    }),
  },
  flexStart: {
    justifyContent: 'flex-start',
  },
});
export default DetailVehicle;
