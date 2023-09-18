import { BottomSheetScrollView } from '@gorhom/bottom-sheet';
import { TextCus, TouchCus, ViewCus } from 'components';
import React, { useState } from 'react';
import { View } from 'react-native';
import { Colors } from 'theme';
import ToggleSwitch from 'toggle-switch-react-native';
import styles from './styles';

// import { useIsFocused } from '@react-navigation/native';

interface Option {
  id: number;
  fast: boolean;
  price: number;
  time: number;
  distance: number;
}

interface IProps {
  initialValue?: Option;
  options: Option[];
  onCancel: () => void;
  onSubmit: (data: Option) => void;
  fromToData: any;
  onCloseSheet: () => void;
  onShowSheet: () => void;
  onLayout: (height: number) => void;
}

const moreOption = [
  {
    name: 'Ride Cover - 2.000đ',
    description:
      'Nhận phiếu ưu đãi 5% dịch vụ khi tài xế đến trễ 10 phút hoặc hơn',
    id: 0,
    isOn: false,
  },
  {
    name: 'Chế độ đi chung xe',
    description: 'Nhận phiếu ưu đãi 10% dịch vụ',
    id: 1,
    isOn: false,
  },
  {
    name: 'Chuyến xe yên lặng - miễn phí',
    description: 'Tài xes sẽ không bắt chuyện nếu không cần thiết',
    id: 2,
    isOn: false,
  },
];
const MoreOption: React.FC<IProps> = props => {
  const [data] = useState(moreOption);
  const [ArrOn, setArrOn] = useState([]);

  const getStatus = id => {
    const check = ArrOn.some(item => item.id === id);
    return check;
  };
  return (
    <ViewCus
      flex-1
      flex-column
      flexGrow-1
      style={[styles.w100, { paddingHorizontal: 20 }]}>
      <BottomSheetScrollView>
        <View onLayout={e => props.onLayout(e.nativeEvent.layout.height)}>
          {data.map((val, index) => {
            return (
              <TouchCus
                key={index}
                onPress={() => {
                  // props.onSubmit(val);
                }}>
                <ViewCus
                  style={{
                    paddingVertical: 16,
                    borderTopWidth: index === 0 ? 0 : 1,
                    borderColor: Colors.colorD9,
                  }}
                  flex-row
                  items-center>
                  <ViewCus f-1 mr-30>
                    <TextCus bold heading5>
                      {val.name}
                    </TextCus>
                    <TextCus>{val.description}</TextCus>
                  </ViewCus>
                  <ToggleSwitch
                    isOn={getStatus(val.id)}
                    onColor="green"
                    offColor="gray"
                    size="small"
                    onToggle={isOn => {
                      if (isOn) {
                        setArrOn(ArrOn.concat(val));
                      } else {
                        setArrOn(ArrOn.filter(item => item.id !== val.id));
                      }
                    }}
                  />
                </ViewCus>
              </TouchCus>
            );
          })}
        </View>
      </BottomSheetScrollView>
    </ViewCus>
  );
};

export default MoreOption;
