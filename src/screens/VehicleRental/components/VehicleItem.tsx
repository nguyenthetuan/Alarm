import { TextCus, ViewCus } from 'components';
import React from 'react';

interface IProps {}

const VehicleItem: React.FC<IProps> = () => {
  return (
    <ViewCus>
      <TextCus>FoodItem</TextCus>
    </ViewCus>
  );
};

export default VehicleItem;
