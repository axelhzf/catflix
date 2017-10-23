import * as React from 'react';
import { HeaderIcon } from './HeaderIcon';

export const ModalClose = ({ navigation }) => <HeaderIcon name="ios-close" onPress={() => navigation.goBack() }/>