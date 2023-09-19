import { ImageCus, TextCus, TouchCus, ViewCus } from 'components';
import React, { useCallback } from 'react';
import { FlatList } from 'react-native';
import styles from './styles';
import { NavigationService, Routes } from 'navigation';
import { ICategory } from 'types';
import { Images } from 'assets';
import { getImage } from 'utils';
import { Colors } from 'theme';
interface IProps {
  categories: ICategory[];
}

const ListCategories: React.FC<IProps> = ({ categories }) => {
  const onPressCategoryItem = useCallback(() => {
    NavigationService.navigate(Routes.Categories);
  }, []);
  const renderItem = useCallback(
    ({ item, index }: { item: ICategory; index: number }) => {
      const { name } = item;
      const defaultIcon = Images[`${item?.defaultIcon}`];
      return (
        <TouchCus
          key={index}
          style={styles.flex025}
          items-center
          mb-16
          t-10
          onPress={item?.onPress ?? onPressCategoryItem}>
          <ViewCus items-center justify-center>
            <ViewCus
              style={{
                backgroundColor: Colors.seashellPeach,
              }}
              br-40
              h-62
              w-62
              t-5
              items-center
              justify-center>
              <ImageCus
                source={
                  item.icon
                    ? { uri: getImage({ image: item.icon }) }
                    : defaultIcon
                }
                style={[
                  styles.categoryImage,
                  name?.includes('Tất cả') && styles.allImage,
                ]}
                resizeMode="contain"
              />
            </ViewCus>
            <ViewCus mt-16>
              <TextCus regular color-black22 textAlign="center">
                {name}
              </TextCus>
            </ViewCus>
          </ViewCus>
        </TouchCus>
      );
    },
    [onPressCategoryItem],
  );
  const keyExtractor = useCallback((item, index) => `${index}`, []);
  return (
    <ViewCus px-4>
      <FlatList
        data={categories}
        renderItem={renderItem}
        showsVerticalScrollIndicator={false}
        keyExtractor={keyExtractor}
        scrollEnabled={false}
        numColumns={4}
      />
    </ViewCus>
  );
};
export default ListCategories;
