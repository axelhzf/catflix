import * as React from 'react';
import { MutationFunc } from 'react-apollo/types';
import { Text, View, StyleSheet, TouchableHighlight } from 'react-native';
import { NavigationInjectedProps } from 'react-navigation';
import { configHolder } from '../../config';
import { colors } from '../../styleguide/colors';
import { graphql, gql, compose, QueryProps } from 'react-apollo';
import {
  PlayerBarPauseMutationVariables,
  PlayerBarQuery,
  PlayerBarResumeMutationVariables,
  PlayerBarStopMutationVariables
} from '../../schema';
import { Ionicons } from '@expo/vector-icons';
import {
  PlayerBarResumeMutation,
  PlayerBarStopMutation,
  PlayerBarPauseMutation
} from '../../schema';

type Props = {
  status: QueryProps & PlayerBarQuery;
  resume: MutationFunc<
    PlayerBarResumeMutation,
    PlayerBarResumeMutationVariables
  >;
  pause: MutationFunc<PlayerBarPauseMutation, PlayerBarPauseMutationVariables>;
  stop: MutationFunc<PlayerBarStopMutation, PlayerBarStopMutationVariables>;
} & NavigationInjectedProps;

class NowPlaying extends React.Component<Props> {
  static navigationOptions = ({ navigation }) => ({
    title: 'Now Playing'
  });

  componentDidMount() {
    this.props.status.startPolling(1000);
  }

  render() {
    const status = this.props.status.status;
    const canPause =
      status &&
      status.server === 'PLAYING' &&
      (status.chromecast === 'PLAYING' || status.chromecast === 'BUFFERING');
    const canPlay =
      status && status.server === 'PLAYING' && status.chromecast === 'PAUSED';
    let config = configHolder.get();
    const progress = this.getProgress();
    return (
      <View style={styles.container}>
        <Text style={styles.status}>{this.getStatusText()}</Text>
        <Text style={styles.device}>{this.getDeviceName()}</Text>
        <Text style={styles.progress}>{this.getProgress()}</Text>
        <View style={styles.buttons}>
          {canPlay && (
            <TouchableHighlight
              style={{ paddingRight: 16, paddingLeft: 16 }}
              onPress={() =>
                this.props.resume({ variables: { device: config.device } })
              }
            >
              <Ionicons name="ios-play" size={64} color={colors.text} />
            </TouchableHighlight>
          )}
          {canPause && (
            <TouchableHighlight
              style={{ paddingRight: 16, paddingLeft: 16 }}
              onPress={() =>
                this.props.pause({ variables: { device: config.device } })
              }
            >
              <Ionicons name="ios-pause" size={64} color={colors.text} />
            </TouchableHighlight>
          )}
          <TouchableHighlight
            style={{ paddingRight: 16, paddingLeft: 16 }}
            onPress={this.handleClose}
          >
            <Ionicons name="ios-close" size={64} color={colors.text} />
          </TouchableHighlight>
        </View>
      </View>
    );
  }

  handleClose = async () => {
    //const config = configHolder.get();
    //await this.props.stop({ variables: { device: config.device } });
    this.props.navigation.goBack(null);
  };

  getDeviceName() {
    const { status } = this.props.status;
    if (!status) return 'No device connected';
    if (!status.device) return 'No device connected';
    return status.device;
  }

  getProgress() {
    const { status } = this.props.status;
    if (!status || !status.torrent) return;
    if (status.torrent.totalLength === 0) return;
    const currentPercentage =
      status.torrent.downloaded * 100 / status.torrent.totalLength;
    return `${currentPercentage.toFixed(2)}% ${(
      status.torrent.downloadSpeed / 1000
    ).toFixed(2)}Kb/s`;
  }

  getStatusText() {
    if (this.props.status.loading) return 'Loading...';
    if (this.props.status.error) return 'Error';

    const { status } = this.props.status;
    switch (status.server) {
      case 'IDLE':
        return 'Ready';
      case 'DOWNLOADING_TORRENT': {
        const currentPercentage =
          status.torrent.downloaded * 100 / status.torrent.totalLength;
        return `Downloading torrent`;
      }
      case 'DOWNLOADING_SUBTITLE':
        return 'Downloading subtitles...';
      case 'LAUNCHING_CHROMECAST':
        return 'Launching chromecast...';
      case 'ERROR':
        return 'Error';
      case 'PLAYING': {
        switch (this.props.status.status.chromecast) {
          case 'IDLE':
            return 'Waiting...';
          case 'BUFFERING':
            return 'Buffering...';
          case 'PLAYING':
            return 'Playing';
          case 'PAUSED':
            return 'Paused';
          default:
            return 'Unknown state';
        }
      }
    }
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.headerBg,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'column'
  },
  status: {
    color: colors.text,
    fontWeight: 'bold',
    fontSize: 24,
    marginBottom: 7
  },
  device: {
    color: colors.text,
    fontSize: 16,
    marginBottom: 7
  },
  progress: {
    color: colors.text,
    fontSize: 16,
    marginBottom: 7
  },
  buttons: {
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row'
  }
});

const enhance = compose(
  graphql(
    gql`
      query PlayerBar {
        status {
          server
          chromecast
          device
          torrent {
            downloadSpeed
            downloaded
            totalLength
          }
        }
      }
    `,
    { name: 'status' }
  ),
  graphql(
    gql`
      mutation PlayerBarResume($device: String!) {
        resume(device: $device)
      }
    `,
    { name: 'resume' }
  ),
  graphql(
    gql`
      mutation PlayerBarPause($device: String!) {
        pause(device: $device)
      }
    `,
    { name: 'pause' }
  ),
  graphql(
    gql`
      mutation PlayerBarStop($device: String!) {
        stop(device: $device)
      }
    `,
    { name: 'stop' }
  )
);

export default enhance(NowPlaying as any);
