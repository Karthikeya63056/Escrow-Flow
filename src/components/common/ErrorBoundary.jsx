import { Component } from 'react';

export class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex flex-col items-center justify-center min-h-[400px] text-center p-6">
          <div className="text-red-500 mb-4 bg-red-500/10 p-4 rounded-full">
            <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <h2 className="text-xl font-semibold mb-2">Something went wrong</h2>
          <p className="text-gray-400 mb-6">{this.state.error?.message || "An unexpected error occurred."}</p>
          <button 
            onClick={() => window.location.reload()}
            className="bg-neonBlue text-darkBg px-6 py-2 rounded-md font-medium hover:bg-cyan-400"
          >
            Refresh Page
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
