import { Link, useLocation } from "react-router";
import { footerLinks, navigationGroups } from "./navigation";

export default function Sidebar({
  className = "",
  onNavigate,
}: {
  className?: string;
  onNavigate: () => void;
}) {
  const location = useLocation();
  const current = `${location.pathname}${location.search}`;
  return (
    <aside id="sidebar" className={`sidebar ${className}`}>
      <nav aria-label="Main navigation">
        {navigationGroups.map((links, index) => (
          <ul className="navigation-group" key={index}>
            {links.map(({ icon: Icon, label, href }) => (
              <li key={label}>
                {href.startsWith("https:") ? (
                  <a
                    className="navigation-link"
                    href={href}
                    target="_blank"
                    rel="noreferrer"
                  >
                    <Icon aria-hidden="true" />
                    <span>{label}</span>
                  </a>
                ) : (
                  <Link
                    className={`navigation-link ${current === href ? "active" : ""}`}
                    aria-current={current === href ? "page" : undefined}
                    to={href}
                    onClick={onNavigate}
                  >
                    <Icon aria-hidden="true" />
                    <span>{label}</span>
                  </Link>
                )}
              </li>
            ))}
          </ul>
        ))}
      </nav>
      <div className="sidebar-footer">
        <div>
          {footerLinks.map(({ label, href }) => (
            <a key={label} href={href} target="_blank" rel="noreferrer">
              {label}
            </a>
          ))}
        </div>
        <p>© {new Date().getFullYear()} Google</p>
        <p>This clone is for educational purposes only.</p>
      </div>
    </aside>
  );
}
