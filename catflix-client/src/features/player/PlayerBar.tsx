import * as React from 'react';
import { Text, View, StyleSheet, TouchableHighlight } from 'react-native';
import { colors } from '../../styleguide/colors';
import { graphql, gql, compose, QueryProps } from 'react-apollo';
import { PlayerBarQuery } from '../../schema';
import { Ionicons } from '@expo/vector-icons';

type Props = {
  status: QueryProps & PlayerBarQuery;
  resume: () => void;
  pause: () => void;
  stop: () => void;
};

class PlayerBar extends React.Component<Props> {
  componentDidMount() {
    this.props.status.startPolling(1000);
  }

  render() {
    const status = this.props.status.status;
    const canPause =
      status &&
      status.server === 'PLAYING' && (status.chromecast === 'PLAYING' || status.chromecast === 'BUFFERING');
    const canPlay = status && status.server === 'PLAYING' && status.chromecast === 'PAUSED';
    return (
      <View style={styles.container}>
        <View style={{ flex: 1 }}>
          <Text style={styles.device}>{this.getDeviceName()} - {this.getProgress()}</Text>
          <Text style={styles.status}>{this.getStatusText()}</Text>
        </View>
        {canPlay && (
          <TouchableHighlight style={{ paddingRight: 16, paddingLeft: 16 }} onPress={() => this.props.resume()}>
            <Ionicons name="ios-play" size={32} color={colors.text} />
          </TouchableHighlight>
        )}
        {canPause && (
          <TouchableHighlight style={{ paddingRight: 16, paddingLeft: 16 }} onPress={() => this.props.pause()}>
            <Ionicons name="ios-pause" size={32} color={colors.text} />
          </TouchableHighlight>
        )}
        <TouchableHighlight style={{ paddingRight: 16, paddingLeft: 16 }} onPress={() => this.props.stop()}>
          <Ionicons name="ios-close" size={32} color={colors.text} />
        </TouchableHighlight>
      </View>
    );
  }

  getDeviceName() {
    const { status } = this.props.status;
    if (!status) return "No device connected";
    if (!status.device) return "No device connected";
    return status.device;
  }

  getProgress() {
    const { status } = this.props.status;
    if (!status) return "";
    const currentPercentage = (status.torrent.downloaded * 100 / status.torrent.totalLength);
    return `${currentPercentage.toFixed(2)}% ${(status.torrent.downloadSpeed / 1000).toFixed(2)}Kb/s`;
  }

  getStatusText() {
    if (this.props.status.loading) return 'Loading...';
    if (this.props.status.error) return 'Error';

    const { status } = this.props.status;
    switch (status.server) {
      case 'IDLE':
        return 'Ready';
      case 'DOWNLOADING_TORRENT': {
        const currentPercentage = (status.torrent.downloaded * 100 / status.torrent.totalLength);
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
    height: 55,
    backgroundColor: colors.headerBg,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
    paddingLeft: 8,
    paddingRight: 8,
    flexDirection: 'row'
  },
  status: {
    color: colors.text,
    fontWeight: 'bold'
  },
  device: {
    color: colors.text,
    fontSize: 12
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
      mutation PlayerBarResume {
        resume
      }
    `,
    { name: 'resume' }
  ),
  graphql(
    gql`
      mutation PlayerBarPause {
        pause
      }
    `,
    { name: 'pause' }
  ),
  graphql(
    gql`
      mutation PlayerBarStop {
        stop
      }
    `,
    { name: 'stop' }
  )
);

export default enhance(PlayerBar as any);
