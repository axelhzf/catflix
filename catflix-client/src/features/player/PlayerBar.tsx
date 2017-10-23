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
};

class PlayerBar extends React.Component<Props> {
  componentDidMount() {
    this.props.status.startPolling(1000);
  }

  render() {
    const canPause =
      this.props.status.status &&
      this.props.status.status.server === 'PLAYING' &&
      (this.props.status.status.chromecast === 'PLAYING' ||
        this.props.status.status.chromecast === 'BUFFERING');
    const canPlay =
      this.props.status.status &&
      this.props.status.status.server === 'PLAYING' &&
      this.props.status.status.chromecast === 'PAUSED';
    return (
      <View style={styles.container}>
        <View style={{ flex: 1 }}>
          <Text style={styles.device}>Device: MOCK Batcueva</Text>
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
      </View>
    );
  }

  getStatusText() {
    if (this.props.status.loading) return 'Loading...';
    if (this.props.status.error) return 'Error';
    if (this.props.status.status.server === 'IDLE') return 'Ready';
    switch (this.props.status.status.server) {
      case 'IDLE':
        return 'Ready';
      case 'DOWNLOADING_TORRENT':
        return 'Downloading torrent...';
      case 'DOWNLOADING_SUBTITLE':
        return 'Downloading subtitles...';
      case 'LAUNCHING_CHROMECAST':
        return 'Launching chromecast...';
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
  )
);

export default enhance(PlayerBar as any);
