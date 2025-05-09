import React from 'react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI.
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    // You can also log the error to an error reporting service
    this.setState({
      error: error,
      errorInfo: errorInfo
    });
    console.error("Error in component:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      // You can render any custom fallback UI
      return (
        <div className="error-container">
          <h2>🛑 Something went wrong</h2>
          <p>We're sorry, but there was a problem loading this part of the app.</p>
          <button 
            onClick={() => window.location.reload()}
            className="error-reload-btn"
          >
            🔄 Reload App
          </button>
        </div>
      );
    }

    return this.props.children; 
  }
}

export default ErrorBoundary;
