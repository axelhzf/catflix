import * as React from 'react';
import { HeaderIcon } from './HeaderIcon';

export const BackButton = ({ navigation }) => (
  <HeaderIcon name="ios-arrow-back" onPress={() => navigation.goBack()} />
);
