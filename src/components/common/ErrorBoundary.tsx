import { Component } from "react";
import type { ReactNode } from "react";
import FeedbackState from "./FeedbackState";

export default class ErrorBoundary extends Component<
  { children: ReactNode },
  { failed: boolean }
> {
  state = { failed: false };

  static getDerivedStateFromError() {
    return { failed: true };
  }

  render() {
    return this.state.failed ? (
      <FeedbackState
        error
        title="Couldn't open this page"
        message="Refresh the page to try again."
        onRetry={() => window.location.reload()}
      />
    ) : (
      this.props.children
    );
  }
}
