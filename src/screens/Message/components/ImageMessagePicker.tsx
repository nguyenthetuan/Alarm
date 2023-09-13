import { TouchCus, ViewCus, TextCus } from 'components';
import React, { useCallback } from 'react';
import { InteractionManager, StyleSheet } from 'react-native';
import ImagePicker, { Image, Options } from 'react-native-image-crop-picker';
import { Colors } from 'theme';
import { dimensions, uploadImage } from 'utils';
import { BottomSheetCommon } from 'components/BottomSheetModals';
const { width } = dimensions;
const UploadImageConfig: Options = {
  width: width,
  height: width,
  cropping: false,
  includeBase64: false,
  multiple: false,
};
interface IProps {
  refModal: any;
  onChangePicture: (image: any) => void;
}
const ImageMessagePicker: React.FC<IProps> = ({
  refModal,
  onChangePicture,
}) => {
  const onOpenCamera = useCallback(() => {
    refModal.current?.close();
    InteractionManager.runAfterInteractions(() => {
      ImagePicker.openCamera({
        ...UploadImageConfig,
        mediaType: 'photo',
      }).then(image => {
        const infoImage = uploadImage(image as Image);
        onChangePicture(infoImage);
      });
    });
  }, [onChangePicture]);
  const onOpenLibary = useCallback(() => {
    refModal.current?.close();
    InteractionManager.runAfterInteractions(() => {
      ImagePicker.openPicker(UploadImageConfig).then(image => {
        const infoImage = uploadImage(image as Image);
        onChangePicture(infoImage);
      });
    });
  }, [onChangePicture]);

  return (
    <>
      <BottomSheetCommon
        ref={refModal}
        pressBehavior={'close'}
        hideBackdrop={false}>
        <ViewCus style={[styles.contaner]}>
          <TextCus textAlign="center" heading4>
            Chọn loại upload hình ảnh
          </TextCus>
          <ViewCus style={styles.content}>
            <TouchCus
              style={styles.btnImagePicker}
              onPress={onOpenCamera}
              activeOpacity={0.8}>
              <TextCus bold>Chụp ảnh</TextCus>
            </TouchCus>
            <TouchCus
              style={styles.btnImagePicker}
              onPress={onOpenLibary}
              activeOpacity={0.8}>
              <TextCus bold>Thư viện</TextCus>
            </TouchCus>
          </ViewCus>
        </ViewCus>
      </BottomSheetCommon>
    </>
  );
};
const styles = StyleSheet.create({
  wrapTitle: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: Colors.disable,
  },
  cenItemvh: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  wrapLogo: {
    alignItems: 'center',
    marginVertical: 20,
  },
  posBtnTitle: {
    bottom: 5,
    right: 5,
    position: 'absolute',
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: Colors.main,
    borderWidth: 1,
    borderColor: Colors.white,
  },
  contaner: {
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
  },
  content: {
    paddingHorizontal: 16,
  },
  btnImagePicker: {
    paddingVertical: 5,
    borderBottomWidth: 1,
    borderBottomColor: Colors.white,
  },
});
export default ImageMessagePicker;
