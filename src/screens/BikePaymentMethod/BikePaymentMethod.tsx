import { View, Text } from 'react-native';
import React from 'react';
import { HomeLayout, TextCus, TouchCus, ViewCus } from 'components';
import { array } from 'yup';
import Icon from 'assets/svg/Icon';
import styles from './styles';
import { Colors } from 'theme';
import { NavigationService } from '../../navigation/NavigationService';
type IProps = {
  navigation: any;
};

const paymentData: array = [
  { id: 1, name: 'Tiền mặt', icon: 'paymentMoney', price: null },
  // { id: 1, name: 'Ví', icon: 'paymentMoney', price: 300000 },
  // { id: 1, name: 'Cổng thanh toán', icon: 'paymentMoney', price: 0 },
];
const BikePaymentMethod: React.FC<IProps> = () => {
  const renderPayment = (item, index) => {
    return (
      <TouchCus
        onPress={() => NavigationService.goBack()}
        style={[
          styles.itemContainer,
          { backgroundColor: index === 0 ? Colors.color_ff : 'white' },
        ]}
        key={index}>
        <ViewCus style={styles.rowCenter}>
          <Icon.paymentMoney />
          <TextCus style={styles.name}>{item.name}</TextCus>
        </ViewCus>
        <Icon.tick />
      </TouchCus>
    );
  };
  return (
    <HomeLayout
      isForForm
      header={{
        title: 'biker.choosePaymentMethod',
      }}
      styleContent={{}}
      isDark>
      {paymentData.map(renderPayment)}
    </HomeLayout>
  );
};

export default BikePaymentMethod;
