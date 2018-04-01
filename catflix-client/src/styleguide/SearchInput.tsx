import * as React from 'react';
import {colors} from "./colors";
import {View, TextInput, StyleSheet} from "react-native";
import {Ionicons} from '@expo/vector-icons';

type Props = {
  value: string;
  onChangeText(value: string): void;
  placeholder?: string;
};

export class SearchInput extends React.Component<Props> {

  render() {
    return (
      <View style={styles.textInputContainer}>
        <Ionicons name="ios-search" style={styles.searchIcon} size={24} />
        <TextInput
          placeholderTextColor={colors.gray2}
          placeholder={this.props.placeholder}
          value={this.props.value}
          style={styles.textInput}
          onChangeText={this.props.onChangeText}
        />
      </View>
    )
  }

}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.gray4
  },
  textInputContainer: {
    backgroundColor: colors.gray4,
    paddingTop: 7,
    paddingBottom: 7,
    paddingLeft: 3,
    paddingRight: 3,
    flexDirection: 'row',
    alignItems: 'center'
  },
  searchIcon: {
    color: colors.text,
    width: 24
  },
  textInput: {
    color: colors.text,
    backgroundColor: colors.gray3,
    padding: 7,
    borderRadius: 3,
    flex: 1
  }
});
