import * as React from 'react';
import {
  ApolloClient,
  createNetworkInterface,
  ApolloProvider
} from 'react-apollo';
import Router from './features/router/Router';
import { configHolder } from './config';
import { StatusBar, View } from 'react-native';
import PlayerBar from './features/player/PlayerBar';

const client = new ApolloClient({
  networkInterface: createNetworkInterface({
    uri: 'http://192.168.1.40:4000/graphql'
  })
});

type State = {
  booted: boolean;
};

export default class App extends React.Component<{}, State> {
  state: State = {
    booted: false
  };

  async componentWillMount() {
    await configHolder.load();
    this.setState({ booted: true });
  }

  render() {
    if (!this.state.booted) return false;
    return (
      <ApolloProvider client={client}>
        <View style={{flex: 1}}>
          <StatusBar barStyle="light-content"/>
          <Router/>
          <PlayerBar/>
        </View>
      </ApolloProvider>
    );
  }
}