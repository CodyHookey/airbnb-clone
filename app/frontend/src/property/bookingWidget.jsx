import React from "react";
import DatePicker from "react-datepicker";
import moment from "moment";
import { safeCredentials, handleErrors } from "../utils/fetchHelper";

import "react-datepicker/dist/react-datepicker.css";
import Property from "./property";

class BookingWidget extends React.Component {
  state = {
    authenticated: false,
    existingBookings: [],
    startDate: null,
    endDate: null,
    loading: false,
    error: false,
    rangeError: "",
  };

  componentDidMount() {
    fetch("/api/authenticated")
      .then(handleErrors)
      .then((data) => {
        this.setState({
          authenticated: data.authenticated,
        });
      });

    this.getPropertyBookings();
  }

  initiateStripeCheckout = (booking_id) => {
    return fetch(
      `/api/charges?booking_id=${booking_id}&cancel_url=${window.location.pathname}`,
      safeCredentials({
        method: "POST",
      })
    )
      .then(handleErrors)
      .then((response) => {
        const stripe = window.Stripe(
          `${import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY}`
        );

        stripe
          .redirectToCheckout({
            // Make the id field from the Checkout Session creation API response
            // available to this file, so you can provide it as parameter here
            // instead of the {{CHECKOUT_SESSION_ID}} placeholder.
            sessionId: response.charge.checkout_session_id,
          })
          .then((result) => {
            // If `redirectToCheckout` fails due to a browser or network
            // error, display the localized error message to your customer
            // using `result.error.message`.
          });
      })
      .catch((error) => {
        console.log(error);
      });
  };

  getPropertyBookings = () => {
    fetch(`/api/properties/${this.props.property_id}/bookings`)
      .then(handleErrors)
      .then((data) => {
        console.log(data);
        this.setState({
          existingBookings: data.bookings,
        });
      });
  };

  submitBooking = (event) => {
    if (event) {
      event.preventDefault();
    }

    const { startDate, endDate } = this.state;
    console.log(
      moment(startDate).format("MMM DD YYYY"),
      moment(endDate).format("MMM DD YYYY")
    );

    fetch(
      `/api/bookings`,
      safeCredentials({
        method: "POST",
        body: JSON.stringify({
          booking: {
            property_id: this.props.property_id,
            start_date: startDate
              ? moment(startDate).format("MMM DD YYYY")
              : null,
            end_date: endDate ? moment(endDate).format("MMM DD YYYY") : null,
          },
        }),
      })
    )
      .then(handleErrors)
      .then((response) => {
        return this.initiateStripeCheckout(response.booking.id);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  onDatesChange = (dates) => {
    const [startDate, endDate] = dates;
    const blocked = this.blockedDates();

    this.setState({
      rangeError: "",
    });

    if (moment(startDate).isSame(endDate, "day")) {
      this.setState({
        rangeError: "You can't pick the same day for start and finish",
        startDate: null,
      });
      return;
    }

    if (startDate && endDate) {
      let valid = true;
      let current = new Date(startDate);

      while (current <= endDate) {
        if (blocked.some((d) => d.toDateString() === current.toDateString())) {
          valid = false;
          break;
        }
        current.setDate(current.getDate() + 1);
      }

      if (!valid) {
        this.setState({
          rangeError:
            "That range includes booked dates. Please pick another date.",
          startDate: null,
        });
        return;
      }
    }

    this.setState({ startDate, endDate });
  };

  blockedDates = () => {
    const { existingBookings } = this.state;

    if (!existingBookings) {
      return [];
    }

    return existingBookings.flatMap((b) => {
      const start = new Date(b.start_date);
      const end = new Date(b.end_date);
      const dates = [];
      let current = new Date(start);

      current.setDate(current.getDate() + 1);

      while (current < end) {
        dates.push(new Date(current));
        current.setDate(current.getDate() + 1);
      }
      return dates;
    });
  };

  render() {
    const { authenticated, startDate, endDate, blockedDates, rangeError } =
      this.state;

    if (!authenticated) {
      return (
        <div className="border p-4 mb-4">
          Please{" "}
          <a href={`/login?redirect_url=${window.location.pathname}`}>log in</a>{" "}
          to make a booking.
        </div>
      );
    }

    const { price_per_night } = this.props;

    let days;
    if (startDate && endDate) {
      days = moment(endDate).diff(moment(startDate), "days");
    }

    return (
      <div className="border p-4 mb-4 col-lg-4">
        <form onSubmit={this.submitBooking}>
          <h5>
            ${price_per_night} <small>per night</small>
          </h5>
          <hr />
          <div className="mb-3 text-center">
            <DatePicker
              selectsRange
              startDate={startDate}
              endDate={endDate}
              onChange={this.onDatesChange}
              dateFormat="MMM DD yyyy"
              minDate={new Date()}
              filterDate={(date) => {
                const blocked = this.blockedDates();

                return !blocked.some(
                  (d) => d.toDateString() === date.toDateString()
                );
              }}
              inline
            />
            <div className=" d-flex justify-content-between">
              {startDate && (
                <div>
                  {" "}
                  <p className="mb-0">
                    <strong>Start Date:</strong>
                  </p>
                  <p>{moment(startDate).format("MMM DD YYYY")}</p>
                </div>
              )}
              {endDate && (
                <div>
                  <p className="mb-0">
                    <strong>End Date:</strong>
                  </p>
                  <p>{moment(endDate).format("MMM DD YYYY")}</p>
                </div>
              )}
            </div>
          </div>
          {days && (
            <div className="d-flex justify-content-between">
              <p>Total</p>
              <p>${(price_per_night * days).toLocaleString()}</p>
            </div>
          )}
          <button
            type="submit"
            className="btn btn-lg btn-danger btn-block d-block w-100 mb-3"
          >
            Book
          </button>
          {rangeError && (
            <div>
              <p className="text-danger text-center">{rangeError}</p>
            </div>
          )}
        </form>
      </div>
    );
  }
}

export default BookingWidget;
