import { useParams } from "react-router-dom";
import Bookmaker from "../../../components/ui/mobile/events/Bookmaker";
import Fancy from "../../../components/ui/mobile/events/Fancy";
import MatchOdds from "../../../components/ui/mobile/events/MatchOdds";
import { useEffect, useState } from "react";
import { settings } from "../../../api";
import { useGetAllOddsEventsQuery } from "../../../redux/features/events/events";
import EventHeader from "../../../components/ui/mobile/events/EventHeader";
import useBalance from "../../../hooks/useBalance";
import { useDispatch, useSelector } from "react-redux";
import {
  setFirstOdd,
  setPredictOdd,
  setSecondOdd,
  setThirdOdd,
} from "../../../redux/features/events/eventSlice";
import OpenBets from "../../../components/ui/mobile/events/OpenBets";

const Events = () => {
  const [betsType, setBetsType] = useState("live");
  const dispatch = useDispatch();
  const { placeBetValues, price, stake } = useSelector((state) => state.event);
  const { refetchBalance } = useBalance();
  const { eventTypeId, eventId } = useParams();
  const payload = {
    eventTypeId,
    eventId,
  };
  const [match_odds, setMatch_odds] = useState([]);
  const [bookmaker, setBookmaker] = useState([]);
  // const [bookmaker2, setBookmaker2] = useState([]);
  const [fancy, setFancy] = useState([]);
  // const [fancy1, setFancy1] = useState([]);
  // const [overByOver, setOverByOver] = useState([]);
  const { data } = useGetAllOddsEventsQuery(payload, {
    pollingInterval: settings.interval,
  });

  useEffect(() => {
    refetchBalance();
  }, []);
  /* Filtered all the game  */
  useEffect(() => {
    if (data?.result) {
      const events = data?.result;
      const filterMatch_odds = events?.filter(
        (match_odd) => match_odd.btype === "MATCH_ODDS"
      );
      setMatch_odds(filterMatch_odds);

      const bookmarkerFilter = events?.filter(
        (bookmarker) => bookmarker.btype === "BOOKMAKER"
      );
      setBookmaker(bookmarkerFilter);

      // const filterBookmarker2 = events?.filter(
      //   (bookmarker2) => bookmarker2.btype === "BOOKMAKER2"
      // );
      // setBookmaker2(filterBookmarker2);

      const normalFilter = events?.filter(
        (normal) => normal.btype === "FANCY" && normal.tabGroupName === "Normal"
      );
      setFancy(normalFilter);

      // const fancy1Filter = events?.filter(
      //   (fancy1) => fancy1.btype === "ODDS" && fancy1.tabGroupName === "Fancy1"
      // );
      // setFancy1(fancy1Filter);

      // const overByOverFilter = events?.filter(
      //   (overByOver) =>
      //     overByOver.btype === "FANCY" &&
      //     overByOver.tabGroupName === "Over By Over"
      // );
      // setOverByOver(overByOverFilter);
    }
  }, [data]);

  const pnl1 =
    placeBetValues?.pnl && placeBetValues?.pnl[0] ? placeBetValues?.pnl[0] : 0;
  const pnl2 =
    placeBetValues?.pnl && placeBetValues?.pnl[1] ? placeBetValues?.pnl[1] : 0;
  const pnl3 =
    placeBetValues?.pnl && placeBetValues?.pnl[2] ? placeBetValues?.pnl[2] : 0;
  const selectionId = placeBetValues?.selectionId?.toString();

  useEffect(() => {
    if (
      placeBetValues?.btype === "MATCH_ODDS" ||
      placeBetValues?.btype === "BOOKMAKER"
    ) {
      if (placeBetValues?.back) {
        let total;

        if (placeBetValues?.btype === "MATCH_ODDS") {
          total = price * stake - stake;
        }
        if (placeBetValues?.btype === "BOOKMAKER") {
          const bookmaker = 1 + price / 100;
          total = bookmaker * stake - stake;
        }

        if (selectionId && selectionId.includes(".1")) {
          dispatch(setFirstOdd(formatNumber(total + pnl1)));
          dispatch(setSecondOdd(formatNumber(pnl2 + -1 * stake)));
          dispatch(setThirdOdd(formatNumber(pnl3 + -1 * stake)));

          dispatch(
            setPredictOdd([
              {
                odd: formatNumber(total + pnl1),
                id: placeBetValues?.runnerId[0],
              },
              {
                odd: formatNumber(pnl2 + -1 * stake),
                id: placeBetValues?.runnerId[1],
              },
              {
                odd: formatNumber(pnl3 + -1 * stake),
                id: placeBetValues?.runnerId[2],
              },
            ])
          );
        } else if (selectionId && selectionId.includes(".2")) {
          dispatch(setFirstOdd(formatNumber(total + pnl2)));
          dispatch(setSecondOdd(formatNumber(pnl3 + -1 * stake)));
          dispatch(setThirdOdd(formatNumber(pnl2 + -1 * stake)));
          dispatch(
            setPredictOdd([
              {
                odd: formatNumber(pnl2 + -1 * stake),
                id: placeBetValues?.runnerId[2],
              },
              {
                odd: formatNumber(total + pnl2),
                id: placeBetValues?.runnerId[1],
              },
              {
                odd: formatNumber(pnl3 + -1 * stake),
                id: placeBetValues?.runnerId[0],
              },
            ])
          );
        } else {
          dispatch(setFirstOdd(formatNumber(total + pnl3)));
          dispatch(setSecondOdd(formatNumber(pnl1 + -1 * stake)));
          dispatch(setThirdOdd(formatNumber(pnl2 + -1 * stake)));
          dispatch(
            setPredictOdd([
              {
                odd: formatNumber(pnl1 + -1 * stake),
                id: placeBetValues?.runnerId[0],
              },
              {
                odd: formatNumber(pnl2 + -1 * stake),
                id: placeBetValues?.runnerId[1],
              },
              {
                odd: formatNumber(total + pnl3),
                id: placeBetValues?.runnerId[2],
              },
            ])
          );
        }
      } else if (placeBetValues?.lay) {
        let total;
        if (placeBetValues?.btype === "MATCH_ODDS") {
          total = -1 * (price * stake - stake);
        }
        if (placeBetValues?.btype === "BOOKMAKER") {
          const bookmaker = 1 + price / 100;
          total = -1 * (bookmaker * stake - stake);
        }

        if (selectionId && selectionId.includes(".1")) {
          dispatch(setFirstOdd(formatNumber(total + pnl1)));
          dispatch(setSecondOdd(formatNumber(1 * pnl2 + 1 * stake)));
          dispatch(setThirdOdd(formatNumber(1 * pnl3 + 1 * stake)));
          dispatch(
            setPredictOdd([
              {
                odd: formatNumber(total + pnl1),
                id: placeBetValues?.runnerId[0],
              },
              {
                odd: formatNumber(formatNumber(1 * pnl2 + 1 * stake)),
                id: placeBetValues?.runnerId[1],
              },
              {
                odd: formatNumber(formatNumber(1 * pnl3 + 1 * stake)),
                id: placeBetValues?.runnerId[2],
              },
            ])
          );
        } else if (selectionId && selectionId.includes(".2")) {
          dispatch(setFirstOdd(formatNumber(total + pnl2)));
          dispatch(setSecondOdd(formatNumber(1 * pnl3 + 1 * stake)));
          dispatch(setThirdOdd(formatNumber(1 * pnl1 + 1 * stake)));
          dispatch(
            setPredictOdd([
              {
                odd: formatNumber(formatNumber(1 * pnl1 + 1 * stake)),
                id: placeBetValues?.runnerId[2],
              },
              {
                odd: formatNumber(total + pnl2),
                id: placeBetValues?.runnerId[1],
              },
              {
                odd: formatNumber(formatNumber(1 * pnl3 + 1 * stake)),
                id: placeBetValues?.runnerId[0],
              },
            ])
          );
        } else {
          dispatch(setFirstOdd(formatNumber(total + pnl3)));
          dispatch(setSecondOdd(formatNumber(1 * pnl1 + 1 * stake)));
          dispatch(setThirdOdd(formatNumber(1 * pnl2 + 1 * stake)));
          dispatch(
            setPredictOdd([
              {
                odd: formatNumber(formatNumber(1 * pnl1 + 1 * stake)),
                id: placeBetValues?.runnerId[0],
              },
              {
                odd: formatNumber(formatNumber(1 * pnl2 + 1 * stake)),
                id: placeBetValues?.runnerId[1],
              },
              {
                odd: formatNumber(total + pnl3),
                id: placeBetValues?.runnerId[2],
              },
            ])
          );
        }
      }
    } else {

      let total = price * stake - stake;

      dispatch(
        setPredictOdd([
          {
            odd: formatNumber(total + pnl1),
            id: placeBetValues?.runnerId,
          },
         
        ])
      );
    }
  }, [price, stake, placeBetValues, pnl1, pnl2, pnl3, selectionId, dispatch]);




  /* Format number */
  const formatNumber = (value) => {
    if (!value) {
      return;
    } else {
      const hasDecimal = value % 1 !== 0;
    
      // value?.toFixed(2)
      return hasDecimal ? value : value;
    }
  };

  return (
    <div className="flex flex-col transition-all lg:pt-[110px] ease-in-out duration-100 pt-[54px]">
      <div className="flex items-start justify-start w-full lg:px-12 xl:px-20 xlg:px-24">
        <div
          className="w-full md:mt-[0px] lg:overflow-auto lg:w-[54%]"
          style={{ minHeight: "calc(-54px + 100dvh)" }}
        >
          <div className="no-scrollbar min-h-[calc(100dvh-56px)] md:mb-3">
            <EventHeader
              betType={betsType}
              setBetsType={setBetsType}
              data={data}
            />

            {betsType === "openBet" && <OpenBets eventId={eventId} />}
            <div className="w-full text-selection-none pb-3 lg:pb-0">
              <div className="px-2 font-helvetica-neue">
                {match_odds?.length > 0 && (
                  <MatchOdds match_odds={match_odds} />
                )}
                {bookmaker?.length > 0 && <Bookmaker bookmaker={bookmaker} />}
                {fancy?.length > 0 && <Fancy fancy={fancy} />}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Events;
