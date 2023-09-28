import { RouteProp, useRoute } from '@react-navigation/native';
import { IconName } from 'assets';
import {
  Buttons,
  CheckBox,
  IconApp,
  TextCus,
  TouchCus,
  ViewCus,
} from 'components';
import { useVehicleRental } from 'hooks';
import { NavigationService, RootStackParamList } from 'navigation';
import React, { Fragment, useCallback, useEffect, useState } from 'react';
import {
  InteractionManager,
  Platform,
  StatusBar,
  StyleSheet,
  Image,
} from 'react-native';
import Animated, {
  interpolate,
  interpolateColor,
  runOnJS,
  useAnimatedRef,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  useScrollViewOffset,
  useSharedValue,
} from 'react-native-reanimated';
import { Colors, FontWeight } from 'theme';
import { EStatusBar } from 'types';
import { formatMoney, width } from 'utils';
import { HeaderImageVehicle } from '../components';
import { Skeleton } from 'moti/skeleton';
import { useCart } from 'context/CartContext';
import { useTranslation } from 'react-i18next';
import { View } from 'moti';
import { Images } from 'assets';
const ExtraVehicle: React.FC = () => {
  const route = useRoute<RouteProp<RootStackParamList, 'ExtraFood'>>();
  const { getExtraVehicle, listExtraVehicle, loading } = useVehicleRental();
  const {
    addItemToOrder: onAddToCart,
    updateOrderItems: onUpdateFromCart,
    orderItems: carts,
  } = useCart();
  const isUpdate = route.params?.index !== undefined;
  const cartUpdate = carts.find(cart => cart.index === route.params?.index);
  const { t } = useTranslation();
  useEffect(() => {
    getExtraVehicle(route.params?.foodId);
  }, [route.params?.foodId]);

  const scrollOffset = useSharedValue(0);
  const [height, setHeight] = useState(0);
  const [countValue, setCountValue] = useState(
    isUpdate ? cartUpdate?.quantity ?? 0 : 1,
  );
  const [currentItem, setCurrentItem] = useState<number>(0);
  const aref = useAnimatedRef<Animated.ScrollView>();
  const scrollHandle = useScrollViewOffset(aref);
  // const [desc, setDesc] = useState('');
  const [extraVehicle, setExtraVehicle] = useState<any[]>(
    cartUpdate?.extraOptions ?? [],
  );

  const headerOpacity = useAnimatedStyle(() => {
    const opacity = interpolate(scrollHandle.value, [0, 105], [0, 1], 'clamp');
    return {
      opacity,
    };
  });
  const titleOpacity = useAnimatedStyle(() => {
    const opacity = interpolate(
      scrollHandle.value,
      [0, 220, 250],
      [0, 0, 1],
      'clamp',
    );
    return {
      opacity,
    };
  });
  const sliderOpacity = useAnimatedStyle(() => {
    const opacity = interpolate(scrollHandle.value, [0, 105], [1, 0], 'clamp');
    return {
      opacity,
    };
  });
  const backgroundColor = useAnimatedStyle(() => {
    const color = interpolateColor(
      scrollHandle.value,
      [0, 105],
      [Colors.greyEF, Colors.transparent],
    );
    return {
      backgroundColor: color,
    };
  });
  const onHandleMinus = useCallback(() => {
    if (!isUpdate && countValue === 1) {
      return;
    }

    if (isUpdate && countValue === 0) {
      return;
    }

    setCountValue(prev => prev - 1);
  }, [countValue]);
  const onHandlePlus = useCallback(() => {
    setCountValue(prev => prev + 1);
  }, [countValue]);
  const renderItem = useCallback(
    item => {
      return (
        <Fragment key={item?.id}>
          <TextCus heading5>{item?.group_name}</TextCus>
          {item?.extraOptions?.map(extra => (
            <ViewCus key={extra.id} style={[styles.add]}>
              <CheckBox
                title={extra?.extra_option_name}
                value={!!extraVehicle.find(x => x.id === extra.id)}
                onChange={(checked, title) => {
                  const extraOption = item?.extraOptions.find(
                    exop => exop.extra_option_name === title,
                  );
                  if (checked) {
                    const result = { ...extraOption, checked };
                    extraVehicle.push(result);
                  } else {
                    setExtraVehicle(prev => [
                      ...prev.map(p =>
                        p.extra_option_name === title
                          ? { ...p, checked }
                          : { ...p },
                      ),
                    ]);
                  }
                }}
              />
              <TextCus bold>+{formatMoney(extra?.price)}</TextCus>
            </ViewCus>
          ))}
        </Fragment>
      );
    },
    [extraVehicle, route],
  );
  const onHandleExtraVehicle = useCallback(() => {
    if (isUpdate) {
      const form = {
        orderItems: {
          ...cartUpdate,
          quantity: countValue,
          index: cartUpdate?.index,
        },
        extraOptions: extraVehicle.filter(item => item.checked),
      };
      onUpdateFromCart(form);
    } else {
      const form = {
        orderItems: {
          itemId: listExtraVehicle?.id,
          quantity: countValue,
          itemName: listExtraVehicle?.name,
          image: listExtraVehicle.avatar?.[0],
          price: listExtraVehicle.price,
          vehicle: listExtraVehicle?.vehicle,
        },
        extraOptions: extraVehicle.filter(item => item.checked),
      };
      onAddToCart(form);
    }

    InteractionManager.runAfterInteractions(() => {
      NavigationService.goBack();
    });
  }, [
    extraVehicle,
    countValue,
    listExtraVehicle?.id,
    listExtraVehicle?.food_name,
    onAddToCart,
    onUpdateFromCart,
  ]);
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
  return (
    <Skeleton.Group show={loading}>
      <ViewCus f-1 bg-white>
        <StatusBar barStyle={height > 0 ? EStatusBar.DARK : EStatusBar.LIGHT} />
        <Animated.View style={[styles.header, headerOpacity]}>
          <ViewCus style={styles.boxShadow} />
        </Animated.View>
        <Animated.View style={styles.actionHeader}>
          <TouchCus onPress={() => NavigationService.goBack()}>
            <Animated.View style={[styles.circle, backgroundColor]}>
              <IconApp
                name={IconName.ChevronLeft}
                size={16}
                color={Colors.black3A}
              />
            </Animated.View>
          </TouchCus>
          <Animated.Text style={[styles.title, titleOpacity]} numberOfLines={1}>
            {listExtraVehicle?.name}
          </Animated.Text>
          <Animated.View style={[styles.slider, sliderOpacity]}>
            {listExtraVehicle?.images?.length > 1 && (
              <>
                <TextCus heading5>{currentItem + 1}/</TextCus>
                <TextCus heading5>{listExtraVehicle?.images?.length}</TextCus>
              </>
            )}
          </Animated.View>
        </Animated.View>
        <Animated.ScrollView
          ref={aref}
          contentContainerStyle={styles.wrapperContent}
          showsVerticalScrollIndicator={false}
          scrollEventThrottle={16}
          onScroll={scrollHandler}>
          <HeaderImageVehicle
            setCurrentItem={setCurrentItem}
            currentItem={currentItem}
            images={[listExtraVehicle?.avatar]}
          />
          <ViewCus px-16 pb-16>
            <Skeleton colorMode="light" height={24} width={'50%'}>
              <TextCus heading4 mb-12>
                {listExtraVehicle?.name}
              </TextCus>
            </Skeleton>
            <ViewCus flex-row>
              <Skeleton colorMode="light">
                <TextCus heading4 main>
                  {formatMoney(listExtraVehicle?.price)}
                </TextCus>
              </Skeleton>
              <TextCus color-grey82 mx-8>
                |
              </TextCus>
              <Skeleton colorMode="light">
                <TextCus
                  color-grey82
                  paramI18n={{ number: listExtraVehicle?.order_count }}
                  useI18n>
                  category.buy
                </TextCus>
              </Skeleton>
            </ViewCus>
          </ViewCus>
          <ViewCus h-4 bg-greyF7 />
          <ViewCus p-16>
            {listExtraVehicle?.extra_options_group?.map(renderItem)}
            {/* {listExtraVehicle?.extra_options_group?.length > 0 ? (
              <>{listExtraVehicle?.extra_options_group?.map(renderItem)}</>
            ) : (
              <>
                <ViewCus flex-row mb-12>
                  <IconApp
                    name={IconName.Term}
                    size={24}
                    color={Colors.greyAD}
                  />
                  <ViewCus ml-12 flex-row>
                    <TextCus heading5 useI18n mr-4>
                      category.noted
                    </TextCus>
                    <TextCus color-grey85 useI18n>
                      category.option
                    </TextCus>
                  </ViewCus>
                </ViewCus>
                {renderNoteFood()}
              </>
            )} */}
          </ViewCus>
          <ViewCus>
            <TextCus l-30>Thông tin xe</TextCus>
          </ViewCus>
          <ViewCus style={[styles.wrapperExtra]}>
            <ViewCus flex-row>
              <Image source={Images.carVehicle} />
              <TextCus ml-10>Loại xe</TextCus>
            </ViewCus>
            <TextCus bold>{listExtraVehicle?.vehicle}</TextCus>
          </ViewCus>
          <ViewCus style={[styles.wrapperExtra]}>
            <ViewCus flex-row>
              <Image source={Images.branchCar} />
              <TextCus ml-10>Hãng xe</TextCus>
            </ViewCus>
            <TextCus bold>{listExtraVehicle?.car_company}</TextCus>
          </ViewCus>
          <ViewCus style={[styles.wrapperExtra]}>
            <ViewCus flex-row>
              <Image source={Images.carVehicle} />
              <TextCus ml-10>Dòng xe</TextCus>
            </ViewCus>
            <TextCus bold>{listExtraVehicle?.range_vehicle}</TextCus>
          </ViewCus>
          <ViewCus style={[styles.wrapperExtra]}>
            <ViewCus flex-row>
              <Image source={Images.caculator} />
              <TextCus ml-10>Năm sản xuất</TextCus>
            </ViewCus>
            <TextCus bold>{listExtraVehicle?.year}</TextCus>
          </ViewCus>
          <ViewCus style={[styles.wrapperExtra]}>
            <ViewCus flex-row>
              <Image source={Images.howLongKm} />
              <TextCus ml-10>Số Km đã đi</TextCus>
            </ViewCus>
            <TextCus bold>{listExtraVehicle?.km_traveled}</TextCus>
          </ViewCus>
          <ViewCus style={[styles.wrapperExtra]}>
            <ViewCus flex-row>
              <Image source={Images.gear} />
              <TextCus ml-10>Hộp số</TextCus>
            </ViewCus>
            <TextCus bold>{listExtraVehicle?.gear}</TextCus>
          </ViewCus>
          <ViewCus style={[styles.wrapperExtra]}>
            <ViewCus flex-row>
              <Image source={Images.fuel} />
              <TextCus ml-10>Nhiên liệu</TextCus>
            </ViewCus>
            <TextCus bold>{listExtraVehicle?.fuel}</TextCus>
          </ViewCus>
          <ViewCus style={[styles.wrapperExtra]}>
            <ViewCus flex-row>
              <Image source={Images.origin} />
              <TextCus ml-10>Xuất xứ</TextCus>
            </ViewCus>
            <TextCus bold>{listExtraVehicle?.origin}</TextCus>
          </ViewCus>
          <ViewCus style={[styles.wrapperExtra]}>
            <ViewCus flex-row>
              <Image source={Images.security} />
              <TextCus ml-10>Chính sách bảo hành</TextCus>
            </ViewCus>
            <TextCus bold>{listExtraVehicle?.warranty_policy}</TextCus>
          </ViewCus>
          <ViewCus style={[styles.wrapperExtra]}>
            <ViewCus flex-row>
              <Image source={Images.weight} />
              <TextCus ml-10>Trọng lượng</TextCus>
            </ViewCus>
            <TextCus bold>{listExtraVehicle?.weigth}</TextCus>
          </ViewCus>
        </Animated.ScrollView>
        <ViewCus
          flex-row
          justify-space-between
          items-center
          px-16
          bg-white
          btw-1
          pt-12
          pb-30
          btc-greyED>
          <ViewCus flex-row items-center mr-24>
            <TouchCus onPress={onHandleMinus}>
              <IconApp
                name={IconName.Minus}
                size={26}
                color={
                  !isUpdate && countValue === 1 ? Colors.disable : Colors.main
                }
              />
            </TouchCus>
            <TextCus heading2 px-16>
              {countValue}
            </TextCus>
            <TouchCus onPress={onHandlePlus}>
              <IconApp name={IconName.Plus} size={26} color={Colors.main} />
            </TouchCus>
          </ViewCus>
          <Buttons
            textBtn={
              (isUpdate ? t('title.update_menu') : t('title.add_Require')) ?? ''
            }
            style={styles.btnAddFood}
            onPress={onHandleExtraVehicle}
          />
        </ViewCus>
      </ViewCus>
    </Skeleton.Group>
  );
};
const styles = StyleSheet.create({
  wrapperContent: {
    flexGrow: 1,
    backgroundColor: Colors.white,
    position: 'relative',
  },
  image: {
    width,
    height: 310,
  },
  actionHeader: {
    position: 'absolute',
    zIndex: 2,
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
  },
  slider: {
    backgroundColor: Colors.greyEF,
    flexDirection: 'row',
    paddingHorizontal: 12,
    borderRadius: 4,
  },
  circle: {
    borderRadius: 16,
    backgroundColor: Colors.greyEF,
    height: 32,
    width: 32,
    alignItems: 'center',
    justifyContent: 'center',
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
  title: {
    fontSize: 16,
    flexShrink: 1,
    paddingHorizontal: 5,
    fontWeight: FontWeight.bold,
  },
  btnAddFood: {
    flex: 1,
    borderRadius: 8,
  },
  wrapperExtra: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomColor: Colors.disableEF,
    borderBottomWidth: 1,
    paddingBottom: 15,
    marginTop: 15,
    paddingHorizontal: 30,
  },
  clearBottomWidth: {
    borderBottomWidth: 0,
  },
  add: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomColor: Colors.disableEF,
    borderBottomWidth: 1,
    paddingBottom: 15,
    marginTop: 15,
    paddingHorizontal: 10,
  },
});
export default ExtraVehicle;
