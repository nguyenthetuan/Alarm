import { BottomSheetFlatList, BottomSheetView } from '@gorhom/bottom-sheet';
import Geolocation from '@react-native-community/geolocation';
import Icon from 'assets/svg/Icon';
import {
  Buttons,
  Divider,
  Header,
  IconCus,
  TextCus,
  TextInputs,
  TouchCus,
  ViewCus,
} from 'components';
import { useGeo, useLocation } from 'hooks';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { SafeAreaView } from 'react-native';
import { BaseStyle, Colors } from 'theme';
import { width } from 'utils';
import { FindCarScreenStepView } from '../FindCar';

let typingTimeout = null;
interface IProps {
  onChooseFromToChange?: (from, to) => void;
  setStepView?: React.Dispatch<React.SetStateAction<FindCarScreenStepView>>;
  fromToData?: {
    from: {
      address: string;
      lat: number;
      long: number;
    };
    to: {
      address: string;
      lat: number;
      long: number;
    };
  };
}

type LocationFind = {
  address: string;
  place_id?: string;
};
const ChooseFromTo = React.forwardRef<{}, IProps>((props, ref) => {
  console.log('ref', ref);
  const { searchDetail, searchAutoComplete, onNameByLatLng } = useGeo();
  const { locationUser } = useLocation();

  const [fromLocation, setFromLocation] = useState<LocationFind | null>({
    address: '',
  });
  const [toLocation, setToLocation] = useState<LocationFind | null>({
    address: '',
  });

  const [fromLocationFinal, setFromLocationFinal] =
    useState<LocationFind | null>({
      address: '',
    });
  const [toLocationFinal, setToLocationFinal] = useState<LocationFind | null>({
    address: '',
  });
  const [isFocusOnFrom, setIsFocusOnFrom] = useState(false);

  const [address, setAddress] = useState([]);

  const inputRef = useRef();
  // const debouncedSearchLocation = debounceCus(searchAutoComplete, 1000);

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
    // Xóa bỏ timeout hiện tại nếu có
    clearTimeout(typingTimeout);
    typingTimeout = setTimeout(() => {
      // Thực hiện cuộc gọi API tại đây với input
      searchAutoComplete(
        {
          input,
          options: {
            limit: 20,
          },
        },
        res => {
          setAddress(res);
        },
      );
    }, 1000);
  };

  const getPosition = () => {
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
            res => {
              setFromLocation({ ...res[0], address: res[0]?.description });
            },
          );
        },
      );
    } else {
      Geolocation.getCurrentPosition(
        ({ coords }) => {
          onNameByLatLng(
            { latitude: coords?.latitude, longitude: coords?.longitude },
            result => {
              searchAutoComplete(
                {
                  input: result,
                  options: {
                    limit: 1,
                  },
                },
                res => {
                  setFromLocation({ ...res[0], address: res[0]?.description });
                },
              );
            },
          );
        },
        error => {
          // Alert.alert('Permission denied');
          console.log('Tom log  => error getPosition', error);
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 10000,
        },
      );
    }
  };

  useEffect(() => {
    getPosition();
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
        });
      }
    });
    searchDetail({ place_id: toLocation.place_id }, a => {
      if (a.result) {
        setToLocationFinal({
          address: a.result.formatted_address,
          lat: a.result.geometry.location.lat,
          long: a.result.geometry.location.lng,
        });
      }
    });
  }, [fromLocation, toLocation]);

  const changeFromToFinal = useCallback(() => {
    props.onChooseFromToChange?.(fromLocationFinal, toLocationFinal);
  }, [toLocationFinal, fromLocationFinal, props.onChooseFromToChange]);

  // useEffect(() => {
  //   props.onChooseFromToChange?.(fromLocationFinal, toLocationFinal);
  // }, [toLocationFinal, fromLocationFinal, props.onChooseFromToChange]);

  const renderItem = useCallback(
    ({ item, index }: { item: any; index: number }) => {
      return (
        <ViewCus key={index}>
          <TouchCus
            onPress={() => {
              console.log('Tom log  => item', item);
              if (isFocusOnFrom) {
                setFromLocation({
                  address: item?.structured_formatting?.main_text,
                  ...item,
                });
              } else {
                setToLocation({
                  address: item?.structured_formatting?.main_text,
                  ...item,
                });
              }
              setAddress([]);
            }}
            style={[BaseStyle.flexRowCenter]}>
            {/* <Icon.IconLocation /> */}
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

  useEffect(() => {
    inputRef.current?.focus();
  }, []);
  return (
    <SafeAreaView style={{ flex: 1, width: width }}>
      <BottomSheetView
        style={{
          // paddingHorizontal: 16,
          width: '100%',
          flex: 1,
        }}>
        <ViewCus
          f-1
          style={
            {
              // paddingHorizontal: 16,
              // width: '100%',
            }
          }>
          <ViewCus>
            <Header
              onPressLeft={() => {
                props.setStepView?.(
                  FindCarScreenStepView.QUESTION_CHOOSE_FROM_TO,
                );
              }}
              showCenter={true}
              renderLeft={() => (
                <IconCus name={'chevron-left'} size={18} color={Colors.white} />
              )}
              title="Bạn muốn đi đâu?"
            />
          </ViewCus>
          <ViewCus
            // mt-10
            style={{
              height: '100%',
            }}>
            <ViewCus style={[BaseStyle.wrapperMain]}>
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
                    styleWrapperInput={{
                      marginBottom: 0,
                    }}
                    onBlur={() => {
                      if (fromLocation?.structured_formatting?.main_text) {
                        setFromLocation({
                          ...fromLocation,
                          address:
                            fromLocation?.structured_formatting?.main_text,
                        });
                      }
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
                  borderStyle: 'dashed',
                  borderLeftColor: Colors.main,
                }}
                ml-8
              />
              <ViewCus style={[BaseStyle.flexRowCenter]}>
                <ViewCus mr-8>
                  <Icon.IconLocationActive />
                </ViewCus>
                <ViewCus
                  style={{
                    flex: 1,
                  }}>
                  <TextInputs
                    ref={inputRef}
                    styleWrapperInput={{
                      marginBottom: 0,
                    }}
                    onBlur={() => {
                      if (toLocation?.structured_formatting?.main_text) {
                        setToLocation({
                          ...toLocation,
                          address: toLocation?.structured_formatting?.main_text,
                        });
                      }
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
              <BottomSheetFlatList
                data={address}
                keyExtractor={(item, i) => i.toString()}
                renderItem={renderItem}
              />
            </ViewCus>
          </ViewCus>
          <ViewCus
            style={[
              {
                position: 'absolute',
                bottom: 10,
                width: '100%',
                padding: 16,
              },
            ]}>
            <Buttons
              h-48
              round={false}
              style={[]}
              onPress={() => {
                const isValidFrom =
                  fromLocationFinal.address &&
                  fromLocationFinal.lat &&
                  fromLocationFinal.long;
                const isValidTo =
                  toLocationFinal.address &&
                  toLocationFinal.lat &&
                  toLocationFinal.long;
                console.log('===fromLocationFinal====', fromLocationFinal);
                console.log('===toLocationFinal====', toLocationFinal);
                if (isValidFrom && isValidTo) {
                  props.setStepView?.(
                    FindCarScreenStepView.CHOOSE_DELIVERY_OPTION,
                  );
                }
                changeFromToFinal();
              }}>
              <TextCus useI18n bold semiBold color={Colors.white}>
                Xác nhận điểm đón
              </TextCus>
            </Buttons>
          </ViewCus>
        </ViewCus>
      </BottomSheetView>
    </SafeAreaView>
  );
});

export default ChooseFromTo;
