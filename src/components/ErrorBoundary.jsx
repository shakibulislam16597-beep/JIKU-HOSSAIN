import React from 'react';
import { RefreshCw, AlertTriangle, Home } from 'lucide-react';

export class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('ErrorBoundary caught an uncaught error:', error, errorInfo);
    this.setState({ errorInfo });
  }

  handleReload = () => {
    window.location.reload();
  };

  handleGoHome = () => {
    window.location.hash = '#/';
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      const errorMessage =
        this.state.error?.message ||
        this.state.error?.toString() ||
        'An unexpected application error occurred.';

      const stack = this.state.error?.stack || this.state.errorInfo?.componentStack || '';

      return (
        <div className="min-h-screen bg-[#F7F8FC] flex items-center justify-center p-4 font-sans text-[#0E1330]">
          <div className="bg-[#FFFFFF] rounded-[24px] max-w-lg w-full p-6 sm:p-8 border-2 border-[#0E1330] shadow-[6px_6px_0px_#0E1330] space-y-6">
            <div className="flex items-center gap-3 border-b-2 border-[#0E1330] pb-4">
              <div className="p-3 bg-[#FFC933] border-2 border-[#0E1330] rounded-xl shadow-[2px_2px_0px_#0E1330] text-[#0E1330]">
                <AlertTriangle className="w-7 h-7" />
              </div>
              <div>
                <h1 className="text-xl sm:text-2xl font-heading font-extrabold text-[#0E1330]">
                  Something went wrong
                </h1>
                <p className="text-xs font-sans text-[#5B6079]">
                  Extrovat Lifestyle Application Error
                </p>
              </div>
            </div>

            <div className="p-4 bg-[#F7F8FC] border-2 border-[#0E1330] rounded-xl space-y-2">
              <p className="text-xs font-heading font-bold text-[#0E1330]">Error details:</p>
              <pre className="text-[11px] font-mono text-red-600 overflow-x-auto whitespace-pre-wrap break-words max-h-48 p-2 bg-red-50 border border-red-200 rounded-lg">
                {errorMessage}
              </pre>
              {stack && (
                <>
                  <p className="text-xs font-heading font-bold text-[#0E1330] pt-2">Stack trace:</p>
                  <pre className="text-[10px] font-mono text-gray-600 overflow-x-auto whitespace-pre-wrap break-words max-h-48 p-2 bg-gray-100 border border-gray-300 rounded-lg">
                    {stack}
                  </pre>
                </>
              )}
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
              <button
                type="button"
                onClick={this.handleReload}
                className="w-full sm:w-1/2 py-3 px-4 bg-[#2436F5] text-[#FFFFFF] font-heading font-extrabold text-xs uppercase tracking-wider rounded-xl border-2 border-[#0E1330] shadow-[3px_3px_0px_#0E1330] hover:bg-[#1b2ac4] transition-all cursor-pointer flex items-center justify-center gap-2"
              >
                <RefreshCw className="w-4 h-4" /> Reload Page
              </button>
              <button
                type="button"
                onClick={this.handleGoHome}
                className="w-full sm:w-1/2 py-3 px-4 bg-[#FFC933] text-[#0E1330] font-heading font-extrabold text-xs uppercase tracking-wider rounded-xl border-2 border-[#0E1330] shadow-[3px_3px_0px_#0E1330] hover:bg-[#e6b42e] transition-all cursor-pointer flex items-center justify-center gap-2"
              >
                <Home className="w-4 h-4" /> Go to Storefront
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
