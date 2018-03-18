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
import { MoviesQuery, playMovieMutationVariables } from '../../schema';
import { configHolder } from '../../config';

type Props = {};

type Movie = MoviesQuery['movies'][0];

const { width } = Dimensions.get('window');
const columns = 3;
const columnWidth = width / columns;

class Movies extends React.Component<ChildProps<Props, MoviesQuery>> {
  handleSelectMovie = async (movie: Movie) => {
    let config = configHolder.get();
    const variables: playMovieMutationVariables = {
      id: movie.id,
      quality: config.quality,
      subtitleLang: config.subtitleLang,
      device: config.device
    };
    await this.props.mutate({ variables });
  };

  render() {
    if (this.props.data === undefined || this.props.data.loading) {
      return <Text>Loading</Text>;
    }
    if (this.props.data.error) {
      return <Text>Error {JSON.stringify(this.props.data.error)}</Text>;
    }
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
              <Text style={styles.title}>{item.title}</Text>
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
    backgroundColor: '#191919',
    paddingTop: 64
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
  title: {
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
