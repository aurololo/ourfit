import React from 'react';

export class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error, info) {
    console.error('ourFIT crashed:', error, info.componentStack);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: '#0A0A0A', color: '#fff', fontFamily: 'Inter, sans-serif', padding: '2rem', textAlign: 'center' }}>
          <h1 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '0.5rem' }}>Something went wrong</h1>
          <p style={{ color: '#9CA3AF', marginBottom: '1.5rem' }}>ourFIT hit an unexpected error.</p>
          <button
            onClick={() => { this.setState({ hasError: false }); window.location.hash = ''; }}
            style={{ padding: '0.75rem 2rem', background: '#FF6B35', color: '#000', fontWeight: 700, border: 'none', borderRadius: '0.5rem', cursor: 'pointer', textTransform: 'uppercase', letterSpacing: '0.05em' }}
          >
            Reload
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}
