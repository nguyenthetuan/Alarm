import {
  HomeLayout,
  StarsRating,
  TextCus,
  TextInputs,
  TouchCus,
  ViewCus,
} from 'components';
import { NavigationService, Routes } from 'navigation';
import React, { useCallback, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { StyleSheet } from 'react-native';
import { Colors } from 'theme';
import { RouteProp, useRoute } from '@react-navigation/native';
import { useNotify, useOrders, useRequestDelivery } from 'hooks';

type TFormRating = {
  description: string;
};
const RatingBiker: React.FC = () => {
  const route = useRoute<RouteProp<RootStackParamList, 'RatingBiker'>>();
  const { ratingDriver, postRatingDiliveryFood } = useOrders();
  const { postRatingDriver } = useRequestDelivery();
  const { success, danger } = useNotify();
  const { control, handleSubmit, setValue } = useForm<TFormRating>({
    defaultValues: {
      description: '',
    },
  });

  const suggestData = [
    { title: 'Tài xế thân thiện', id: 0 },
    { title: 'Sạch sẽ và thoải mái', id: 1 },
    { title: 'Lái xe an toàn', id: 2 },
    { title: 'Vui tính', id: 3 },
  ];
  const [point, setPoint] = useState(route.params?.point || 5);
  const onChooseItem = useCallback(item => {
    setValue('description', item.title);
  }, []);
  const renderSuggestItem = useCallback(
    (item, index) => {
      return (
        <TouchCus
          style={styles.circle}
          key={index}
          onPress={() => onChooseItem(item)}>
          <TextCus>{item.title}</TextCus>
        </TouchCus>
      );
    },
    [onChooseItem],
  );
  const onRating = useCallback((value: TFormRating) => {
    const deliveryInfo = route.params?.deliveryInfo;
    const body = {
      id: deliveryInfo?.motorcycleTaxi?.id
        ? deliveryInfo?.motorcycleTaxi?.id
        : route.params?.type === 'Food'
        ? deliveryInfo?.order_code
        : deliveryInfo?.id,
      rating: point,
      review: value.description,
    };
    console.log('route.params?.deliveryInfo', deliveryInfo?.motorcycleTaxi?.id);
    console.log('bodyzzz', body);

    if (route.params?.type === 'Food') {
      postRatingDiliveryFood(body, res => {
        if (res.status === 200) {
          success('Đánh giá tài xế thành công');
          NavigationService.navigate(Routes.HomeTabs);
        } else {
          danger('Đánh giá tài xế thất bại');
        }
      });
    } else {
      if (deliveryInfo?.id) {
        postRatingDriver(body, res => {
          if (res.status === 200) {
            success('Đánh giá tài xế thành công');
            NavigationService.navigate(Routes.HomeTabs);
          } else {
            danger('Đánh giá tài xế thất bại');
          }
        });
      } else {
        ratingDriver(body, res => {
          if (res.status === 200) {
            success('Đánh giá tài xế thành công');
            NavigationService.navigate(Routes.HomeTabs);
          } else {
            danger('Đánh giá tài xế thất bại');
          }
        });
      }
    }
  }, []);
  return (
    <HomeLayout
      bgColor={Colors.main}
      header={{
        title: 'activity.rating_biker',
        iconColor: Colors.white,
      }}
      isForForm
      textBtn="action.send_rating"
      onPress={handleSubmit(onRating)}
      styleContent={styles.p16}>
      <ViewCus>
        <ViewCus items-center>
          <StarsRating
            point={point}
            onChangePoint={p => setPoint(p + 1)}
            size={40}
            style={styles.mr16}
          />
        </ViewCus>
        <ViewCus my-16 style={styles.contentSuggest}>
          {suggestData.map(renderSuggestItem)}
        </ViewCus>
        <Controller
          name="description"
          control={control}
          render={({ field: { onChange, onBlur, value } }) => (
            <TextInputs
              onChangeText={onChange}
              onBlur={onBlur}
              value={value}
              placeholder="Nhập cảm nhận của bạn"
              style={styles.input}
              multiline={true}
              verticalAlign="top"
              styleInput={{ height: '100%' }}
            />
          )}
        />
      </ViewCus>
    </HomeLayout>
  );
};
const styles = StyleSheet.create({
  p16: {
    padding: 16,
  },
  mr16: {
    marginRight: 16,
  },
  input: {
    height: 125,
    paddingVertical: 12,
  },
  circle: {
    borderRadius: 20,
    borderWidth: 1,
    borderColor: Colors.greyAD,
    paddingHorizontal: 12,
    paddingVertical: 2,
    marginBottom: 10,
    marginRight: 10,
  },
  contentSuggest: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
export default RatingBiker;
