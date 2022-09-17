import { Link, Outlet } from "umi";
import { QueryClient, QueryClientProvider } from "react-query";
import { EuiProvider } from "@elastic/eui";

import "@elastic/charts/dist/theme_light.css";
import "@elastic/eui/dist/eui_theme_light.css";

const queryClient = new QueryClient();

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
        <li>
          <Link to="/learn-antv-g2">antv G2</Link>
        </li>
        <li>
          <Link to="/learn-elastic-ui">elastic ui</Link>
        </li>
        <li>
          <Link to="/learn-d3">d3</Link>
        </li>
      </ul>
      <QueryClientProvider client={queryClient}>
        <EuiProvider colorMode="light">
          <Outlet />
        </EuiProvider>
      </QueryClientProvider>
    </div>
  );
}
