import * as React from 'react';
import { ApolloProvider } from 'react-apollo';
import { InMemoryCache} from 'apollo-cache-inmemory';
import { HttpLink } from 'apollo-link-http';
import { RootTabNavigator } from './features/router/Router';
import { configHolder } from './config';
import { StatusBar, View } from 'react-native';
import { ApolloClient } from "apollo-client";

const client = new ApolloClient({
  link: new HttpLink({ uri: 'http://192.168.1.40:4000/graphql' }),
  cache: new InMemoryCache()
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
          <RootTabNavigator/>
        </View>
      </ApolloProvider>
    );
  }
}
