import * as _ from 'lodash';
import * as React from 'react';
import { ChildProps, compose, gql, graphql } from 'react-apollo';
import {
  FlatList,
  StyleSheet,
  Text,
  TouchableHighlight,
  View
} from 'react-native';
import { playEpisodeMutationVariables, ShowQuery } from '../../schema';
import { configHolder } from '../../config';
import { ModalClose } from '../../styleguide/ModalClose';
import { Loading } from '../../styleguide/Loading';
import { Error } from '../../styleguide/Error';
import { colors } from '../../styleguide/colors';

type Props = {
  navigation: any;
  showId: string;
};

type Show = ShowQuery['show'];
type Episode = Show['episodes'][0];

class TvShow extends React.Component<ChildProps<Props, ShowQuery>> {

  static navigationOptions = ({ navigation, data }) => ({
    title: 'Tv Show',
    headerLeft: null,
    headerRight: <ModalClose navigation={navigation} />
  });

  handleSelectEpisode = async (show: Show, episode: Episode) => {
    const config = configHolder.get();
    const variables: playEpisodeMutationVariables = {
      showId: show.id,
      season: episode.season,
      episode: episode.episode,
      quality: config.quality,
      subtitleLang: config.subtitleLang,
      device: config.device
    };
    await this.props.mutate({ variables });
  };

  getEpisodeId(episode: Episode) {
    return (
      'S' +
      _.padStart(episode.season.toString(), 2, '0') +
      'E' +
      _.padStart(episode.episode.toString(), 2, '0')
    );
  }

  render() {
    if (this.props.data.loading) return <Loading />;
    if (this.props.data.error)
      return (
        <Error
          message={this.props.data.error.message}
          onPressTryAgain={() => this.props.data.refetch().catch(() => null)}
        />
      );
    const show = this.props.data.show;
    let sortedEpisodes = _.sortBy(show.episodes, ['season', 'episode']);
    sortedEpisodes = _.reverse(sortedEpisodes);

    return (
      <FlatList
        style={styles.container}
        keyExtractor={item => item.id}
        data={sortedEpisodes}
        renderItem={({ item: episode }: { item: Episode }) => (
          <TouchableHighlight
            key={this.getEpisodeId(episode)}
            onPress={() => this.handleSelectEpisode(show, episode)}
          >
            <View style={styles.cell}>
              <Text style={styles.title}>
                {this.getEpisodeId(episode)} - {episode.title}
              </Text>
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
    backgroundColor: colors.bg
  },
  cell: {
    height: 48,
    flexDirection: 'column',
    justifyContent: 'center',
    borderBottomColor: colors.border,
    borderBottomWidth: 1,
    paddingLeft: 5
  },
  title: {
    color: colors.text
  }
});

const showQuery = gql`
  query Show($showId: String!) {
    show(id: $showId) {
      id
      title
      episodes {
        id
        title
        season
        episode
        torrents {
          quality
          url
        }
      }
    }
  }
`;

const enhance = compose(
  graphql(showQuery, {
    options: (props: Props) => {
      return {
        variables: {showId: props.navigation.state.params.showId}
      }
    }
  }),
  graphql(gql`
    mutation playEpisode(
      $showId: String!
      $season: Int!
      $episode: Int!
      $quality: String
      $subtitleLang: String
      $device: String!
    ) {
      playEpisode(
        showId: $showId
        season: $season
        episode: $episode
        quality: $quality
        subtitleLang: $subtitleLang
        device: $device
      )
    }
  `)
);
export default enhance(TvShow);
