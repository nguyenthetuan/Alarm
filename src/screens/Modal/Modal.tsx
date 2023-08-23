import Icon from 'assets/svg/Icon';
import { TextCus, TouchCus, ViewCus } from 'components';
import React from 'react';
import { StyleSheet } from 'react-native';
import { width } from 'utils';

const ModalScreen: React.FC = ({ route }) => {
  return (
    <ViewCus style={styles.container}>
      <ViewCus style={styles.radius} pt-20 items-center bg-white>
        <Icon.ICON_ERROR />
        <TextCus heading2 mt-10 color-main>
          Bạn chưa đăng nhập
        </TextCus>
        <TextCus mt-10>Bạn vui lòng đăng nhập để tiếp tục</TextCus>
        <TouchCus
          onPress={route.params?.onPress}
          my-20
          style={styles.button}
          bg-main>
          <TextCus heading5 color-white>
            Đăng nhập
          </TextCus>
        </TouchCus>
      </ViewCus>
    </ViewCus>
  );
};
export default ModalScreen;
const styles = StyleSheet.create({
  container: {
    backgroundColor: 'rgba(0,0,0,0.3)',
    flex: 1,
    justifyContent: 'flex-end',
  },
  button: {
    paddingVertical: 12,
    width: width - 40,
    alignItems: 'center',
    borderRadius: 10,
  },
  radius: {
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
});
