import {
  Buttons,
  ImageCus,
  ModalCus,
  TextCus,
  TouchCus,
  ViewCus,
} from 'components';
import React, {
  forwardRef,
  useImperativeHandle,
  useMemo,
  useState,
} from 'react';
import { Colors } from 'theme';

import { Images } from 'assets';
import {
  FlatList,
  StyleSheet,
  Text,
  TouchableWithoutFeedback,
} from 'react-native';
import {formatMoney, height, width} from 'utils/libs';
const ModalDeliveryMethod = (props: any, ref) => {
  const [visible, setVisiable] = useState<boolean>(false);
  const data = useMemo(() => props.data, [props.data]);
  const showModal = () => {
    setVisiable(true);
  };
  const closeModal = () => {
    setVisiable(false);
  };
  const [itemSelect, setItemSelect] = useState<any>({});
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

  const btnContinue = () => {
    props.continue(itemSelect);
    closeModal();
  };
  const renderItem = ({ item }) => {
    const isSelected = item.id === itemSelect?.id;
    return (
      <TouchCus
        py-8
        px-20
        flex-row
        justify-space-between
        onPress={() => {
          setItemSelect(item);
        }}
        style={isSelected ? styles.activeItem : { marginVertical: 5 }}>
        <ViewCus flex-row items-center>
          <ImageCus source={Images.typeProduct} size={32} />
          <ViewCus l-5>
            <Text style={styles.txtTitle}>{item.name}</Text>
          </ViewCus>
        </ViewCus>
        <Text style={styles.price}>Từ {formatMoney(item.price)}</Text>
      </TouchCus>
    );
  };

  const renderFooter = () => (
    <Buttons textBtn="Tiếp tục" style={styles.bottom} onPress={btnContinue} />
  );
  return (
    <ModalCus
      visible={visible}
      hideModal={closeModal}
      title="Chon hinh thuc phu hop voi ban"
      style={styles.container}>
      <TouchableWithoutFeedback onPress={closeModal}>
        <ViewCus style={styles.stylesOutModal} />
      </TouchableWithoutFeedback>
      <ViewCus style={styles.body}>
        <TextCus px-24 style={styles.titleModal}>
          Chọn loại hình thức phù hợp
        </TextCus>
        <FlatList
          data={data}
          renderItem={renderItem}
          ListFooterComponent={renderFooter}
          style={styles.FlatList}
        />
      </ViewCus>
    </ModalCus>
  );
};

export default forwardRef(ModalDeliveryMethod);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'transparent',
    position: 'absolute',
  },
  body: {
    height: 350,
    paddingTop: 16,
    backgroundColor: '#fff',
    position: 'absolute',
    width,
    bottom: 0,
  },
  titleModal: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
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
    marginHorizontal: 20,
  },
  FlatList: {
    marginTop: 10,
  },
  activeItem: {
    backgroundColor: '#FFF9F2',
    borderTopWidth: 1,
    borderBottomWidth: 1,
    marginVertical: 5,
    borderTopColor: Colors.koromiko,
    borderBottomColor: Colors.koromiko,
  },
});
