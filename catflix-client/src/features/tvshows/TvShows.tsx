import {Ionicons} from '@expo/vector-icons';
import * as React from 'react';
import {FlatList, StyleSheet, View} from 'react-native';
import {NavigationInjectedProps} from 'react-navigation';
import {ShowsQuery, ShowsQueryVariables} from '../../schema';
import {colors} from '../../styleguide/colors';
import {CoverCell} from '../../styleguide/CoverCell';
import {Error} from '../../styleguide/Error';
import {Loading} from '../../styleguide/Loading';
import TvShow from './TvShow';
import gql from 'graphql-tag';
import {Query} from 'react-apollo';
import {SearchInput} from "../../styleguide/SearchInput";
import {DebounceInput} from "../../styleguide/DebouncedInput";

type Props = NavigationInjectedProps;

type Show = ShowsQuery['shows'][0];

const columns = 3;

type State = {
  query: string
}

class ShowsQueryFetcher extends Query<ShowsQuery, ShowsQueryVariables> {
}

export default class TvShows extends React.Component<Props, State> {

  static navigationOptions = ({navigation}) => ({
    title: 'TV Shows',
    tabBarIcon: ({focused, tintColor}) => {
      return <Ionicons name="ios-desktop" size={25} color={tintColor}/>;
    }
  });

  state: State = {
    query: ''
  };

  handleSelectShow = async (show: Show) => {
    this.props.navigation.push('TvShow', {showId: show.id});
  };

  render() {
    return (
      <View style={{flex: 1}}>
        <SearchInput
          placeholder="Search..."
          value={this.state.query}
          onChangeText={value => this.setState({query: value})}
        />
        <DebounceInput value={this.state.query} timeout={150}>
          {(keywords, valid) => (
            <View style={{flex: 1}}>
              {!valid && <Loading/>}
              {valid && <ShowsQueryFetcher query={showsQuery} variables={{keywords}}>
                {({loading, error, data, refetch}) => {
                  if (loading) return <Loading/>;
                  if (error) {
                    return (
                      <Error message={error.message} onPressTryAgain={() => refetch().catch(() => null)}
                      />
                    );
                  }
                  return (
                    <FlatList
                      style={styles.container}
                      keyExtractor={item => item.id}
                      data={data.shows}
                      numColumns={columns}
                      renderItem={({item}: { item: Show }) => (
                        <CoverCell
                          title={item.title}
                          image={item.images.poster}
                          key={item.id}
                          onPress={() => this.handleSelectShow(item)}
                        />
                      )}
                    />
                  )
                }}
              </ShowsQueryFetcher>
              }
            </View>
          )}
        </DebounceInput>
      </View>
    );
  }
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.gray4
  }
});

const showsQuery = gql`
  query Shows($keywords: String) {
    shows(keywords: $keywords) {
      id
      title
      images {
        poster
      }
    }
  }
`;
