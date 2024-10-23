import { RouterProvider, createBrowserRouter } from "react-router-dom";
import App from "../App.jsx";
import useWindowWidth from "../hooks/useWindowWidth.jsx";
import { desktopRoutes } from "./desktopRoutes.jsx";
import { mobileRoutes } from "./mobileRoutes.jsx";
import ScrollToTop from "../components/shared/ScrollToTop/ScrollToTop.jsx";
import Deposit from "../pages/Deposit/Deposit.jsx";
import Withdraw from "../pages/Withdraw/Withdraw.jsx";
import RulesRegulation from "../pages/RulesRegulation/RulesRegulation.jsx";
import ExclusivePolicy from "../pages/ExclusivePolicy/ExclusivePolicy.jsx";
import ResponsibleGambling from "../pages/ResponsibleGambling/ResponsibleGambling.jsx";
import PrivacyPolicy from "../pages/PrivacyPolicy/PrivacyPolicy.jsx";
import ChangePassword from "../pages/ChangePassword/ChangePassword.jsx";
import StakeSettings from "../pages/StakeSettings/StakeSettings.jsx";
import BettingProfitLoss from "../pages/BettingProfitLoss/BettingProfitLoss.jsx";
import SingleProfitLoss from "../pages/SingleProfitLoss/SingleProfitLoss.jsx";
import APK from "../pages/APK/APK.jsx";
import LiveCasino from "../pages/LiveCasino/LiveCasino.jsx";
import Slots from "../pages/Slots/Slots.jsx";
import CrashGames from "../pages/CrashGames/CrashGames.jsx";
import FishingGames from "../pages/FishingGames/FishingGames.jsx";

const MainRouter = () => {
  const windowWidth = useWindowWidth();
  const routes = windowWidth > 1024 ? desktopRoutes : mobileRoutes;

  const router = createBrowserRouter(
    [
      {
        path: "/",
        element: (
          <>
            <ScrollToTop />
            <App />
          </>
        ),
        children: [
          ...routes,
          {
            path: "/deposit",
            element: <Deposit />,
          },
          {
            path: "/withdraw",
            element: <Withdraw />,
          },
          {
            path: "/rules-&-regulation",
            element: <RulesRegulation />,
          },
          {
            path: "/exclusive-policy",
            element: <ExclusivePolicy />,
          },
          {
            path: "/responsible-gambling",
            element: <ResponsibleGambling />,
          },
          {
            path: "/privacy-policy",
            element: <PrivacyPolicy />,
          },
          {
            path: "/change-password",
            element: <ChangePassword />,
          },
          {
            path: "/stake-settings",
            element: <StakeSettings />,
          },
          {
            path: "/betting-profit-loss",
            element: <BettingProfitLoss />,
          },
          {
            path: "/betting-profit-loss/:marketId",
            element: <SingleProfitLoss />,
          },
          {
            path: "/live-casino",
            element: <LiveCasino />,
          },
          {
            path: "/slots",
            element: <Slots />,
          },
          {
            path: "/crash-games",
            element: <CrashGames />,
          },
          {
            path: "/fishing-games",
            element: <FishingGames />,
          },
          {
            path: "/apk",
            element: <APK />,
          },
        ],
      },
    ],
    {
      basename: import.meta.env.BASE_URL ?? "/",
    }
  );

  return <RouterProvider router={router} />;
};

export default MainRouter;
