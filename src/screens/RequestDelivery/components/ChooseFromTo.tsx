import React, {
  useCallback,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
  useMemo,
} from 'react';
import Icon from 'assets/svg/Icon';
import { Divider, TextCus, TextInputs, TouchCus, ViewCus } from 'components';
import { BaseStyle, Colors } from 'theme';
import { useGeo, useLocation } from 'hooks';
import { Toast } from 'react-native-toast-message/lib/src/Toast';
import { Platform, TextInput, Keyboard, View } from 'react-native';
import { BottomSheetView } from '@gorhom/bottom-sheet';

interface LocationResult extends LocationFind {
  lat: number;
  long: number;
  place_id: string;
}

interface IProps {
  onChooseFromToChange?: (from, to) => void;
  disabled?: boolean;
  fromToData?: {
    from: {
      address: string;
      lat: number;
      long: number;
      place_id?: string;
    };
    to: {
      address: string;
      lat: number;
      long: number;
      place_id?: string;
    };
  };
}

type LocationFind = {
  address: string;
  place_id?: string;
  structured_formatting?: StructuredFormatting;
};

interface ISearchAutoComplete {
  description: string;
  matched_substrings: MatchedSubstring[];
  place_id: string;
  reference: string;
  structured_formatting: StructuredFormatting;
  terms: Term[];
  types: string[];
}

interface MatchedSubstring {
  length: number;
  offset: number;
}

interface StructuredFormatting {
  main_text: string;
  main_text_matched_substrings: MatchedSubstring[];
  secondary_text: string;
}

interface Term {
  offset: number;
  value: string;
}

const ChooseFromTo = React.forwardRef<
  {
    getValue: () => { from: LocationResult | null; to: LocationResult | null };
  },
  IProps
