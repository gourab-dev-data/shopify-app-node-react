import { BrowserRouter, NavLink } from "react-router-dom";
import { useTranslation } from "react-i18next";
import Routes from "./Routes";

import {
  QueryProvider,
  PolarisProvider,
  NavigationBar,
  TopBar,
} from "./components";

export default function App() {
  // Any .tsx or .jsx files in /pages will become a route
  // See documentation for <Routes /> for more info
  const pages = import.meta.glob("./pages/**/!(*.test.[jt]sx)*.([jt]sx)", {
    eager: true,
  });
  const { t } = useTranslation();

  return (
    <PolarisProvider>
      <BrowserRouter>
        <QueryProvider>
          <NavLink
            navigationLinks={[]}
          />
          <div className="main-section">
            <div className="menu-section">
              <NavigationBar />
            </div>
            <div className="content-section">
              <TopBar />
              <Routes pages={pages} />
            </div>
          </div>
        </QueryProvider>
      </BrowserRouter>
    </PolarisProvider>
  );
}
