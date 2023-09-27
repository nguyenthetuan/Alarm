import React from 'react';
import { HomeLayout, TextCus, ViewCus } from 'components';
import { Colors } from 'theme';

interface IProps {}

const DeliveryAddressVehicle: React.FC<IProps> = () => {
  return (
    <HomeLayout
      bgColor={Colors.main}
      header={{
        title: 'category.delivery_address',
      }}>
      <ViewCus>
        <TextCus>Huy</TextCus>
      </ViewCus>
    </HomeLayout>
  );
};
export default DeliveryAddressVehicle;
