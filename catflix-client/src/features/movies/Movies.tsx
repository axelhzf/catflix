import * as React from 'react';
import {
  Dimensions,
  FlatList,
  StyleSheet,
  View
} from 'react-native';
import {NavigationInjectedProps} from 'react-navigation';
import {MoviesQuery, MoviesQueryVariables, playMovieMutation, playMovieMutationVariables} from '../../schema';
import {configHolder} from '../../config';
import {Ionicons} from '@expo/vector-icons';
import {colors} from '../../styleguide/colors';
import {CoverCell} from '../../styleguide/CoverCell';
import {Loading} from '../../styleguide/Loading';
import {Error} from '../../styleguide/Error';
import gql from 'graphql-tag';
import {Query, Mutation} from 'react-apollo';
import {SearchInput} from "../../styleguide/SearchInput";
import {DebounceInput} from "../../styleguide/DebouncedInput";

type Props = NavigationInjectedProps;

type Movie = MoviesQuery['movies'][0];

const {width} = Dimensions.get('window');
const columns = 3;
const columnWidth = width / columns;


class MoviesQueryFetcher extends Query<MoviesQuery, MoviesQueryVariables> {
}

type State = {
  query: string
}

export default class Movies extends React.Component<Props, State> {

  static navigationOptions = ({navigation}) => ({
    title: 'Movies',
    tabBarIcon: ({focused, tintColor}) => {
      return <Ionicons name='ios-film' size={25} color={tintColor}/>;
    }
  });

  state: State = {
    query: ''
  };

  render() {
    return (
      <Mutation mutation={playMovieMutation}>
        {playMovie => (
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
                  {valid && <MoviesQueryFetcher query={moviesQuery} variables={{keywords}}>
                    {({loading, error, data, refetch}) => {
                      if (loading) return <Loading/>;
                      if (error) return <Error message={error.message}
                                               onPressTryAgain={() => refetch().catch(() => null)}/>;
                      return (
                        <FlatList
                          style={styles.container}
                          keyExtractor={item => item.id}
                          data={data.movies}
                          numColumns={columns}
                          renderItem={({item}: { item: Movie }) => (
                            <CoverCell
                              title={item.title}
                              image={item.images.poster}
                              key={item.id}
                              onPress={async () => {
                                let config = configHolder.get();
                                const variables: playMovieMutationVariables = {
                                  id: item.id,
                                  quality: config.quality,
                                  subtitleLang: config.subtitleLang,
                                  device: config.device
                                };
                                await playMovie({ variables });
                                this.props.navigation.navigate('NowPlaying');
                              }}
                            />
                          )}
                        />
                      )
                    }}
                  </MoviesQueryFetcher>
                  }
                </View>
              )}
            </DebounceInput>
          </View>
        )}
      </Mutation>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.gray4
  },
  cell: {
    width: columnWidth,
    height: 190,
    flexDirection: 'column',
    justifyContent: 'flex-start',
    borderBottomColor: '#ccc'
  },
  image: {
    width: columnWidth,
    height: 150
  },
  titleContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    height: 40
  },
  title: {
    fontSize: 12,
    color: colors.text,
    textAlign: 'center'
  }
});

const moviesQuery = gql`
  query Movies($keywords: String) {
    movies(keywords: $keywords) {
      id
      title
      synopsis
      images {
        banner
        fanart
        poster
      }
    }
  }
`;

const playMovieMutation = gql`
  mutation playMovie($id: String!, $quality: String, $subtitleLang: String, $device: String!) {
    playMovie(id: $id, quality: $quality, subtitleLang: $subtitleLang, device: $device)
  }
`;
