import React from 'react';

export class RootErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }
  static getDerivedStateFromError() {
    return { hasError: true };
  }
  componentDidCatch(err, info) {
    try {
      // eslint-disable-next-line no-console
      console.error('Root error boundary caught:', err, info);
    } catch {}
  }
  render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: 16 }}>
          <h1>Oops, something crashed.</h1>
          <p>Please refresh the page.</p>
        </div>
      );
    }
    return this.props.children;
  }
}

export default RootErrorBoundary;

