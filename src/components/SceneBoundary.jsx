import { Component } from 'react';
export default class SceneBoundary extends Component {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  render() {
    return this.state.failed ? (
      <div className="scene-fallback" aria-hidden="true" />
    ) : (
      this.props.children
    );
  }
}
