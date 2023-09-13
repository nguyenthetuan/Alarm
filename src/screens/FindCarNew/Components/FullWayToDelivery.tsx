import { Images } from 'assets';
import Icon from 'assets/svg/Icon';
import { ImageCus, TextCus, TouchCus, ViewCus } from 'components';
import { StyleSheet, View } from 'react-native';
import { Colors } from 'theme';
import { formatMoney, width } from 'utils';
import React, { useEffect, useState } from 'react';
import _ from 'lodash';

interface IProps {
  option: object;
  onSubmit: () => void;
  onLayout: (height: number) => void;
  type: string;
}

const dataTab = [
  { id: 0, name: 'Dành cho bạn' },
  // { id: 0, name: 'Đi chung' },
  // { id: 0, name: 'Plus' },
];

const FullWayToDelivery: React.FC<IProps> = props => {
  const [data, setData] = useState(
    _.cloneDeep(
      props.type !== 'CAR_DRIVER'
        ? props.option.filter(
            elm => elm.type.includes(props.type) && elm.vehicle,
          )
        : props.option.filter(elm => !elm.vehicle),
    ) || [],
  );
  useEffect(() => {
    setData(
      _.cloneDeep(
        props.type !== 'CAR_DRIVER'
          ? props.option.filter(
              elm => elm.type.includes(props.type) && elm.vehicle,
            )
          : props.option.filter(elm => !elm.vehicle),
      ),
    );
  }, [props.option]);
  const renderTab = (item, index) => {
    return (
      <ViewCus style={styles.itemTab} key={index}>
        <TextCus bold color={Colors.main}>
          {item.name}
        </TextCus>
      </ViewCus>
    );
  };
  return (
    <View
      onLayout={e => props.onLayout(e.nativeEvent.layout.height)}
      style={styles.tabWrap}>
      <ViewCus style={{ marginBottom: 30 }} flex-row>
        {dataTab.map(renderTab)}
      </ViewCus>
      {data.map((val, index) => {
        return (
          <TouchCus
            key={index}
            flex-row
            mb-12
            px-16
            h-48
            items-center
            justify-space-between
            style={{ width: '100%' }}
            onPress={() => {
              props.onSubmit(val);
            }}>
            <ViewCus fl-1 flex-row items-center>
              <ViewCus mr-8>
                <ViewCus items-center>
                  <ViewCus
                    bg-pinkShadow45
                    br-40
                    h-30
                    w-30
                    style={[
                      {
                        position: 'absolute',
                      },
                    ]}
                  />
                  {(val.type === 'CAR4SEATS' || val.type === 'CAR7SEATS') && (
                    <ImageCus
                      source={Images.car4Seat}
                      style={[
                        {
                          width: 32,
                          height: 32,
                        },
                      ]}
                      resizeMode="contain"
                    />
                  )}
                  {val.type === 'MOTORBIKE' && (
                    <ImageCus
                      source={Images.bike}
                      style={[
                        {
                          width: 32,
                          height: 32,
                        },
                      ]}
                      resizeMode="contain"
                    />
                  )}
                </ViewCus>
              </ViewCus>
              <ViewCus>
                <ViewCus flex-row items-center>
                  <TextCus color={Colors.black3A} mr-5>
                    {/* Giao {val.fast ? 'nhanh' : 'chậm'} {formatMoney(val.price)} */}
                    {val.title}
                  </TextCus>
                  <Icon.Info />
                </ViewCus>
                {val.subTitle && (
                  <ViewCus>
                    <TextCus color={'#838D8D'} caption>
                      {/* Giao {val.fast ? 'nhanh' : 'chậm'} {formatMoney(val.price)} */}
                      {val.subTitle}
                    </TextCus>
                  </ViewCus>
                )}
              </ViewCus>
            </ViewCus>
            <TextCus color="#021616" mainSize bold>
              {formatMoney(val?.price)} - {val.distance}km
            </TextCus>
          </TouchCus>
        );
      })}
    </View>
  );
};

export default FullWayToDelivery;
const styles = StyleSheet.create({
  itemTab: {
    // flex: 1,
    backgroundColor: Colors.color_bgTab,
    padding: 8,
    borderRadius: 20,
    width: '30%',
    alignItems: 'center',
  },
  tabWrap: {
    width: width,
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    marginBottom: 30,
  },
});
