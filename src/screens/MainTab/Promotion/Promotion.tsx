import { RNFlatList, HomeLayout } from 'components';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { BaseStyle, Colors } from 'theme';
import { PromotionDetail, PromotionItem } from './components';
import { IPromotionListItem, IRefBottom } from 'types';
import { usePromotionList } from 'hooks';
import { RouteProp, useRoute } from '@react-navigation/native';
import { NavigationService, RootStackParamList } from 'navigation';
import { RefreshControl } from 'react-native';
import { useCart } from 'context/CartContext';

const Promotion = () => {
  const route = useRoute<RouteProp<RootStackParamList, 'Promotion'>>();
  const refModal = useRef<IRefBottom>(null);
  const { promotions, setPromotions } = useCart();
  const { refreshData, isRefreshing, listDataTable } = usePromotionList();
  const [selected, setSelected] = useState<IPromotionListItem>();
  const onPressItem = useCallback(item => {
    setSelected(item);
  }, []);
  const isBackable = !!route?.params?.backPath;
  const handleBack = useCallback(() => {
    console.log('isBackable', isBackable);
    NavigationService.goBack();
    if (isBackable) {
      NavigationService.navigate(route.params.backPath, route.params.params);
    }
  }, [route?.params?.backPath]);

  const renderItem = useCallback(
    ({ item }) => {
      if (item) {
        return (
          <PromotionItem
            isAppliable={isBackable}
            item={item}
            key={item.id}
            onPress={() => onPressItem(item)}
          />
        );
      }
      return <></>;
    },
    [onPressItem, isBackable],
  );

  //#region Watch change
  useEffect(() => {
    refreshData();
  }, []);
  useEffect(() => {
    if (selected) {
      refModal.current?.show();
    }
  }, [selected]);
  // useEffect(() => {
  //   if (listDataTable.length > 0 && promotions.length > 0) {
  //     const newPro: IPromotionListItem[] = [];
  //     for (let i = 0; i < promotions.length; i++) {
  //       const element = promotions[i];
  //       let found = false;
  //       for (let j = 0; j < listDataTable.length; j++) {
  //         const element2 = listDataTable[j];
  //         if (element2.id === element.id) {
  //           found = true;
  //           break;
  //         }
  //       }
  //       if (found) {
  //         newPro.push(element);
  //       }
  //     }
  //     console.log('newPro',newPro)
  //     setPromotions(newPro);
  //   }
  // }, [listDataTable]);
  //#endregion

  return (
    <HomeLayout
      bgColor={Colors.main}
      header={{
        onPressLeft: handleBack,
        notGoBack: false,
        title: 'promotions',
        iconColor: Colors.white,
      }}>
      <RNFlatList
        refreshControl={
          <RefreshControl refreshing={isRefreshing} onRefresh={refreshData} />
        }
        data={listDataTable}
        renderItem={renderItem}
        contentContainerStyle={BaseStyle.pd16}
      />
      <PromotionDetail
        promotion={selected}
        ref={refModal}
        onCloseModal={() => {
          refModal.current?.close();
          setSelected(undefined);
        }}
      />
    </HomeLayout>
  );
};

export default Promotion;
