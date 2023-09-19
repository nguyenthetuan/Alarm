import { IconName } from 'assets';
import { RNFlatList, IconApp, TextCus, TouchCus, ViewCus } from 'components';
import React from 'react';
import { FlatListProps, ListRenderItem } from 'react-native';
import { Colors } from 'theme';
interface IProps<T> extends FlatListProps<T> {
  title?: string;
  onPress?: () => void | undefined;
  data: T[];
  renderItem: ListRenderItem<T>;
}
const CarouselHorizontal = <T extends object | number>(props: IProps<T>) => {
  const { renderItem, title, onPress, data, ...rest } = props;
  return (
    <ViewCus mt-25>
      {title && (
        <ViewCus flex-row items-center justify-space-between mb-16 px-10>
          <TextCus heading3 useI18n>
            {title}
          </TextCus>
          <TouchCus onPress={onPress!} flex-row items-center>
            <TextCus useI18n color={Colors.main} mainSize mr-5>
              all
            </TextCus>
            <IconApp
              name={IconName.ChevronRight}
              size={12}
              color={Colors.yellowF8}
            />
          </TouchCus>
        </ViewCus>
      )}
      <RNFlatList
        data={data}
        renderItem={renderItem}
        horizontal
        showsHorizontalScrollIndicator={false}
        snapToAlignment="start"
        decelerationRate={'fast'}
        {...rest}
      />
    </ViewCus>
  );
};
export default CarouselHorizontal;
