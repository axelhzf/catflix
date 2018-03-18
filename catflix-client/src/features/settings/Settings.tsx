import * as React from 'react';
import {
  Text,
  View,
  Button,
  TouchableHighlight,
  StyleSheet,
  ScrollView
} from 'react-native';
import { NavigationInjectedProps } from 'react-navigation';
import { Config, configHolder } from '../../config';
import { Ionicons } from '@expo/vector-icons';
import { compose } from 'redux';
import { graphql, gql, QueryProps } from 'react-apollo';
import { DevicesQuery } from '../../schema';
import { ModalClose } from '../../styleguide/ModalClose';

type Props = {
  devices: QueryProps & DevicesQuery;
} & NavigationInjectedProps;
type State = Config;

export class Settings extends React.Component<Props, State> {

  static navigationOptions = ({ navigation }) => ({
    title: 'Settings',
    tabBarIcon: ({ focused, tintColor }) => {
      return <Ionicons name='ios-cog' size={25} color={tintColor}/>;
    }
  });

  state = configHolder.get();

  componentDidUpdate() {
    configHolder.set(this.state);
  }

  componentDidMount() {
    this.props.navigation.addListener('willFocus', () => {
      this.props.devices.startPolling(5000);
    });
    this.props.navigation.addListener('willBlur', () => {
      this.props.devices.stopPolling();
    });
  }

  componentWillUnmount() {
    console.log('unmount settings');
  }

  render() {
    return (
      <ScrollView style={styles.container}>
        <Section title="Quality" />
        <Row
          title="Auto"
          selected={this.state.quality === null}
          onPress={() => this.setState({ quality: null })}
        />
        <Row
          title="1080p"
          selected={this.state.quality === '1080p'}
          onPress={() => this.setState({ quality: '1080p' })}
        />
        <Row
          title="720p"
          selected={this.state.quality === '720p'}
          onPress={() => this.setState({ quality: '720p' })}
        />

        <Section title="Subtitles" />
        <Row
          title="None"
          selected={this.state.subtitleLang === null}
          onPress={() => this.setState({ subtitleLang: null })}
        />
        <Row
          title="English"
          selected={this.state.subtitleLang === 'eng'}
          onPress={() => this.setState({ subtitleLang: 'eng' })}
        />
        <Row
          title="Español"
          selected={this.state.subtitleLang === 'spa'}
          onPress={() => this.setState({ subtitleLang: 'spa' })}
        />

        <Section title="Devices" />
        {this.renderDevices()}
      </ScrollView>
    );
  }

  renderDevices() {
    if (this.props.devices.loading) {
      return <Row title="Loading devices..." />;
    }
    if (this.props.devices.error) {
      return (
        <Row title={`Error loading devices ${this.props.devices.error}`} />
      );
    }
    return this.props.devices.devices.map(device => (
      <Row
        key={device.name}
        title={device.name}
        selected={this.state.device === device.name}
        onPress={() => this.setState({ device: device.name })}
      />
    ));
  }
}

const Section: React.SFC<{ title: string }> = props => (
  <View style={styles.section}>
    <Text style={styles.sectionTitle}>{props.title}</Text>
  </View>
);

type RowProps = {
  title: string;
  selected?: boolean;
  onPress?: () => void;
};
const Row: React.SFC<RowProps> = props => (
  <TouchableHighlight onPress={props.onPress}>
    <View style={styles.row}>
      <Text style={styles.rowTitle}>{props.title}</Text>
      {props.selected && (
        <Ionicons name="ios-checkmark" size={32} color="#357af6" />
      )}
    </View>
  </TouchableHighlight>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#191919'
  },
  section: {
    borderBottomWidth: 1,
    borderBottomColor: '#3e3e41',
    paddingTop: 16,
    paddingBottom: 16,
    paddingLeft: 16,
    paddingRight: 16,
    marginTop: 20
  },
  sectionTitle: {
    color: '#959595',
    fontWeight: 'bold',
    fontSize: 16
  },
  row: {
    borderBottomWidth: 1,
    borderBottomColor: '#3e3e41',
    marginLeft: 16,
    paddingTop: 12,
    paddingBottom: 12,
    paddingRight: 16,
    flexDirection: 'row',
    alignItems: 'center',
    height: 56
  },
  rowTitle: {
    color: '#e6e6e6',
    fontSize: 16,
    flex: 1,
    alignItems: 'center'
  }
});

const enhance = compose(
  graphql(
    gql`
      query Devices {
        devices {
          name
        }
      }
    `,
    { name: 'devices' }
  )
);

export default enhance(Settings as any);
