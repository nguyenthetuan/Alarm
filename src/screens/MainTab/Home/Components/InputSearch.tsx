import { IconName } from 'assets';
import { TextInputs, ViewCus } from 'components';
import { NavigationService, Routes } from 'navigation';
import React from 'react';
import { Colors } from 'theme';
import { styleSpacing } from 'utils';

interface IProps {}

const InputSearch: React.FC<IProps> = props => {
  return (
    <ViewCus px-16>
      <TextInputs
        rightIcon=""
        leftIcon={IconName.Search}
        styleInput={[styleSpacing('px-8')]}
        style={[
          {
            height: 56,
            borderRadius: 16,
            paddingHorizontal: 12,
            backgroundColor: Colors.white,
            shadowColor: Colors.black3A,
            shadowOffset: {
              width: 0,
              height: 2,
            },
            shadowRadius: 8,
            shadowOpacity: 0.12,
            elevation: 8,
          },
        ]}
        placeholder="search"
        onChangeText={text => props.onPress(text)}
        onSubmitEditing={({ nativeEvent: { text } }) =>
          NavigationService.navigate(Routes.Categories, {
            searchText: text,
          })
        }
        value={props.value}
      />
      <ViewCus style={{ position: 'absolute', right: 25, top: 12 }}>
        {props.renderRight()}
      </ViewCus>
    </ViewCus>
  );
};

export default InputSearch;
