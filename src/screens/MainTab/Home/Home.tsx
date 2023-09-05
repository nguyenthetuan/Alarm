import Geolocation from '@react-native-community/geolocation';
import { Images } from 'assets';
import {
  HomeLayout,
  ImageCus,
  ScrollViewCus,
  TextCus,
  ViewCus,
} from 'components';
import { useAuth, useHome } from 'hooks';
import React, { useEffect, useMemo } from 'react';
import { Image } from 'react-native';
import { Colors } from 'theme';
import { DATA_CATEGORY } from 'types';
import { getImage, isIos } from 'utils';
import {
  AttractiveOffers,
  InputSearch,
  ListCategories,
  SuggestionForYou,
} from './Components';
import styles from './styles';
const Home: React.FC = () => {
  const { getListCategories, listCategories, getListPromotions } = useHome();
  const { userInfo } = useAuth();
  useEffect(() => {
    getListCategories();
    // BottomSheetController.showModal({
    //   type: 'errors',
    //   title: 'Đăng nhập hết hạn',
    //   subtitle:
    //     'Tài khoản của bạn đã được đăng nhập ở một thiết bị khác. Vui lòng đăng nhập lại',
    //   onOk: () => {
    //     BottomSheetController.hideModal();
    //     // store.dispatch(logoutRequest({ redirect: true }));
    //   },
    //   textOk: 'Đăng nhập',
    // });
  }, [getListCategories]);
  useEffect(() => {
    getListPromotions();
    getAddressFromLocation();
  }, [getListPromotions, getAddressFromLocation]);

  const { categories } = useMemo(() => {
    // return {
    //   categories: [
    //     {
    //       name: 'Giao đồ ăn',
    //       defaultIcon: 'food1',
    //     },
    //     {
    //       name: 'Thức uống',
    //       defaultIcon: 'drink1',
    //     },
    //     {
    //       name: 'Ôtô 4 chỗ',
    //       defaultIcon: 'car4Seat',
    //       onPress: () =>
    //         NavigationService.navigate(Routes.FindCar, {
    //           type: 'car',
    //         }),
    //     },
    //     {
    //       name: 'Xe máy',
    //       defaultIcon: 'bike',
    //       onPress: () =>
    //         NavigationService.navigate(Routes.FindCar, {
    //           type: 'bike',
    //         }),
    //     },
    //     {
    //       name: 'Đi chợ',
    //       defaultIcon: 'goMarket',
    //       onPress: () =>
    //         NavigationService.navigate(Routes.FindCar, {
    //           type: 'both',
    //         }),
    //     },
    //     {
    //       name: 'Xe du lịch',
    //       defaultIcon: 'travelCar',
    //       onPress: () =>
    //         NavigationService.navigate(Routes.FindCar, {
    //           type: 'car',
    //         }),
    //     },
    //     {
    //       name: 'Giao hàng',
    //       defaultIcon: 'deliveryStuff',
    //       onPress: () => NavigationService.navigate(Routes.Biker),
    //     },
    //     {
    //       name: 'Giúp việc',
    //       defaultIcon: 'houseHelper',
    //     },
    //   ],
    // };
    return {
      categories: [
        ...listCategories.map(item => {
          return {
            ...item,
            defaultIcon: DATA_CATEGORY[item.type]?.icon,
            onPress: DATA_CATEGORY[item.type]?.onPress,
          };
        }),
        {
          defaultIcon: DATA_CATEGORY.ALL?.icon,
          onPress: DATA_CATEGORY.ALL?.onPress,
          name: 'Tất cả',
        },
      ],
    };
  }, [listCategories]);

  const getAddressFromLocation = () => {
    // Sử dụng Geolocation.getCurrentPosition để lấy thông tin vị trí
    Geolocation.getCurrentPosition(
      async position => {
        const { latitude, longitude } = position.coords;

        // Sử dụng Google Maps Geocoding API để lấy địa chỉ từ vị trí
        const apiKey = 'GGAPI_KEY';
        const apiUrl = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${apiKey}`;

        try {
          const response = await fetch(apiUrl);
          const data = await response.json();

          if (data.status === 'OK') {
            // Lấy địa chỉ từ dữ liệu phản hồi
            const address = data.results[0].formatted_address;
            console.log(`Địa chỉ vị trí hiện tại: ${address}`);
          } else {
            console.error('Không thể lấy được địa chỉ từ vị trí.');
          }
        } catch (error) {
          console.error(`Lỗi khi lấy địa chỉ: ${error}`);
        }
      },
      error => {
        console.error(`Lỗi khi lấy vị trí: ${error.message}`);
      },
      { enableHighAccuracy: true, timeout: 20000, maximumAge: 1000 },
    );
  };

  console.log('categories', categories);

  return (
    <HomeLayout
      bgColor={isIos ? Colors.main : Colors.white}
      header={{
        notGoBack: true,
      }}>
      <ViewCus f-1 bg-white>
        <ViewCus bg-main>
          <ViewCus flex-row justify-space-between px-16 py-12 items-center>
            <ViewCus>
              <ViewCus f-1 flex-row>
                <TextCus useI18n subhead color-white bold>
                  hi
                </TextCus>
                <TextCus subhead l-10 color-white bold>
                  {userInfo?.full_name}
                </TextCus>
              </ViewCus>
              <ViewCus f-1 flex-row>
                <Image source={Images.location} />
                <TextCus l-10 color-white bold>
                  {userInfo?.full_name}
                </TextCus>
              </ViewCus>
            </ViewCus>
            <ViewCus f-1 items-flex-end>
              <ImageCus
                style={styles.image}
                source={{ uri: getImage({ image: userInfo?.avatar }) }}
              />
            </ViewCus>
          </ViewCus>
          <ViewCus t-35>
            <InputSearch />
          </ViewCus>
        </ViewCus>
        <ViewCus f-1 t-20>
          <ScrollViewCus>
            {categories.length > 0 && (
              <ListCategories categories={categories} />
            )}
            <AttractiveOffers
              promotions={Array(3).fill(1)}
              title="closeToYou"
            />
            <AttractiveOffers promotions={Array(3).fill(1)} title="height" />
            <SuggestionForYou />
          </ScrollViewCus>
        </ViewCus>
      </ViewCus>
    </HomeLayout>
  );
};
export default Home;
