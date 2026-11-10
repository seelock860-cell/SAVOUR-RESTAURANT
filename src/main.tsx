import React, { Component, ErrorInfo, ReactNode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error in SAVOURE application:', error, errorInfo);
  }

  private handleReset = () => {
    try {
      localStorage.clear();
    } catch (e) {
      console.warn('Could not clear localStorage', e);
    }
    window.location.reload();
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div style={{
          minHeight: '100vh',
          backgroundColor: '#08080a',
          color: '#fdfbf7',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '24px',
          textAlign: 'center',
          fontFamily: 'system-ui, sans-serif'
        }}>
          <div style={{
            maxWidth: '500px',
            padding: '32px',
            borderRadius: '24px',
            backgroundColor: '#12131b',
            border: '1px solid #d4af37'
          }}>
            <h1 style={{ fontSize: '24px', fontWeight: 'bold', color: '#d4af37', marginBottom: '12px' }}>
              SAVOURÉ RESTAURANT
            </h1>
            <p style={{ fontSize: '14px', color: '#ded3c0', marginBottom: '24px' }}>
              An unexpected display issue occurred. Click below to refresh the experience.
            </p>
            <button
              onClick={this.handleReset}
              style={{
                padding: '12px 24px',
                borderRadius: '9999px',
                backgroundColor: '#d4af37',
                color: '#08080a',
                fontWeight: 'bold',
                fontSize: '12px',
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
                cursor: 'pointer',
                border: 'none'
              }}
            >
              Reset &amp; Reload Experience
            </button>
            {this.state.error && (
              <pre style={{
                marginTop: '16px',
                padding: '12px',
                borderRadius: '8px',
                backgroundColor: '#08080a',
                color: '#ff6b6b',
                fontSize: '11px',
                textAlign: 'left',
                overflowX: 'auto'
              }}>
                {this.state.error.message}
              </pre>
            )}
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

createRoot(document.getElementById('root')!).render(
  <ErrorBoundary>
    <App />
  </ErrorBoundary>
);
