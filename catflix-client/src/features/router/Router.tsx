import * as React from 'react';
import Home from '../home/Home';
import { StackNavigator } from 'react-navigation';
import { colors } from '../../styleguide/colors';
import { View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Settings from '../settings/Settings';
import TvShow from '../tvshows/TvShow';


export default StackNavigator(
  {
    Home: {
      screen: Home
    },
    Settings: {
      screen: Settings,
    },
    TvShow: {
      screen: TvShow
    }
  },
  {
    mode: 'modal',
    navigationOptions: {
      headerStyle: {
        backgroundColor: colors.headerBg,
        borderBottomWidth: 1,
        borderBottomColor: colors.border
      },
      headerTitleStyle: { color: colors.accent }
    }
  }
);
