import { Link } from "react-router";
import { usePageTitle } from "../hooks/usePageTitle";
import { paths } from "../routes/paths";

export default function NotFound() {
  usePageTitle("Page not found");
  return (
    <div className="feedback-state">
      <h1>Page not found</h1>
      <p>We couldn't find the page you're looking for.</p>
      <Link className="secondary-button" to={paths.home}>
        Go to home
      </Link>
    </div>
  );
}
