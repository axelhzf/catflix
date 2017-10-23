import * as React from 'react';
import { ChildProps, gql, graphql, compose } from 'react-apollo';
import {
  Dimensions,
  FlatList,
  Image, NavigationIOS,
  StyleSheet,
  Text,
  TouchableHighlight,
  View
} from 'react-native';
import { ShowsQuery } from '../../schema';
import TvShow from './TvShow'

type Props = {
  navigator: NavigationIOS
};

type Show = ShowsQuery['shows'][0];

const { width } = Dimensions.get('window');
const columns = 3;
const columnWidth = width / columns;

class TvShows extends React.Component<ChildProps<Props, ShowsQuery>> {
  handleSelectShow = async (show: Show) => {
    this.props.navigator.push({
      component: TvShow,
      passProps: { showId: show.id },
      title: show.title
    })
  };

  render() {
    if (this.props.data === undefined || this.props.data.loading) {
      return <Text>Loading</Text>;
    }
    if (this.props.data.error) {
      return <Text>Error {JSON.stringify(this.props.data.error)}</Text>;
    }
    const shows = this.props.data.shows;
    
    return (
      <FlatList
        style={styles.container}
        keyExtractor={item => item.id}
        data={shows}
        numColumns={columns}
        renderItem={({ item }: { item: Show }) => (
          <TouchableHighlight
            key={item.id}
            onPress={() => this.handleSelectShow(item)}
          >
            <View style={styles.cell}>
              <Image style={styles.image} source={{ uri: item.images.poster }} resizeMode="cover" />
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
    backgroundColor: '#fff',
    paddingTop: 64
  },
  cell: {
    width: columnWidth,
    height: 190,
    flexDirection: 'column',
    justifyContent: 'flex-start',
    borderBottomColor: '#ccc',
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
    query Shows {
      shows {
        id
        title
        images {
          poster
        }
      }
    }
  `)
);
export default enhance(TvShows);