>((props, ref) => {
  //#region Static
  const { locationUser } = useLocation();
  const { searchDetail, searchAutoComplete, onNameByLatLng } = useGeo();
  //#endregion

  //#region State
  const [fromLocation, setFromLocation] = useState<LocationFind | null>(
    props.fromToData?.from ?? {
      address: '',
    },
  );
  const [toLocation, setToLocation] = useState<LocationFind | null>(
    props.fromToData?.to ?? {
      address: '',
    },
  );

  const [fromLocationFinal, setFromLocationFinal] = useState<
    LocationFind & { lat?: number; long?: number; place_id?: string }
  >({
    address: '',
  });
  const [toLocationFinal, setToLocationFinal] = useState<
    LocationFind & { lat?: number; long?: number; place_id?: string }
  >({
    address: '',
  });
  const [isFocusOnFrom, setIsFocusOnFrom] = useState(false);

  const [address, setAddress] = useState<ISearchAutoComplete[]>([]);
  //#endregion

  //#region Ref control
  const inputToRef = useRef<TextInput>();
  const inputFromRef = useRef<TextInput>();
  //#endregion
  //#region Ref value
  const typingTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  //#endregion

  //#region Function
  const checkFromTo = useMemo(() => {
    let rs = true;
    if (
      toLocation?.address !== '' &&
      fromLocation?.address !== '' &&
      fromLocation?.address === toLocation?.address
    ) {
      Toast.show({
        text1: 'Điểm nhận và giao hàng trùng nhau',
        position: 'top',
        type: 'error',
      });
      rs = false;
    }
    return rs;
  }, [fromLocation, toLocation]);

  const validFromToFinalResult = useCallback(
    (
      data: LocationFind & { lat?: number; long?: number; place_id?: string },
    ) => {
      let rs = true;
      if (!data.address || !data.lat || !data.long || !data.place_id) {
        rs = false;
      }
      return rs;
    },
    [],
  );
  const onChangeText = (input, from) => {
    if (from) {
      setFromLocation(x => {
        return {
          ...x,
          address: input,
        };
      });
    } else {
      setToLocation(x => {
        return {
          ...x,
          address: input,
        };
      });
    }
    callApiComplete(input);
  };

  const callApiComplete = input => {
    if (typingTimeout.current) {
      clearTimeout(typingTimeout.current);
    }
    typingTimeout.current = setTimeout(() => {
      searchAutoComplete(
        {
          input,
          options: {
            limit: 20,
          },
        },
        (res: ISearchAutoComplete[]) => {
          setAddress(res);
        },
      );
    }, 1000);
  };

  const getPosition = useCallback(() => {
    if (locationUser) {
      onNameByLatLng(
        { latitude: locationUser.lat, longitude: locationUser.long },
        result => {
          searchAutoComplete(
            {
              input: result,
              options: {
                limit: 1,
              },
            },
            (res: ISearchAutoComplete[]) => {
              if (res && res[0]) {
                setFromLocation({
                  address: res[0]?.description,
                  place_id: res[0].place_id,
                });
                if (!props.disabled) {
                  inputToRef.current?.focus();
                }
              }
            },
          );
        },
      );
    }
  }, [locationUser, searchAutoComplete, onNameByLatLng, props.disabled]);
  //#endregion

  //#region Watch change
  useEffect(() => {
    if (!props.disabled) {
      getPosition();
    }
  }, []);

  useEffect(() => {
    if (
      !fromLocation ||
      !toLocation ||
      !fromLocation.place_id ||
      !toLocation.place_id
    ) {
      return;
    }

    searchDetail({ place_id: fromLocation.place_id }, a => {
      if (a.result) {
        setFromLocationFinal({
          address: a.result.formatted_address,
          lat: a.result.geometry.location.lat,
          long: a.result.geometry.location.lng,
          place_id: fromLocation.place_id,
        });
      }
    });
    searchDetail({ place_id: toLocation.place_id }, a => {
      if (a.result) {
        setToLocationFinal({
          address: a.result.formatted_address,
          lat: a.result.geometry.location.lat,
          long: a.result.geometry.location.lng,
          place_id: toLocation.place_id,
        });
      }
    });
  }, [fromLocation, toLocation, searchDetail]);

  useEffect(() => {
    props.onChooseFromToChange?.(fromLocationFinal, toLocationFinal);
  }, [toLocationFinal, fromLocationFinal, props.onChooseFromToChange]);

  useEffect(() => {
    // inputToRef.current?.focus();
  }, []);
  //#endregion

  //#region Render
  const renderItem = useCallback(
    ({ item, index }: { item: ISearchAutoComplete; index: number }) => {
      return (
        <ViewCus key={index}>
          <TouchCus
            onPress={() => {
              if (isFocusOnFrom) {
                setFromLocation({
                  ...item,
                  address: item?.structured_formatting?.main_text,
                });
              } else {
                setToLocation({
                  ...item,
                  address: item?.structured_formatting?.main_text,
                });
              }
              setAddress([]);
            }}
            style={[BaseStyle.flexRowCenter]}>
            <ViewCus style={{}} ml-8 f-1>
              <TextCus color={Colors.black3A}>
                {item?.structured_formatting?.main_text}
              </TextCus>
              <TextCus subhead color={Colors.grey85}>
                {item?.structured_formatting?.secondary_text}
              </TextCus>
            </ViewCus>
          </TouchCus>
          <Divider
            small
            color={Colors.greyEE}
            style={{
              marginVertical: 5,
            }}
          />
        </ViewCus>
      );
    },
    [isFocusOnFrom],
  );
  //#endregion

  //#region Export func
  useImperativeHandle(ref, () => {
    return {
      isValid: () => {
        return (
          validFromToFinalResult(fromLocationFinal) &&
          validFromToFinalResult(toLocationFinal)
        );
      },
      checkFromTo: checkFromTo,
      getValue: () => {
        return {
          from: validFromToFinalResult(fromLocationFinal)
            ? (fromLocationFinal as LocationResult)
            : null,
          to: validFromToFinalResult(toLocationFinal)
            ? (toLocationFinal as LocationResult)
            : null,
        };
      },
    };
  });
  //#endregion

  return (
    <View flex-1 style={[BaseStyle.wrapperMain]}>
      <ViewCus style={[BaseStyle.flexRowCenter]}>
        <ViewCus mr-8>
          <Icon.CurrentLocation />
        </ViewCus>
        <ViewCus
          style={[
            {
              flex: 1,
            },
          ]}>
          <TextInputs
            ref={inputFromRef as any}
            disabled={props.disabled}
            editable={!props.disabled}
            styleWrapperInput={{
              marginBottom: 0,
            }}
            autoFocus={false}
            out
            onBlur={() => {
              Keyboard.dismiss();
              if (fromLocation?.structured_formatting?.main_text) {
                setFromLocation({
                  ...toLocation,
                  address: fromLocation?.structured_formatting?.main_text,
                });
              }
              setIsFocusOnFrom(false);
            }}
            onFocus={() => {
              setIsFocusOnFrom(true);
            }}
            value={fromLocation?.address}
            onChangeText={t => onChangeText(t, true)}
            placeholder="Tìm điểm đón"
          />
        </ViewCus>
      </ViewCus>
      <ViewCus
        style={{
          height: 20,
          borderLeftWidth: 1,
          borderStyle: Platform.select({
            ios: 'solid',
            android: 'dashed',
          }),
          borderLeftColor: Colors.main,
        }}
        ml-8
      />
      <ViewCus style={[BaseStyle.flexRowCenter]}>
        <ViewCus mr-13>
          <Icon.IconLocationActive />
        </ViewCus>
        <ViewCus
          style={{
            flex: 1,
          }}>
          <TextInputs
            ref={inputToRef as any}
            disabled={props.disabled}
            editable={!props.disabled}
            styleWrapperInput={{
              marginBottom: 0,
            }}
            onBlur={() => {
              Keyboard.dismiss();
              if (toLocation?.structured_formatting?.main_text) {
                setToLocation({
                  ...toLocation,
                  address: toLocation?.structured_formatting?.main_text,
                });
              }
              setAddress([]);
            }}
            onPress={()=>{console.log('xxxxx');
            }}
            onFocus={() => {
              setIsFocusOnFrom(false);
            }}
            value={toLocation?.address}
            onChangeText={t => onChangeText(t, false)}
            placeholder="Tìm điểm đến"
          />
          <ViewCus
            style={{
              position: 'absolute',
              right: 10,
              marginTop: 14,
            }}>
            <Icon.Voice color={Colors.main} height={20} width={20} />
          </ViewCus>
        </ViewCus>
      </ViewCus>
      <ViewCus mt-15>
        {address.map((x, i) => renderItem({ item: x, index: i }))}
      </ViewCus>
    </View>
  );
});

export default ChooseFromTo;
