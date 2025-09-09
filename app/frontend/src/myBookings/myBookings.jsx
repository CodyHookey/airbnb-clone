import React from "react";
import { handleErrors, safeCredentials } from "../utils/fetchHelper";
import Layout from "../layout";

import "./myBookings.scss";
import { Button } from "bootstrap";

class MyBookings extends React.Component {
  state = {
    bookings: [],
    propertyBookings: [],
    total_pages: 0,
    next_page: null,
    current_page: 1,
    prev_page: null,
  };

  componentDidMount() {
    this.getMyBookings();
  }

  getMyBookings() {
    fetch(`/api/bookings/${this.props.user_id}`)
      .then(handleErrors)
      .then((data) => {
        this.setState({
          bookings: data.bookings,
          total_pages: data.total_pages,
          next_page: data.next_page,
          prev_page: data.prev_page,
          current_page: data.current_page,
        });

        console.log(this.state);

        this.attachExtras(data.bookings).then((finalRequest) => {
          this.setState({
            propertyBookings: finalRequest,
          });
          console.log("All Bookings:", this.state.propertyBookings);
        });
      })
      .catch((error) => {
        console.error("Error fetching bookings:", error);
      });
  }

  attachExtras(bookings) {
    var finalRequest = bookings.map(function (booking) {
      // Fetch Payment Status
      var paymentPromise = fetch(`/api/payment-status/${booking.id}`)
        .then(handleErrors)
        .then((payment) => {
          booking.paymentStatus = payment.charge;
        })
        .catch((error) => {
          console.error(
            "Payment status fetch failed for booking:",
            booking.id,
            error
          );
          booking.paymentStatus = null;
        });

      var propertyPromise = fetch(`/api/properties/${booking.property_id}`)
        .then(handleErrors)
        .then((property) => {
          booking.property = property.property;
        })
        .catch((error) => {
          console.error(
            "Property fetch failed for bookings:",
            booking.id,
            error
          );
          booking.property = null;
        });

      return Promise.all([paymentPromise, propertyPromise]).then(() => {
        return booking;
      });
    });

    return Promise.all(finalRequest);
  }

  handleRetryPayment(bookingId, cancelUrl = "/") {
    fetch(
      `/api/charges/${bookingId}/retry`,
      safeCredentials({
        method: "POST",
        body: JSON.stringify({
          cancel_url: cancelUrl,
        }),
      })
    )
      .then(handleErrors)
      .then((data) => {
        console.log("Retry session created:", data);
        // redirect user to Stripe Checkout

        const stripe = window.Stripe(
          import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY
        );

        stripe.redirectToCheckout({ sessionId: data.id });
      })
      .catch((error) => {
        console.error("Retry payment failed:", error);
      });
  }

  render() {
    const { loading, propertyBookings } = this.state;
    return (
      <Layout>
        <div className="container">
          <div className="row">
            <div className="info col-12">
              <div className="mb-3">
                <h3 className="mt-3 mb-3">Your Bookings:</h3>

                <div className="bookings row justify-content-center">
                  {propertyBookings.map((booking) => {
                    return (
                      <div
                        key={booking.id}
                        className="col-12 col-lg-6 m-auto px-4 py-3 mb-3 property box-component"
                      >
                        <div className="row">
                          <div
                            className="property-image mb-3 col-12"
                            style={{
                              backgroundImage: `url(${booking.property.images[0].image_url})`,
                            }}
                          />
                          <div className="col-12">
                            <h4 className="mb-0">{booking.property.title}</h4>
                            <p className="mb-0 text-secondary">
                              <small>{booking.property.property_type}</small>
                            </p>
                            <p>
                              {booking.property.city},{" "}
                              {booking.property.country.toUpperCase()}
                            </p>
                          </div>
                        </div>
                        <div className="large-screens row justify-content-between">
                          <div className="dates d-flex d-md-block col-12 col-md-3 justify-content-around d-none">
                            <div className="mb-3">
                              <h6 className="mb-0">Start Date:</h6>
                              <p className="mb-0">{booking.start_date}</p>
                            </div>
                            <div>
                              <h6 className="mb-0">End Date:</h6>
                              <p className="mb-0">{booking.end_date}</p>
                            </div>
                          </div>
                          <div className="financial d-flex d-md-block col-12 col-md-3 justify-content-around d-none">
                            <div className="mb-3">
                              <h6 className="mb-0">Currency:</h6>
                              <p className="mb-0">
                                {booking.paymentStatus.currency.toUpperCase()}
                              </p>
                            </div>
                            <div>
                              <h6 className="mb-0">Amount:</h6>
                              <p className="mb-0">
                                {booking.paymentStatus.amount}
                              </p>
                            </div>
                          </div>
                          <div className="col-12 col-md-3 d-none d-md-block">
                            {booking.paymentStatus.completed ? (
                              <p className="pay pay-complete px-3 py-1 d-block text-center">
                                Paid
                              </p>
                            ) : (
                              <p className="pay pay-processing px-3 py-1 d-block text-center">
                                Pending
                              </p>
                            )}
                            {!booking.paymentStatus.completed ? (
                              <button
                                className="btn btn-primary d-block w-100"
                                onClick={() =>
                                  this.handleRetryPayment(
                                    booking.id,
                                    `/property/${booking.property_id}`
                                  )
                                }
                              >
                                Pay Booking
                              </button>
                            ) : null}
                          </div>
                        </div>
                        <div className="small-screens row">
                          <div className="col-6 d-md-none">
                            <h6 className="mb-0">Start Date:</h6>
                            <p className="mb-0">{booking.start_date}</p>
                          </div>
                          <div className="col-6 d-md-none mb-3">
                            <h6 className="mb-0">End Date:</h6>
                            <p className="mb-0">{booking.end_date}</p>
                          </div>
                          <div className="col-6 d-md-none">
                            <h6 className="mb-0">Currency:</h6>
                            <p className="mb-0">
                              {booking.paymentStatus.currency.toUpperCase()}
                            </p>
                          </div>
                          <div className="col-6 d-md-none mb-3">
                            <h6 className="mb-0">Amount:</h6>
                            <p className="mb-0">
                              {booking.paymentStatus.amount}
                            </p>
                          </div>
                          <div className="col-12 d-md-none">
                            {booking.paymentStatus.completed ? (
                              <p className="pay pay-complete px-3 py-1 d-block text-center">
                                Paid
                              </p>
                            ) : (
                              <p className="pay pay-processing px-3 py-1 d-block text-center">
                                Pending
                              </p>
                            )}
                            {!booking.paymentStatus.completed ? (
                              <button
                                className="btn btn-primary d-block w-100"
                                onClick={() =>
                                  this.handleRetryPayment(
                                    booking.id,
                                    `/property/${booking.property_id}`
                                  )
                                }
                              >
                                Pay Booking
                              </button>
                            ) : null}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
      </Layout>
    );
  }
}

export default MyBookings;
