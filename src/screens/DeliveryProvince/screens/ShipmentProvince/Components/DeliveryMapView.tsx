import React, { useEffect, useMemo, useState } from 'react';
import { PROVIDER_GOOGLE } from 'react-native-maps';
import { MapViewCus } from 'components';
import { Platform } from 'react-native';
import { BaseStyle, Colors } from 'theme';
import { MarkerBiker, MarkerBikerRandom } from '../Components';
import { ILongLocation, IRestaurant_OrderDetail } from 'types';
import { MarkerIcon, MarkerRadar } from 'components/MapViewCus';
import { ScreenStepView } from '../Shipment';
import { usePrevious } from '@uidotdev/usehooks';
import { getGreatCircleBearing } from 'geolib';
import MapViewDirections from 'react-native-maps-directions';
import { GGAPI_KEY } from '@env';
interface DeliveryMapViewProps {
  destination: ILongLocation;
  defaultNumberDriver: number;
  drivers: ILongLocation[];
  driverLocation?: ILongLocation;
  startFind?: boolean;
  pickup_location?: IRestaurant_OrderDetail;
  stepView: ScreenStepView;
}
export const DeliveryMapView = (props: DeliveryMapViewProps) => {
  const prevertDriverLocation = usePrevious(props.driverLocation);
  const [rotationDriverIcon, setRotationDriverIcon] = useState(0);
  useEffect(() => {
    let rs = 0;
    if (prevertDriverLocation && props.driverLocation) {
      rs = getGreatCircleBearing(
        {
          latitude: prevertDriverLocation.lat,
          longitude: prevertDriverLocation.long,
        },
        {
          latitude: props.driverLocation.lat,
          longitude: props.driverLocation.long,
        },
      );
    }
    if (rs !== 0) {
      setRotationDriverIcon(rs);
    }
  }, [props.driverLocation]);

  const renderListBiker = useMemo(() => {
    if (props.stepView < ScreenStepView.ON_PROCESS) {
      let fakeDriver: React.JSX.Element[] = [];
      const realDriver = props.drivers.map((driver, index) => {
        return (
          <MarkerBiker
            key={index}
            latitude={driver.lat}
            longitude={driver.long}
            durationAnimation={Platform.OS === 'android' ? 5000 : 0}
          />
        );
      });
      if (realDriver.length < props.defaultNumberDriver) {
        fakeDriver = Array(props.defaultNumberDriver - realDriver.length)
          .fill(1)
          .map((_, index) => {
            return (
              <MarkerBikerRandom
                key={index}
                latitude={props.destination.lat}
                longitude={props.destination.long}
                durationAnimation={Platform.OS === 'android' ? 5000 : 0}
              />
            );
          });
      }

      return (
        <>
          {realDriver}
          {fakeDriver}
        </>
      );
    }

    return <></>;
  }, [props.drivers, props.drivers, props.stepView]);

  const renderChooseDriver = useMemo(() => {
    if (
      props.driverLocation &&
      [
        ScreenStepView.DRIVER_ARE_COMING,
        ScreenStepView.ON_PROCESS,
        ScreenStepView.ORDER_IS_SUCCESS,
      ].includes(props.stepView)
    ) {
      return (
        <MarkerBiker
          markerProps={{
            rotation: rotationDriverIcon,
            anchor: { x: 0.5, y: 0.5 },
          }}
          latitude={props.driverLocation.lat}
          longitude={props.driverLocation.long}
          durationAnimation={0}
          timeAnimation={0}
        />
      );
    }
    return <></>;
  }, [props.stepView, props.driverLocation, rotationDriverIcon]);

  const renderStartLocation = useMemo(() => {
    if (props.pickup_location) {
      return (
        <MarkerIcon
          iconName="SpotLight"
          iconProps={{
            width: 27,
            height: 43,
          }}
          location={{
            lat: Number(props.pickup_location.lat),
            long: Number(props.pickup_location.long),
          }}
        />
      );
    }
    return <></>;
  }, [props.pickup_location]);

  if (!props.destination) {
    return <></>;
  }

  return (
    <MapViewCus
      style={[BaseStyle.flex1]}
      provider={PROVIDER_GOOGLE}
      showsUserLocation={false}
      initialRegion={{
        latitude: props.destination.lat,
        longitude: props.destination.long,
        latitudeDelta: 0.05,
        longitudeDelta: 0.05,
      }}
      region={{
        latitude: props.destination.lat,
        longitude: props.destination.long,
        latitudeDelta: 0.05,
        longitudeDelta: 0.05,
      }}>
      {props.startFind && (
        <>
          <MarkerRadar
            latitude={props.destination.lat}
            longitude={props.destination.long}
          />
          <MarkerRadar
            latitude={props.destination.lat}
            longitude={props.destination.long}
            useAnimated={false}
          />
        </>
      )}
      {props.driverLocation?.lat &&
        props.driverLocation?.long &&
        props.destination.lat &&
        props.destination.long && (
          <MapViewDirections
            origin={{
              latitude: props.driverLocation?.lat,
              longitude: props.driverLocation?.long,
            }}
            destination={{
              latitude: props.destination?.lat,
              longitude: props.destination?.long,
            }}
            apikey={GGAPI_KEY}
            strokeWidth={5}
            strokeColor={Colors.stroke}
          />
        )}

      {renderStartLocation}
      {renderListBiker}
      {renderChooseDriver}
      <MarkerIcon
        iconName="SpotLightDestination"
        location={props.destination}
        iconProps={{
          width: 42,
          height: 40,
          color: Colors.main,
        }}
      />
    </MapViewCus>
  );
};
