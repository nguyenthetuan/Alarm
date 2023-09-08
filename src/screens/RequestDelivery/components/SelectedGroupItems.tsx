import { TouchCus } from 'components';
import React, { useImperativeHandle, useState, useEffect } from 'react';

import { FlatListProps, StyleProp, ViewStyle } from 'react-native';

interface IProps<T = any> {
  initValue?: T;
  items: T[];
  wrapperStyle?: StyleProp<ViewStyle>;
  renderItemFunc: (
    data: T,
    index: number,
    isSelected: boolean,
  ) => React.JSX.Element;
  onChange?: (val: T) => void;
  flatListProps?: Omit<FlatListProps<T>, 'data' | 'renderItem'>;
  disable?: boolean;
}
interface IRef {}
const SelectedGroupItems = React.forwardRef<IRef, IProps>((props, ref) => {
  const [selected, setSelected] = useState(props.initValue ?? null);
  useEffect(() => {
    setSelected(props.initValue);
  }, [props.initValue]);
  useImperativeHandle(ref, () => {
    return {};
  });
  return (
    <>
      {props.items.map((x, i) => {
        const isSelected = x.id === selected?.id;
        return (
          <TouchCus
            key={i}
            style={[props.wrapperStyle]}
            disabled={props?.disable}
            onPress={() => {
              setSelected(x);
              if (props.onChange) {
                props?.onChange(x);
              }
            }}>
            {props.renderItemFunc(x, i, isSelected)}
          </TouchCus>
        );
      })}
    </>
  );
});

export default SelectedGroupItems;
