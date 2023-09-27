import { Images } from 'assets';
import Icon from 'assets/svg/Icon';
import { ImageCus, TextCus, TouchCus, ViewCus } from 'components';
import React, { useMemo } from 'react';
import { StyleSheet } from 'react-native';
import { BaseStyle, Colors } from 'theme';
import {
  ACTIVITY_TYPE,
  IListOrderItem,
  getStatusColor,
  getStatusName,
} from 'types';
import { formatMoney, formatTimeDMY, getImage } from 'utils';

interface IProps {
  data: IListOrderItem;
  onPress: () => void;
}

const ActivityItem2: React.FC<IProps> = props => {
  const { statusName, color } = useMemo(() => {
    return {
      statusName: getStatusName(props.data.status),
      color: getStatusColor(props.data.status),
    };
  }, [props.data]);
  const { iconColor } = useMemo(() => {
    return {
      TypeIcon: Icon[ACTIVITY_TYPE.drink.icon],
      iconColor: getStatusColor(props.data.status),
    };
  }, [props.data]);
  const imageShow = useMemo(() => {
    let rs = Images.food1;
    if (props.data.foods?.[0]?.image) {
      rs = getImage({ image: props.data.foods?.[0]?.image });
    }

    return rs;
  }, [props.data]);
  if (props.type === 'FOOD') {
    return (
      <TouchCus style={styles.container} onPress={props.onPress}>
        <ViewCus flex-row>
          <ViewCus
            h-44
            w-44
            br-22
            style={[{ backgroundColor: iconColor }, styles.wrapperIcon]}>
            {/* <TypeIcon /> */}
            <ImageCus h-12 w-12 source={imageShow} />
          </ViewCus>
          <ViewCus style={[BaseStyle.flexShrink1]}>
            <TextCus bold color-black3A>
              {props.data.foods[0]?.food_name} - {props.data.restaurant.name}
            </TextCus>
            <TextCus color-grey85>
              {formatTimeDMY(props.data.createdAt)}
            </TextCus>
          </ViewCus>
        </ViewCus>
        <ViewCus style={styles.line} />
        <ViewCus flex-row justify-space-between items-center>
          <TextCus color={color} medium>
            {statusName}
          </TextCus>
          <TextCus medium>{formatMoney(props.data.total_price)}</TextCus>
        </ViewCus>
      </TouchCus>
    );
  } else {
    //lịch sử cuốc xe
    return (
      <TouchCus style={styles.container} onPress={props.onPress}>
        <ViewCus flex-row>
          <ViewCus style={[BaseStyle.flexShrink1]}>
            <ViewCus flex-row items-center>
              <Icon.CurrentLocation />
              <TextCus ml-5 numberOfLines={1}>
                {props.data?.pickup_location?.address}
              </TextCus>
            </ViewCus>

            <ViewCus mt-10 flex-row items-center>
              <Icon.IconLocationActive />
              <TextCus ml-5 numberOfLines={1}>
                {props.data?.dropoff_location?.address}
              </TextCus>
            </ViewCus>

            <TextCus bold color-black3A>
              {/* {props.data.foods[0]?.food_name} - {props.data.restaurant.name} */}
            </TextCus>
            <TextCus color-grey85>
              {formatTimeDMY(props.data.createdAt)}
            </TextCus>
          </ViewCus>
        </ViewCus>
        <ViewCus style={styles.line} />
        <ViewCus flex-row justify-space-between items-center>
          <TextCus color={color} medium>
            {props.type !== 'DELIVERY_NATIONWIDE' && statusName}
          </TextCus>
          <TextCus medium>{formatMoney(props.data.price)}</TextCus>
        </ViewCus>
      </TouchCus>
    );
  }
};
const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.greyF8,
    borderRadius: 8,
    marginBottom: 12,
    padding: 12,
  },
  line: {
    marginTop: 8,
    marginBottom: 12,
    borderWidth: 0.5,
    borderColor: Colors.greyAD,
    borderStyle: 'dashed',
  },
  wrapperIcon: {
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
  },
});
export default ActivityItem2;
