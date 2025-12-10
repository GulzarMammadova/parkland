import React from "react";

export class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }
  static getDerivedStateFromError() { return { hasError: true }; }
  componentDidCatch(error, info) { console.error(error, info); }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          padding: 24, maxWidth: 800, margin: "40px auto",
          background: "#FFF7F7", border: "1px solid #F5C2C7", borderRadius: 12
        }}>
          <h2 style={{ marginTop: 0, color: "#842029" }}>Something went wrong.</h2>
          <p style={{ color: "#842029" }}>
            We’re fixing it. Please reload the page or contact us if the issue persists.
          </p>
        </div>
      );
    }
    return this.props.children;
  }
}
