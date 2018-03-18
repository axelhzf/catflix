import * as React from 'react';
import { TabNavigator, StackNavigator } from 'react-navigation';
import { Ionicons } from '@expo/vector-icons';
import Movies from '../movies/Movies';
import NowPlaying from '../NowPlaying/NowPlaying';
import Settings from '../settings/Settings';
import TvShow from '../tvshows/TvShow';
import TvShows from '../tvshows/TvShows';
import { colors } from '../../styleguide/colors';

const navigationOptions = {
  headerStyle: {
    backgroundColor: colors.headerBg,
    borderBottomWidth: 1,
    borderBottomColor: colors.border
  },
  headerTitleStyle: { color: colors.accent }
};

const MoviesNavigator = StackNavigator(
  {
    Movies: {
      screen: Movies
    }
  },
  { navigationOptions }
);

const TvShowsNavigator = StackNavigator(
  {
    TvShows: {
      screen: TvShows
    },
    TvShow: {
      screen: TvShow
    }
  },
  { navigationOptions }
);

const SettingsNavigator = StackNavigator(
  {
    Settings: {
      screen: Settings
    }
  },
  { navigationOptions }
);

const MainNavigator = TabNavigator(
  {
    Movies: {
      screen: MoviesNavigator
    },
    TvShows: {
      screen: TvShowsNavigator
    },
    Settings: {
      screen: SettingsNavigator
    }
  },
  {
    tabBarOptions: {
      activeBackgroundColor: colors.bg,
      inactiveBackgroundColor: colors.bg,
      activeTintColor: colors.accent,
      inactiveTintColor: 'gray'
    }
  }
);

const NowPlayingNavigator = StackNavigator({
  NowPlaying: {
    screen: NowPlaying
  }
}, { navigationOptions });

export const RootTabNavigator = StackNavigator(
  {
    Main: {
      screen: MainNavigator
    },
    NowPlaying: {
      screen: NowPlayingNavigator
    }
  },
  {
    mode: 'modal',
    headerMode: 'none',
  }
);
