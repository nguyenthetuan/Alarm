import { Icons } from 'assets';
import {
  Divider,
  IconApp,
  ImageCus,
  TextCus,
  TouchCus,
  ViewCus,
} from 'components';
import React from 'react';
import { StyleProp, ViewStyle, Image } from 'react-native';
import { BaseStyle, Colors } from 'theme';

interface IProps {
  icon?: any;
  name: string;
  isLine?: boolean;
  onPress: () => void;
  style?: StyleProp<ViewStyle>;
  styleLine?: StyleProp<ViewStyle>;
  isHiden?: boolean;
  isImage?: boolean;
}

const ListItem: React.FC<IProps> = ({
  icon,
  name,
  isLine,
  onPress,
  style,
  styleLine,
  isHiden,
  isImage,
}) => {
  if (!isHiden) {
    return <ViewCus />;
  }
  return (
    <>
      <TouchCus
        onPress={onPress}
        style={[BaseStyle.flexRowSpaceBetwwen, BaseStyle.wrapperMain, style]}
        bg-white>
        <ViewCus style={[BaseStyle.flexRowCenter]}>
          {icon ? (
            isImage ? (
              <ImageCus
                source={icon}
                style={{ width: 20, height: 20, marginRight: 14 }}
              />
            ) : (
              <IconApp
                name={icon}
                size={22}
                color={Colors.greyAD}
                style={{ marginRight: 14 }}
              />
            )
          ) : null}
          <TextCus useI18n>{name}</TextCus>
        </ViewCus>
      </TouchCus>
      {!isLine && <Divider large style={[styleLine]} />}
    </>
  );
};
export default ListItem;
