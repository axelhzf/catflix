import * as React from 'react';
import {
  Dimensions,
  Image,
  StyleSheet,
  Text,
  TouchableHighlight,
  View
} from 'react-native';
import { colors } from './colors';

type Props = {
  title: string;
  image: string;
  onPress(): void;
};

export class CoverCell extends React.Component<Props> {
  render() {
    return (
      <TouchableHighlight
        onPress={this.props.onPress}
      >
        <View style={styles.cell}>
          <Image
            style={styles.image}
            source={{ uri: this.props.image }}
            resizeMode="cover"
          />
          <View style={styles.titleContainer}>
            <Text style={styles.title}>{this.props.title}</Text>
          </View>
        </View>
      </TouchableHighlight>
    );
  }
}

const { width } = Dimensions.get('window');
const columns = 3;
const columnWidth = width / columns;

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
