import { Text, TouchableHighlight, View, StyleSheet } from 'react-native';
import * as React from 'react';
import { colors } from './colors';

type ErrorProps = {
  message: string;
  onPressTryAgain?: () => void;
};
export function Error(props: ErrorProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Error</Text>
      <Text style={styles.subtitle}>{props.message}</Text>
      {props.onPressTryAgain && (
        <TouchableHighlight
          style={styles.button}
          onPress={props.onPressTryAgain}
        >
          <Text style={styles.buttonText}>Try again</Text>
        </TouchableHighlight>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.bg
  },
  title: { color: colors.text, fontSize: 24, fontWeight: 'bold' },
  subtitle: { color: colors.text, fontSize: 14, marginTop: 8 },
  button: {
    padding: 8,
    borderWidth: 1,
    borderColor: colors.accent,
    borderRadius: 3,
    marginTop: 32
  },
  buttonText: { color: colors.text, fontWeight: 'bold' }
});
