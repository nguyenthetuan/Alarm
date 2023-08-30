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
}
interface IRefs {}
const EnterReceiver = React.forwardRef<IRefs, IProps>((props, ref) => {
  //#region Static
  //#endregion

  //#region State
  const {
    control,
    register,
    formState: { errors, isValid },
    getValues,
  } = useForm<{
    addressDetail?: string;
    name: string;
    phone: string;
    note?: string;
  }>({
    mode: 'all',
    reValidateMode: 'onSubmit',
    resolver: yupResolver(
      Yup.object().shape({
        addressDetail: Yup.string().notRequired(),
        name: Yup.string()
          .min(3, 'Vui lòng nhập tên người nhận')
          .required('Vui lòng nhập tên người nhận'),
        phone: Yup.string()
          .min(10, 'SĐT ít nhất 10 ký tự')
          .required('Vui lòng nhập SĐT người nhận'),
        note: Yup.string().notRequired(),
      }),
    ),
    defaultValues: {
      addressDetail: '',
      name: '',
      phone: '',
      note: '',
    },
  });
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
  //#endregion

  //#region Export func
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
  //#endregion
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
        name="addressDetail"
        rules={{
          required: false,
        }}
        render={({ field: { onChange, onBlur, value } }) => {
          return (
            <TextInputs
              {...register('addressDetail')}
              label="Số nhà, số tòa nhà"
              onChangeText={onChange}
              onBlur={onBlur}
              value={value}
              placeholder="account.enter_username"
              error={errors.addressDetail?.message}
            />
          );
        }}
      />
      <Controller
        control={control}
        name="name"
        // rules={{
        //   required: true,
        // }}
        render={({ field: { onChange, onBlur, value } }) => (
          <TextInputs
            {...register('name')}
            label="Tên người liên lạc"
            onChangeText={onChange}
            onBlur={onBlur}
            value={value}
            isRequired
            placeholder="account.phone_number_input"
            error={errors.name?.message}
            // keyboardType="phone-pad"
          />
        )}
      />
      <Controller
        control={control}
        name="phone"
        // rules={{
        //   required: true,
        // }}
        render={({ field: { onChange, onBlur, value } }) => (
          <TextInputs
            {...register('phone')}
            label="account.phone_number"
            onChangeText={onChange}
            onBlur={onBlur}
            isRequired
            value={value}
            placeholder="account.phone_number"
            error={errors.phone?.message}
            keyboardType="phone-pad"
          />
        )}
      />
      <Controller
        control={control}
        name="note"
        rules={{
          required: false,
        }}
        render={({ field: { onChange, onBlur, value } }) => (
          <TextInputs
            {...register('note')}
            label="Ghi chú cho tài xế"
            onChangeText={onChange}
            onBlur={onBlur}
            value={value}
            placeholder="Ghi chú cho tài xế"
            error={errors.note?.message}
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
