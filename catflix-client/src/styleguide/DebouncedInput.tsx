import * as React from "react";

type DebounceInputProps = {
  value?: string;
  timeout: number;
  children(value: string, valid: boolean): JSX.Element;
}
type DebounceInputState = {
  value?: string,
  valid: boolean
}

export class DebounceInput extends React.Component<DebounceInputProps, DebounceInputState> {

  state: DebounceInputState = {
    value: this.props.value,
    valid: true
  };

  private setStateTimer: any;

  componentDidUpdate(prevProps: DebounceInputProps) {
    if (prevProps.value !== this.props.value) {
      if (this.props.value.length === 0) {
        this.setState({ valid: true, value: ''})
      } else {
        this.debouncedSetValue(this.props.value);
      }
    }
  }

  debouncedSetValue(value: string) {
    this.setState({valid: false});
    clearTimeout(this.setStateTimer);
    this.setStateTimer = setTimeout(() => {
      this.setState({valid: true, value});
    }, this.props.timeout);
  }

  render() {
    return this.props.children(this.state.value, this.state.valid);
  }

}