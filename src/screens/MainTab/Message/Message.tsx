import { HomeLayout } from 'components';
import React from 'react';
import { Colors } from 'theme';

const Message = () => {
  return (
    <HomeLayout
      bgColor={Colors.main}
      header={{
        notGoBack: true,
        title: 'bottom.message',
        iconColor: Colors.white,
      }}
    />
  );
};

export default Message;
