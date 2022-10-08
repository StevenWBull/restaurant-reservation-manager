import React, { useEffect, useState } from "react";
import { listReservations } from "../utils/api";
import ErrorAlert from "../layout/ErrorAlert";
import { today } from "../utils/date-time";
import useQuery from "../utils/useQuery"
import PreviousDay from "./PreviousDay";
import NextDay from "./NextDay";
import ReservationList from "../reservations/ReservationList";
import TableList from "../tables/TableList";
import "./Dashboard.css"

/**
 * Defines the dashboard page.
 * @param date
 *  the date for which the user wants to view reservations.
 * @returns {JSX.Element}
 */
function Dashboard() {
  const query = useQuery();

  const date = ( query.get('date') ? query.get("date") : today() )

  const [reservations, setReservations] = useState([]);
  const [reservationsError, setReservationsError] = useState(null);

  useEffect(loadDashboard, [date]);

  function loadDashboard() {
    const abortController = new AbortController();
    setReservationsError(null);
    listReservations({ date }, abortController.signal)
      .then(setReservations)
      .catch(setReservationsError);
    return () => abortController.abort();
  }

  //TODO reformat "created_at" and "updated on" data to render more readably; take out the `T`, `Z`, and seconds values

  //* buttons below (next, previous) should take you to new URLs; do NOT change the current URL
  return (
    <main className="dashboard-container">
      <h1>Dashboard</h1>
      <div className="d-md-flex title-layer">
        <h3>Reservations for {date === today() ? "Today" : date}</h3>
      </div>

      <div className="d-md-flex mx-2 my-4">
      <ReservationList reservations={reservations} setReservations={setReservations}/>
      </div>

      <PreviousDay date={date}/>
      <NextDay date={date}/>

        
      <TableList />

      <ErrorAlert error={reservationsError} />

    </main>
  );
}

export default Dashboard;
