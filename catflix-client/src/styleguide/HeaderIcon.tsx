import * as React from 'react';
import { TouchableHighlight, } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from './colors';

export const HeaderIcon = ({ name, onPress }) => (
  <TouchableHighlight style={{paddingRight: 16, paddingLeft: 16 }} onPress={onPress}>
    <Ionicons name={name} size={32} color={colors.text} />
  </TouchableHighlight>
);