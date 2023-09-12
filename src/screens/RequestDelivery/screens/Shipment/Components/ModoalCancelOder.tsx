import { Buttons, ModalCus, TextCus, ViewCus } from 'components';
import { NavigationService, Routes } from 'navigation';
import React, {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useState,
} from 'react';
import { Colors } from 'theme';

import { StyleSheet } from 'react-native';
import { height, width } from 'utils/libs';
const ModalCancelOder = (props: any, ref) => {
  const [visible, setVisiable] = useState<boolean>(false);
  const [name, setName] = useState(props?.orderDetailData?.receiver_name || '');
  const showModal = () => {
    setVisiable(true);
  };
  const closeModal = () => {
    setVisiable(false);
  };
  useImperativeHandle(
    ref,
    () => {
      return {
        close: closeModal,
        show: showModal,
      };
    },
    [],
  );

  useEffect(() => {
    setName(props?.orderDetailData?.receiver_name);
  }, [props?.orderDetailData?.receiver_name]);
  return (
    <ModalCus
      visible={visible}
      hideModal={closeModal}
      title="Chon hinh thuc phu hop voi ban"
      style={styles.container}>
      <ViewCus style={styles.body}>
        <TextCus pl-10 style={styles.titleModal}>
          Đơn giao của bạn đã bị huỷ
        </TextCus>
        <TextCus pl-10 color={Colors.grey85}>
          Chúng tôi vẫn giữ thông tin chi tiết đơn hàng giao đến
          <TextCus bold size={18}>
            {' '}
            {name}{' '}
          </TextCus>
          nên bạn có thể dễ dàng đặt lại
        </TextCus>
        <Buttons
          mt-10
          ml-10
          mr-10
          style={styles.refreshRequire}
          onPress={() => {
            closeModal();
            NavigationService.goBack();
          }}
          disabled={false}>
          <TextCus
            bold
            useI18n
            mainSize
            style={{
              color: Colors.white,
            }}>
            refreshRequire
          </TextCus>
        </Buttons>
        <Buttons
          mt-10
          ml-10
          mr-10
          style={styles.btnClose}
          onPress={() => {
            closeModal();
            NavigationService.navigate(Routes.HomeTabs);
          }}
          disabled={false}>
          <TextCus
            bold
            useI18n
            mainSize
            style={{
              color: Colors.main,
            }}>
            action.close
          </TextCus>
        </Buttons>
      </ViewCus>
    </ModalCus>
  );
};

export default forwardRef(ModalCancelOder);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'transparent',
    position: 'absolute',
    zIndex: 1,
  },
  body: {
    height: 316,
    backgroundColor: '#fff',
    position: 'absolute',
    width,
    bottom: 0,
  },
  titleModal: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.main,
  },
  stylesOutModal: {
    width,
    height: height - 316,
  },
  txtTitle: {
    fontWeight: 600,
  },
  textSubtitle: {
    fontSize: 10,
    marginTop: 3,
  },
  price: {
    fontSize: 16,
    marginTop: 3,
    fontWeight: '600',
  },
  bottom: {
    height: 40,
    marginTop: 10,
  },
  FlatList: {
    marginTop: 10,
  },
  activeItem: {
    backgroundColor: Colors.koromiko,
  },
  buttoCancel: {
    backgroundColor: Colors.white,
    borderWidth: 1,
    borderColor: Colors.main,
    borderRadius: 8,
  },
  btnClose: {
    backgroundColor: Colors.pumice,
    borderRadius: 8,
  },
  refreshRequire: {
    backgroundColor: Colors.greenHaze,
    borderRadius: 8,
  },
});
