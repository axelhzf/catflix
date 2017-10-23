import * as React from 'react';
import { ChildProps, gql, graphql, compose } from 'react-apollo';
import {
  Dimensions,
  FlatList,
  Image, ScrollView,
  StyleSheet,
  Text,
  TouchableHighlight,
  View
} from 'react-native';
import { HomePlayMovieMutationVariables, HomeQuery } from '../../schema';
import { Loading } from '../../styleguide/Loading';
import { Error } from '../../styleguide/Error';
import { configHolder } from '../../config';
import { Ionicons } from '@expo/vector-icons';
import { HeaderIcon } from '../../styleguide/HeaderIcon';
import { colors } from '../../styleguide/colors';

type Props = {
  navigation: any,
  playMovie: (obj: {variables: HomePlayMovieMutationVariables}) => void,
};

type Movie = HomeQuery['movies'][0];
type Show = HomeQuery['shows'][0];

const { width } = Dimensions.get('window');
const columns = 3;
const columnWidth = width / columns;

class Home extends React.Component<ChildProps<Props, HomeQuery>> {
  static navigationOptions = ({ navigation }) => ({
    title: 'TORRENTFLIX',
    headerRight: <HeaderIcon name="ios-settings" onPress={() => navigation.navigate('Settings') }/>
  });

  handleSelectMovie = async (movie: Movie) => {
    let config = configHolder.get();
    const variables: HomePlayMovieMutationVariables = {
      id: movie.id,
      quality: config.quality,
      subtitleLang: config.subtitleLang,
      device: config.device
    };
    await this.props.playMovie({ variables });
  };

  handleSelectShow = (show: Show) => {
    this.props.navigation.navigate('TvShow', { showId: show.id})
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
    const shows = this.props.data.shows;
    return (
      <ScrollView style={styles.container}>
        <Text style={styles.sectionTitle}>Movies</Text>
        <FlatList
          style={styles.sectionContent}
          keyExtractor={item => item.id}
          data={movies}
          horizontal={true}
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
        <Text style={styles.sectionTitle}>TV Shows</Text>
        <FlatList
          style={styles.sectionContent}
          keyExtractor={item => item.id}
          data={shows}
          horizontal={true}
          renderItem={({ item }: { item: Show }) => (
            <TouchableHighlight
              key={item.id}
              onPress={() => this.handleSelectShow(item)}
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
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bg
  },
  sectionTitle: {
    fontWeight: 'bold',
    color: colors.text,
    paddingLeft: 8,
    paddingTop: 16,
    paddingBottom: 16
  },
  sectionContent: {
    backgroundColor: colors.black
  },
  cell: {
    width: columnWidth,
    height: 190,
    flexDirection: 'column',
    justifyContent: 'flex-start',
    borderBottomColor: '#ccc',
    paddingTop: 5,
    paddingLeft: 5,
    paddingRight: 5
  },
  image: {
    width: columnWidth - 10,
    height: 150
  },
  titleContainer: {
    height: 40,
    justifyContent: 'center',
    backgroundColor: colors.black
  },
  title: {
    fontSize: 12,
    color: colors.text
  }
});

const enhance = compose(
  graphql(gql`
    query Home {
      movies {
        id
        title
        images {
          poster
        }
      }
      shows {
        id
        title
        images {
          poster
        }
      }
    }
  `)
  ,
  graphql(gql`
    mutation HomePlayMovie($id: String!, $quality: String, $subtitleLang: String, $device: String) {
      playMovie(id: $id, quality: $quality, subtitleLang: $subtitleLang, device: $device)
    }
  `, { name: 'playMovie'})
);
export default enhance(Home);
