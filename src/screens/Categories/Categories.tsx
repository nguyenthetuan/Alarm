import { RouteProp, useRoute } from '@react-navigation/native';
import { IconName } from 'assets';
import {
  HomeLayout,
  IconApp,
  Nodata,
  RNFlatList,
  TextCus,
  TextInputs,
  TouchCus,
  ViewCus,
} from 'components';
import { useCart } from 'context/CartContext';
import { useCategories } from 'hooks';
import { useListRestaurant } from 'hooks/useListRestaurant';
import { NavigationService, RootStackParamList, Routes } from 'navigation';
import React, { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Alert, RefreshControl, StyleSheet } from 'react-native';
import { SkeletonLoadingItem } from 'screens/MainTab/Home/Components';
import { Colors } from 'theme';
import { ENodata, IRestaurantDetail } from 'types';
import { CategoryItem } from './components';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Categories: React.FC = () => {
  const { setSelectedPromos } = useCategories();
  const { t } = useTranslation();
  const {
    removeAll: onRemoveAll,
    orderItems: carts,
    selectedRestaurant,
    setSelectedRestaurant,
    setDistance,
    setPromotions,
  } = useCart();
  const route = useRoute<RouteProp<RootStackParamList, 'Categoires'>>();
  const [searchText, setSearchText] = useState(route.params?.searchText ?? '');
  const { listData, refreshData, isLoading, fetchData } = useListRestaurant();
  const [isShowSearch, setIsShowSearch] = useState(
    route.params?.searchText.length ? true : false,
  );

  useEffect(() => {
    refreshData(searchText);
  }, []);

  const onHandleSearch = useCallback(() => {
    setIsShowSearch(true);
  }, []);

  const onClearInput = useCallback(() => {
    if (searchText === '') {
      setIsShowSearch(false);
      refreshData(searchText);
    }
    setSearchText('');
  }, [searchText]);

  const onBlurInput = useCallback(() => {
    refreshData(searchText);
  }, [refreshData, searchText]);

  const renderSearchInput = useCallback(() => {
    if (!isShowSearch && searchText?.length === 0) {
      return (
        <TextCus useI18n heading5 style={{ color: Colors.white }}>
          {'Đồ ăn'}
        </TextCus>
      );
    }
    return (
      <ViewCus style={[styles.wrapperSearch]}>
        <TextInputs
          styleWrapperInput={[styles.wrapperInput]}
          placeholder="category.place_search"
          onChangeText={setSearchText}
          style={[styles.input]}
          styleInput={[styles.styleInput]}
          onBlur={onBlurInput}
          value={searchText}
        />
        <TouchCus onPress={onClearInput} style={styles.btnClear}>
          <IconApp name={IconName.Remove} size={20} color={Colors.disable} />
        </TouchCus>
      </ViewCus>
    );
  }, [onClearInput, onBlurInput, isShowSearch, searchText, setSearchText]);

  const goToRestaurant = useCallback((item: IRestaurantDetail) => {
    setSelectedRestaurant(item.id);
    AsyncStorage.setItem('restaurantSelected', item.id);
    setDistance(item.distance ?? 0);
    NavigationService.navigate(Routes.RestaurantDetail, {
      restaurantId: item.id,
      distance: item?.distance,
    });
  }, []);
  const handleChooseRestaurant = useCallback(
    (item: IRestaurantDetail) => async () => {
      const idRestaurantSelected = await AsyncStorage.getItem(
        'restaurantSelected',
      );
      if (carts.length && item.id !== idRestaurantSelected) {
        Alert.alert(t('category.alert'), t('category.reset_wishlist'), [
          {
            text: t('cancel'),
            style: 'cancel',
          },
          {
            text: t('ok'),
            onPress: () => {
              onRemoveAll();
              setPromotions([]);
              setSelectedPromos([]);
              goToRestaurant(item);
            },
          },
        ]);
        return;
      }
      goToRestaurant(item);
    },
    [carts.length],
  );
  const renderItem = useCallback(
    info => {
      return (
        <CategoryItem
          key={info.index}
          {...info.item}
          onPress={isLoading ? undefined : handleChooseRestaurant(info.item)}
          loading={isLoading}
        />
      );
    },
    [carts],
  );
  const renderRight = useCallback(() => {
    if (isShowSearch) {
      return null;
    }
    return (
      <TouchCus onPress={onHandleSearch}>
        <IconApp name={IconName.Search} size={20} color={Colors.white} />
      </TouchCus>
    );
  }, [onHandleSearch, isShowSearch]);
  return (
    <HomeLayout
      bgColor={Colors.main}
      header={{
        notGoBack: false,
        iconColor: Colors.white,
        renderRight: renderRight,
        renderCenter: () => renderSearchInput(),
        onPressLeft: () => {
          NavigationService.goBack();
        },
        style: {
          height: 45,
        },
      }}>
      <ViewCus f-1 bg-white>
        <RNFlatList
          data={listData}
          ListEmptyComponent={
            isLoading ? (
              <SkeletonLoadingItem />
            ) : (
              <Nodata iconName={ENodata.NODATA_FOOD} />
            )
          }
          renderItem={renderItem}
          refreshControl={
            <RefreshControl
              refreshing={isLoading}
              title="Kéo thả làm mới"
              onRefresh={() => {
                refreshData(searchText);
              }}
            />
          }
          onEndReached={() => {
            fetchData(searchText);
          }}
          onEndReachedThreshold={0.7}
        />
      </ViewCus>
    </HomeLayout>
  );
};

const styles = StyleSheet.create({
  wrapperInput: {
    flexGrow: 1,
    margin: 0,
    marginBottom: 0,
    padding: 0,
    borderRadius: 0,
    borderWidth: 0,
  },
  styleInput: {
    flexGrow: 1,
  },
  wrapperSearch: {
    alignItems: 'center',
    paddingRight: 12,
    marginHorizontal: 16,
    backgroundColor: Colors.white,
    flexDirection: 'row',
    borderRadius: 30,
    justifyContent: 'space-between',
    height: 30,
  },
  input: {
    backgroundColor: 'transparent',
    borderRadius: 0,
    borderWidth: 0,
  },
  btnClear: {},
});
export default Categories;
