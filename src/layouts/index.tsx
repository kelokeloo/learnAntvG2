import { Link, Outlet } from "umi";

export default function Layout() {
  return (
    <div>
      <ul className="flex space-x-4">
        <li>
          <Link to="/">Home</Link>
        </li>
        <li>
          <Link to="/docs">Docs</Link>
        </li>
      </ul>
      <Outlet />
    </div>
  );
}
