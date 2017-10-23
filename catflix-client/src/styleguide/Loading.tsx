import * as React from 'react';
import { ActivityIndicator, View } from 'react-native';
import { colors } from './colors';

export const Loading = () => (
  <View
    style={{
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: colors.bg,
    }}
  >
    <ActivityIndicator color={colors.text} />
  </View>
);
