import React, { useImperativeHandle } from 'react';
import { TextInputs, ViewCus } from 'components';
// import { Colors } from 'theme';
import * as Yup from 'yup';

// import { StyleSheet } from 'react-native';
import { Controller, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';

interface IProps {
  fromToData: {
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
  receiverInfo: any;
}
interface IRefs {}
const EnterReceiver = React.forwardRef<IRefs, IProps>((props, ref) => {
  const {
    control,
    register,
    formState: { errors, isValid },
    getValues,
  } = useForm<{
    receiverHouseNumber?: string;
    receiverName: string;
    receiverPhone: string;
    driverNote?: string;
  }>({
    mode: 'all',
    reValidateMode: 'onSubmit',
    resolver: yupResolver(
      Yup.object().shape({
        receiverHouseNumber: Yup.string().notRequired(),
        receiverName: Yup.string()
          .min(3, 'Vui lòng nhập tên người nhận')
          .required('Vui lòng nhập tên người nhận'),
        receiverPhone: Yup.string()
          .min(10, 'SĐT ít nhất 10 ký tự')
          .required('Vui lòng nhập SĐT người nhận'),
        driverNote: Yup.string().notRequired(),
      }),
    ),
    defaultValues: {
      receiverHouseNumber: props?.receiverInfo?.receiverHouseNumber || '',
      receiverName: props?.receiverInfo?.receiverName || '',
      receiverPhone: props?.receiverInfo?.receiverPhone || '',
      driverNote: props?.receiverInfo?.driverNote || '',
    },
  });

  useImperativeHandle(ref, () => {
    return {
      isValid: () => {
        return isValid;
      },
      getValue: () => {
        return getValues();
      },
    };
  });

  return (
    <ViewCus px-16 pt-16>
      <TextInputs
        label="Địa chỉ"
        value={props.fromToData.to.address}
        isRequired
        disabled
        editable={false}
      />

      <Controller
        control={control}
        name="receiverHouseNumber"
        rules={{
          required: false,
        }}
        render={({ field: { onChange, onBlur, value } }) => {
          return (
            <TextInputs
              {...register('receiverHouseNumber')}
              label="Số nhà, số tòa nhà"
              onChangeText={onChange}
              onBlur={onBlur}
              value={value}
              placeholder="Số nhà, số tòa nhà"
              error={errors.receiverHouseNumber?.message}
            />
          );
        }}
      />
      <Controller
        control={control}
        name="receiverName"
        // rules={{
        //   required: true,
        // }}
        render={({ field: { onChange, onBlur, value } }) => (
          <TextInputs
            {...register('receiverName')}
            label="Tên người liên lạc"
            onChangeText={onChange}
            onBlur={onBlur}
            value={value}
            isRequired
            placeholder="Tên người liên lạc"
            error={errors.receiverName?.message}
            // keyboardType="phone-pad"
          />
        )}
      />
      <Controller
        control={control}
        name="receiverPhone"
        // rules={{
        //   required: true,
        // }}
        render={({ field: { onChange, onBlur, value } }) => (
          <TextInputs
            {...register('receiverPhone')}
            label="account.phone_number"
            onChangeText={onChange}
            onBlur={onBlur}
            isRequired
            value={value}
            placeholder="account.phone_number"
            error={errors.receiverPhone?.message}
            keyboardType="phone-pad"
          />
        )}
      />
      <Controller
        control={control}
        name="driverNote"
        rules={{
          required: false,
        }}
        render={({ field: { onChange, onBlur, value } }) => (
          <TextInputs
            {...register('driverNote')}
            label="Ghi chú cho tài xế"
            onChangeText={onChange}
            onBlur={onBlur}
            value={value}
            placeholder="Ghi chú cho tài xế"
            error={errors.driverNote?.message}
          />
        )}
      />
    </ViewCus>
  );
});

// const styles = StyleSheet.create({
//   selectedDelivery: {
//     backgroundColor: Colors.redFFa,
//     borderColor: Colors.redEB,
//     borderTopWidth: 0.5,
//     borderBottomWidth: 0.5,
//   },
// });

export default EnterReceiver;
