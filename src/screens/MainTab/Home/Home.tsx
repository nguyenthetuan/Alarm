import { Images, IconName } from 'assets';
import {
  HomeLayout,
  ImageCus,
  ScrollViewCus,
  TextCus,
  TouchCus,
  ViewCus,
  IconApp,
} from 'components';
import { useAuth, useHome } from 'hooks';
import React, { useEffect, useMemo, useCallback, useState } from 'react';
import { Image } from 'react-native';
import { Colors } from 'theme';
import { DATA_CATEGORY, IPage } from 'types';
import { getImage, isIos } from 'utils';
import {
  AttractiveOffers,
  InputSearch,
  ListCategories,
  SuggestionForYou,
} from './Components';
import styles from './styles';
const Home: React.FC = () => {
  const {
    getListCategories,
    listCategories,
    getListPromotions,
    getRestaurantNearMe,
    listRestaurantNearMe,
  } = useHome();
  const { userInfo } = useAuth();
  const [isShowSearch, setIsShowSearch] = useState(false);
  const [textSearch, setTextSearch] = useState('');
  const onHandleSearch = useCallback(() => {
    setIsShowSearch(true);
  }, []);
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
    getRestaurantNearMe(
      {
        page: 1,
        limit: 1,
        search: '',
      } as IPage,
      res => {
        console.log('res', res);
      },
    );
  }, [getListPromotions, getRestaurantNearMe]);

  const { categories } = useMemo(() => {
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
  const onClearInput = useCallback(() => {
    setIsShowSearch(false);
    setTextSearch('');
  }, []);
  const renderRight = useCallback(() => {
    if (!isShowSearch) {
      return null;
    }
    return (
      <TouchCus onPress={onClearInput} style={styles.btnClear}>
        <IconApp name={IconName.Remove} size={20} color={Colors.disable} />
      </TouchCus>
    );
  }, [isShowSearch]);

  const length = userInfo?.full_name.split(' ').length;
  const fullName =
    `${
      (!!userInfo?.full_name.split(' ')[length - 2] &&
        userInfo?.full_name.split(' ')[length - 2]) ||
      ' '
    }` +
    ' ' +
    userInfo?.full_name.split(' ')[length - 1];
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
                  {fullName}
                </TextCus>
              </ViewCus>
              <ViewCus f-1 flex-row>
                <Image source={Images.location} />
                <TextCus l-10 color-white bold>
                  {userInfo?.address}
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
            <InputSearch
              renderRight={renderRight}
              onPress={text => {
                setTextSearch(text);
                setIsShowSearch(true);
              }}
              value={textSearch}
              isShowSearch={isShowSearch}
            />
          </ViewCus>
        </ViewCus>
        <ViewCus f-1 t-20>
          <ScrollViewCus>
            {categories.length > 0 && (
              <ListCategories categories={categories} />
            )}
            <AttractiveOffers
              promotions={listRestaurantNearMe?.result}
              title="closeToYou"
            />
            <AttractiveOffers
              promotions={listRestaurantNearMe?.result}
              title="height"
            />
            <SuggestionForYou />
          </ScrollViewCus>
        </ViewCus>
      </ViewCus>
    </HomeLayout>
  );
};
export default Home;
