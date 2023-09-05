import { BottomTabBarButtonProps } from '@react-navigation/bottom-tabs';
import { TextCus, ViewCus } from 'components';
import React, { useMemo } from 'react';
import {
  Image,
  Platform,
  StyleSheet,
  TouchableWithoutFeedback,
} from 'react-native';
import { Colors, FontWeight } from 'theme';
interface IProps extends BottomTabBarButtonProps {
  icon: Required;
  route: string;
  label: string;
}
const ButtonBottomStack: React.FC<IProps> = ({
  onPress,
  icon,
  accessibilityState,
  label,
}) => {
  const focused = Boolean(accessibilityState?.selected);
  const { color, fontWeight } = useMemo(() => {
    return {
      color: focused ? Colors.main : Colors.grey84,
      fontWeight: focused ? FontWeight.bold : FontWeight.regular,
    };
  }, [focused]);
  return (
    <TouchableWithoutFeedback onPress={onPress}>
      <ViewCus style={styles.container}>
        {/* <IconApp name={icon} size={24} color={color} /> */}
        <Image source={icon} style={{ tintColor: color }} />
        <TextCus
          mt-5
          subhead
          useI18n
          color={color}
          style={{
            fontWeight,
          }}>
          {label}
        </TextCus>
      </ViewCus>
    </TouchableWithoutFeedback>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-between',
    alignItems: 'center',
    alignSelf: 'center',
    ...Platform.select({
      android: {},
      ios: {
        marginTop: 10,
      },
    }),
  },
});
export default ButtonBottomStack;
