import { BottomSheetScrollView } from '@gorhom/bottom-sheet';
import Icon from 'assets/svg/Icon';
import {
  ImageCus,
  RoutineLocaltion,
  TextCus,
  TouchCus,
  ViewCus,
} from 'components';
import styles from './styles';
import { StyleSheet } from 'react-native';
import { Colors } from 'theme';
import { getWidthBySpace } from 'utils';
import { useGeo } from 'hooks';
import { useEffect, useState } from 'react';
import { Images } from 'assets';
import { View } from 'react-native-reanimated/lib/typescript/Animated';

interface IProps {
  onCancel: () => void;
  onSubmit: () => void;
  type?: string;
}

// {(val.type === 'CAR4SEATS' ||
// val.type === 'CAR7SEATS') && (
// <ImageCus
//   source={Images.car4Seat}
//   style={[
//     {
//       width: 32,
//       height: 32,
//     },
//   ]}
//   resizeMode="contain"
// />
// )}
// {val.type === 'MOTORBIKE' && (
// <ImageCus
//   source={Images.bike}
//   style={[
//     {
//       width: 32,
//       height: 32,
//     },
//   ]}
//   resizeMode="contain"
// />
// )}

const FindedDriver: React.FC<IProps> = props => {
  const { type } = props;
  return (
    <>
      <ViewCus p-16 style={[styles.w100]}>
        <ViewCus items-center>
          <ViewCus
            mb-20
            bg-pinkShadow45
            br-40
            h-64
            w-64
            items-center
            justify-center
            style={[
              {
                // position: 'absolute',
              },
            ]}
          />
          <ViewCus style={{ position: 'absolute' }}>
            {(type === 'CAR4SEATS' || type === 'CAR7SEATS') && (
              <ImageCus
                source={Images.car4Seat}
                style={[
                  {
                    width: 64,
                    height: 64,
                  },
                ]}
                resizeMode="contain"
              />
            )}
            {type === 'MOTORBIKE' && (
              <ImageCus
                source={Images.bike}
                style={[
                  {
                    width: 64,
                    height: 64,
                  },
                ]}
                resizeMode="contain"
              />
            )}
          </ViewCus>
        </ViewCus>
        <ViewCus items-center>
          <TextCus useI18n heading4 bold>
            Đã tìm thấy tài xế
          </TextCus>
        </ViewCus>
      </ViewCus>
    </>
  );
};

const styleCus = StyleSheet.create({
  containerButtonCancel: {
    position: 'absolute',
    zIndex: 1,
  },
});

export default FindedDriver;
