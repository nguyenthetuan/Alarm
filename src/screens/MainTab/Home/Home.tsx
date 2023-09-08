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
  }, [getListPromotions]);

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
