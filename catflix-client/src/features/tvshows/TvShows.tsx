import { Ionicons } from '@expo/vector-icons';
import * as React from 'react';
import { ChildProps, compose, gql, graphql } from 'react-apollo';
import { FlatList, StyleSheet } from 'react-native';
import { NavigationInjectedProps } from 'react-navigation';
import { ShowsQuery } from '../../schema';
import { colors } from '../../styleguide/colors';
import { CoverCell } from '../../styleguide/CoverCell';
import { Error } from '../../styleguide/Error';
import { Loading } from '../../styleguide/Loading';
import TvShow from './TvShow';

type Props = NavigationInjectedProps;

type Show = ShowsQuery['shows'][0];

const columns = 3;

class TvShows extends React.Component<ChildProps<Props, ShowsQuery>> {
  static navigationOptions = ({ navigation }) => ({
    title: 'TV Shows',
    tabBarIcon: ({ focused, tintColor }) => {
      return <Ionicons name="ios-desktop" size={25} color={tintColor} />;
    }
  });

  handleSelectShow = async (show: Show) => {
    this.props.navigation.push('TvShow', { showId: show.id });
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
    const shows = this.props.data.shows;

    return (
      <FlatList
        style={styles.container}
        keyExtractor={item => item.id}
        data={shows}
        numColumns={columns}
        renderItem={({ item }: { item: Show }) => (
          <CoverCell
            title={item.title}
            image={item.images.poster}
            key={item.id}
            onPress={() => this.handleSelectShow(item)}
          />
        )}
      />
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.gray4
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
