import * as React from 'react';
import { ChildProps, gql, graphql, compose } from 'react-apollo';
import {
  Dimensions,
  FlatList,
  Image,
  StyleSheet,
  Text,
  TouchableHighlight,
  View
} from 'react-native';
import { NavigationInjectedProps } from 'react-navigation';
import { MoviesQuery, playMovieMutationVariables } from '../../schema';
import { configHolder } from '../../config';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../styleguide/colors';
import { Loading } from '../../styleguide/Loading';
import { Error } from '../../styleguide/Error';

type Props = NavigationInjectedProps;

type Movie = MoviesQuery['movies'][0];

const { width } = Dimensions.get('window');
const columns = 3;
const columnWidth = width / columns;

class Movies extends React.Component<ChildProps<Props, MoviesQuery>> {

  static navigationOptions = ({ navigation }) => ({
    title: 'Movies',
    tabBarIcon: ({ focused, tintColor }) => {
      return <Ionicons name='ios-film' size={25} color={tintColor}/>;
    }
  });

  handleSelectMovie = async (movie: Movie) => {
    /*
    let config = configHolder.get();
    const variables: playMovieMutationVariables = {
      id: movie.id,
      quality: config.quality,
      subtitleLang: config.subtitleLang,
      device: config.device
    };
    await this.props.mutate({ variables });
    */
    this.props.navigation.navigate('NowPlaying');
  };

  render() {
    if (this.props.data.loading) return <Loading />;
    if (this.props.data.error)
      return (
        <Error
          message={this.props.data.error.message}
          onPressTryAgain={() => this.props.data.refetch().catch(() => null)}
        />
      );

    const movies = this.props.data.movies;
    return (
      <FlatList
        style={styles.container}
        keyExtractor={item => item.id}
        data={movies}
        numColumns={columns}
        renderItem={({ item }: { item: Movie }) => (
          <TouchableHighlight
            key={item.id}
            onPress={() => this.handleSelectMovie(item)}
          >
            <View style={styles.cell}>
              <Image
                style={styles.image}
                source={{ uri: item.images.poster }}
                resizeMode="cover"
              />
              <View style={styles.titleContainer}>
                <Text style={styles.title}>{item.title}</Text>
              </View>
            </View>
          </TouchableHighlight>
        )}
      />
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

const enhance = compose(
  graphql(gql`
    query Movies {
      movies {
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
  `),
  graphql(gql`
    mutation playMovie($id: String!, $quality: String, $subtitleLang: String, $device: String!) {
      playMovie(id: $id, quality: $quality, subtitleLang: $subtitleLang, device: $device)
    }
  `)
);
export default enhance(Movies);
