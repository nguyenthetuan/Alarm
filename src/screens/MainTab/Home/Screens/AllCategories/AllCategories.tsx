import { HomeLayout, ScrollViewCus } from 'components';
import { useHome } from 'hooks';
import React, { useEffect, useMemo } from 'react';
import { Colors } from 'theme';
import { DATA_CATEGORY } from 'types';
import { ListCategories } from '../../Components';

const AllCategories = () => {
  const { getListCategories, listCategories } = useHome();
  useEffect(() => {
    getListCategories();
  }, [getListCategories]);
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
      f-1
      t-20
      bgColor={Colors.main}
      header={{
        title: 'Allcategories',
        notGoBack: false,
        iconColor: Colors.white,
      }}>
      <ScrollViewCus>
        <ListCategories categories={categories} />
      </ScrollViewCus>
    </HomeLayout>
  );
};

export default AllCategories;
