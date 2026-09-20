import React from 'react';

/**
 * React Error Boundary component to prevent blank white screen on runtime errors
 */
export default class ErrorBoundary extends React.Component {
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
        <div className="min-h-screen bg-[#F7F8FC] flex items-center justify-center p-4 font-sans text-[#0E1330]">
          <div className="bg-[#FFFFFF] rounded-[24px] border-2 border-[#0E1330] shadow-[6px_6px_0px_#0E1330] p-6 max-w-md w-full space-y-4 text-center">
            <div className="w-12 h-12 bg-[#FFC933] border-2 border-[#0E1330] shadow-[2px_2px_0px_#0E1330] rounded-full flex items-center justify-center mx-auto text-xl font-bold">
              ⚠️
            </div>
            <h1 className="text-xl font-heading font-extrabold text-[#0E1330]">
              Application Error
            </h1>
            <p className="text-xs font-sans text-[#5B6079]">
              An unexpected error occurred while loading the application.
            </p>
            <div className="bg-red-50 border-2 border-red-500 rounded-xl p-3 text-left font-mono text-[11px] text-red-700 overflow-x-auto max-h-40">
              {this.state.error ? this.state.error.toString() : 'Unknown error'}
            </div>
            <button
              type="button"
              onClick={() => window.location.reload()}
              className="w-full py-2.5 bg-[#2436F5] text-[#FFFFFF] font-heading font-extrabold text-xs uppercase tracking-wider rounded-xl border-2 border-[#0E1330] shadow-[2px_2px_0px_#0E1330] hover:bg-[#1B29C4] cursor-pointer"
            >
              Reload Page
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
