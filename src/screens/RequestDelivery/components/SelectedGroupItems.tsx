import React, {
  useCallback,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from 'react';
import Icon from 'assets/svg/Icon';
import { Divider, TextCus, TextInputs, TouchCus, ViewCus } from 'components';
import { BaseStyle, Colors } from 'theme';
import { useGeo, useLocation } from 'hooks';

import {
  FlatList,
  FlatListProps,
  Platform,
  StyleProp,
  TextInput,
  ViewStyle,
} from 'react-native';

interface IProps<T = any> {
  initValue?: T;
  items: T[];
  wrapperStyle?: StyleProp<ViewStyle>;
  renderItemFunc: (
    data: T,
    index: number,
    isSelected: boolean,
  ) => React.JSX.Element;
  onChange?: (val: T) => {};
  flatListProps?: Omit<FlatListProps<T>, 'data' | 'renderItem'>;
}
interface IRef {}
const SelectedGroupItems = React.forwardRef<IRef, IProps>((props, ref) => {
  //#region Static
  //#endregion

  //#region State
  const [selected, setSelected] = useState(props.initValue ?? null);
  //#endregion

  //#region Ref control
  //#endregion

  //#region Ref value
  //#endregion

  //#region Function
  //#endregion

  //#region Watch change

  //#endregion

  //#region Render
  const renderItem = useCallback(
    ({ item, index }) => {
      const isSelected = item === selected;
      return (
        <TouchCus
          style={[props.wrapperStyle]}
          onPress={() => {
            setSelected(item);
          }}>
          {props.renderItemFunc(item, index, isSelected)}
        </TouchCus>
      );
    },
    [props.renderItemFunc, selected],
  );
  //#endregion

  //#region Export func
  useImperativeHandle(ref, () => {
    return {};
  });
  //#endregion

  return (
    <>
      {props.items.map((x, i) => {
        const isSelected = x === selected;
        return (
          <TouchCus
            key={i}
            style={[props.wrapperStyle]}
            onPress={() => {
              setSelected(x);
            }}>
            {props.renderItemFunc(x, i, isSelected)}
          </TouchCus>
        );
      })}
    </>
  );

  return (
    <FlatList
      data={props.items}
      renderItem={renderItem}
      {...props.flatListProps}
    />
  );
});

export default SelectedGroupItems;
