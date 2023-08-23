import React, { useEffect, useMemo, useState } from 'react';
import { Marker, PROVIDER_GOOGLE, Polyline } from 'react-native-maps';
import { useGeo, useLocation } from 'hooks';
import { MapViewCus } from 'components';
import Icon from 'assets/svg/Icon';
import { Platform } from 'react-native';
import { BaseStyle, Colors } from 'theme';
import { MarkerBiker, MarkerBikerRandom, MarkerRadar } from '../Components';
import { FindCarScreenStepView } from '../FindCar';
import { ILongLocation } from 'types';
import { usePrevious } from '@uidotdev/usehooks';
import { getGreatCircleBearing } from 'geolib';
import MapViewDirections from 'react-native-maps-directions';
import { GGAPI_KEY } from '@env';

export const FakeMapFind = ({
  startFind,
  type,
  fromToData,
  stepView,
  driverLocation,
}: {
  type?: 'car' | 'bike' | 'truck' | 'taxi' | 'hd';
  startFind?: boolean;
  stepView: FindCarScreenStepView;
  driverLocation: object;
  fromToData?: {
    from: {
      address?: string;
      lat: number;
      long: number;
    };
    to: {
      address?: string;
      lat: number;
      long: number;
    };
  };
}) => {
  const locationUser = useMemo(() => {
    if (
      fromToData &&
      fromToData.from &&
      fromToData.from.lat &&
      fromToData.from.long
    ) {
      return fromToData.from;
    }
    return null;
  }, [fromToData]);

  const { locationUser: locationInit } = useLocation();

  const [polylineData, setPolylineData] = useState([]);
  const prevertDriverLocation = usePrevious(driverLocation);
  const [rotationDriverIcon, setRotationDriverIcon] = useState(0);
  const GOOGLE_MAPS_API_KEY = GGAPI_KEY;
  useEffect(() => {
    let rs = 0;
    if (prevertDriverLocation && driverLocation) {
      rs = getGreatCircleBearing(
        {
          latitude: prevertDriverLocation.lat,
          longitude: prevertDriverLocation.long,
        },
        {
          latitude: driverLocation.lat,
          longitude: driverLocation.long,
        },
      );
    }
    if (rs !== 0) {
      setRotationDriverIcon(rs);
    }
  }, [driverLocation]);
  const renderListBikerRandom = useMemo(() => {
    if (
      ![
        FindCarScreenStepView.ON_PROCESS,
        FindCarScreenStepView.DRIVER_ARE_COMING,
        FindCarScreenStepView.ON_PROCESS,
        FindCarScreenStepView.ORDER_IS_CANCEL,
        FindCarScreenStepView.ORDER_IS_SUCCESS,
      ].includes(stepView)
    ) {
      return Array(10)
        .fill(1)
        .map((_, index) => {
          return (
            <MarkerBikerRandom
              key={index}
              latitude={(locationUser ?? locationInit).lat}
              longitude={(locationUser ?? locationInit).long}
              durationAnimation={Platform.OS === 'android' ? 2000 : 0}
              type={type}
            />
          );
        });
    }
    return <></>;
  }, [locationUser, type, stepView, locationInit]);

  const renderBikerLocation = useMemo(() => {
    if (
      polylineData.length > 0 &&
      ![
        FindCarScreenStepView.QUESTION_CHOOSE_FROM_TO,
        FindCarScreenStepView.CHOOSE_FROM_TO,
        FindCarScreenStepView.CHOOSE_DELIVERY_OPTION,
        FindCarScreenStepView.FIND_DRIVER,
      ].includes(stepView)
    ) {
      if (
        ![
          FindCarScreenStepView.QUESTION_CHOOSE_FROM_TO,
          FindCarScreenStepView.CHOOSE_FROM_TO,
          FindCarScreenStepView.CHOOSE_DELIVERY_OPTION,
          FindCarScreenStepView.FIND_DRIVER,
          FindCarScreenStepView.ORDER_IS_SUCCESS,
        ].includes(stepView)
      ) {
        return (
          <MarkerBiker
            latitude={polylineData[0].latitude}
            longitude={polylineData[0].longitude}
            type={type}
          />
        );
      } else {
        return (
          <MarkerBiker
            latitude={polylineData[polylineData.length - 1].latitude}
            longitude={polylineData[polylineData.length - 1].longitude}
            durationAnimation={1000}
            type={type}
          />
        );
      }
    }
    return <></>;
  }, [locationUser, type, polylineData, stepView, locationInit]);

  const renderDriverLocation = useMemo(() => {
    if (driverLocation?.lat && driverLocation?.long) {
      return (
        <MarkerBiker
          latitude={driverLocation?.lat}
          longitude={driverLocation?.long}
          durationAnimation={0}
          markerProps={{
            rotation: rotationDriverIcon,
            anchor: { x: 0.5, y: 0.5 },
          }}
        />
      );
    }

    // }
    // return <></>;
  }, [stepView, driverLocation, rotationDriverIcon]);
  return (
    <MapViewCus
      style={[BaseStyle.flex1]}
      provider={PROVIDER_GOOGLE}
      showsUserLocation={true}
      region={{
        latitude:
          stepView !== FindCarScreenStepView.ORDER_IS_SUCCESS && fromToData
            ? (locationUser ?? locationInit).lat
            : fromToData?.to?.lat,
        longitude:
          stepView !== FindCarScreenStepView.ORDER_IS_SUCCESS && fromToData
            ? (locationUser ?? locationInit).long
            : fromToData.to?.long,
        latitudeDelta: 0.0422,
        longitudeDelta: 0.0221,
      }}
      initialRegion={{
        latitude: locationInit.lat,
        longitude: locationInit.long,
        latitudeDelta: 0.0422,
        longitudeDelta: 0.0221,
      }}>
      {startFind && locationUser ? (
        <>
          <MarkerRadar
            latitude={locationUser.lat}
            longitude={locationUser.long}
          />
          <MarkerRadar
            latitude={locationUser.lat}
            longitude={locationUser.long}
            useAnimated={false}
          />
        </>
      ) : null}
      {/* {directionView} */}
      <MapViewDirections
        origin={{
          latitude: fromToData.from.lat,
          longitude: fromToData.from.long,
        }}
        destination={{
          latitude: fromToData.to.lat,
          longitude: fromToData.to.long,
        }}
        apikey={GOOGLE_MAPS_API_KEY}
        strokeWidth={5}
        strokeColor={Colors.stroke}
      />
      {renderListBikerRandom}
      {/* {renderBikerLocation} */}
      {renderDriverLocation}
      {locationUser ? (
        <Marker
          title={fromToData?.from?.address}
          description="Điểm đón"
          coordinate={{
            latitude: locationUser.lat,
            longitude: locationUser.long,
          }}>
          <Icon.SpotLight />
        </Marker>
      ) : null}
      {fromToData?.to?.lat &&
      fromToData?.to?.long &&
      fromToData?.to?.address ? (
        <Marker
          title={fromToData?.to?.address}
          description="Điểm đến"
          coordinate={{
            latitude: fromToData?.to?.lat,
            longitude: fromToData?.to?.long,
          }}>
          <Icon.SpotLightDestination />
        </Marker>
      ) : null}
    </MapViewCus>
  );
};
