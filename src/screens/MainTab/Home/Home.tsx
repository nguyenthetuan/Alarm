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
import { useAuth, useHome, useLocation, useGeo, useKey } from 'hooks';
import React, { useEffect, useMemo, useCallback, useState, useId } from 'react';
import { Alert, Image, StatusBar } from 'react-native';
import { Colors } from 'theme';
import { DATA_CATEGORY, IPage } from 'types';
import { getImage, isIos, KEY_CONTEXT } from 'utils';
import {
  AttractiveOffers,
  InputSearch,
  ListCategories,
  SuggestionForYou,
} from './Components';
import styles from './styles';
import { setFCMTokenUser } from 'components/Permissions';
const Home: React.FC = () => {
  const {
    getListCategories,
    listCategories,
    getListPromotions,
    getRestaurantNearMe,
    listRestaurantNearMe,
    onFCMToken,
  } = useHome();
  const { locationUser } = useLocation();
  const { onNameByLatLng } = useGeo();
  const { getKeyStore } = useKey();
  const { userInfo } = useAuth();

  const [isShowSearch, setIsShowSearch] = useState(false);
  const [textSearch, setTextSearch] = useState('');
  const [addess, setAddress] = useState('');
  useEffect(() => {
    onNameByLatLng(
      { latitude: locationUser.lat, longitude: locationUser.long },
      res => {
        setAddress(res);
      },
    );
    getListCategories();
  }, [getListCategories]);
  useEffect(() => {
    getRestaurantNearMe(
      {
        page: 1,
        limit: 1,
        search: '',
      } as IPage,
      () => {},
    );
  }, [getRestaurantNearMe]);
  useEffect(() => {
    setFCMTokenUser(async token => {
      const data = {
        token: token,
      };
      const accept = await getKeyStore(KEY_CONTEXT.ACCESS_TOKEN);
      accept !== 'undefined' && onFCMToken(data, userInfo?.id, () => {});
    });
  }, [userInfo?.useId]);
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
  const length = userInfo?.full_name?.split(' ').length;
  const fullName =
    `${
      (!!userInfo?.full_name?.split(' ')[length - 2] &&
        userInfo?.full_name?.split(' ')[length - 2]) ||
      ' '
    }` +
    ' ' +
    userInfo?.full_name?.split(' ')[length - 1];
  return (
    <HomeLayout
      bgColor={isIos ? Colors.home : Colors.home}
      header={{
        notGoBack: true,
      }}>
      <StatusBar backgroundColor={Colors.home} barStyle={'light-content'} />
      <ViewCus f-1 bg-white>
        <ViewCus style={{ backgroundColor: Colors.home }}>
          <ViewCus flex-row justify-space-between px-16 pt-12 items-center>
            <ViewCus f-8>
              <ViewCus flex-row mb-12>
                <TextCus
                  useI18n
                  color-white
                  bold
                  heading1
                  style={{ lineHeight: 26 }}>
                  {fullName.trim() !== 'undefined' ? 'hello' : 'hi'}
                </TextCus>
                <TextCus
                  numberOfLines={1}
                  l-5
                  color-white
                  bold
                  heading1
                  style={{ lineHeight: 26 }}>
                  {fullName.trim() !== 'undefined' ? fullName?.trim() : ''}
                </TextCus>
              </ViewCus>
              <ViewCus flex-row items-center>
                <Image source={Images.location} />
                <TextCus l-10 color-white bold f-1 numberOfLines={1}>
                  {addess}
                </TextCus>
              </ViewCus>
            </ViewCus>
            <ViewCus f-2 items-flex-end>
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
        <ViewCus f-1 t-30 mb-30>
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
