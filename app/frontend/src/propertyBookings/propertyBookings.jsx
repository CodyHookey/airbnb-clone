import React from "react";
import Layout from "../layout";
import { handleErrors } from "../utils/fetchHelper";

import "./propertyBookings.scss";

class PropertyBookings extends React.Component {
  state = {
    property: {},
    bookings: [],
    propertyBookings: [],
    loading: true,
  };

  componentDidMount() {
    this.getProperty();
    this.getPropertyBookings();
  }

  getProperty() {
    fetch(`/api/properties/${this.props.property_id}`)
      .then(handleErrors)
      .then((data) => {
        this.setState({
          property: data.property,
          loading: false,
        });
      });
  }

  getPropertyBookings() {
    fetch(`/api/properties/${this.props.property_id}/bookings`)
      .then(handleErrors)
      .then((data) => {
        this.setState({ bookings: data.bookings });

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

      // Fetch User
      var userPromise = fetch(`/api/users/${booking.user_id}`)
        .then(handleErrors)
        .then((user) => {
          booking.user = user.user;
        })
        .catch((error) => {
          console.error("User fetch failed for booking:", booking.id, error);
          booking.user = null;
        });

      return Promise.all([paymentPromise, userPromise]).then(() => {
        return booking;
      });
    });

    return Promise.all(finalRequest);
  }

  render() {
    const { property, loading, propertyBookings } = this.state;

    if (loading) {
      return <p>loading...</p>;
    }

    const {
      id,
      title,
      description,
      city,
      country,
      property_type,
      price_per_night,
      max_guests,
      bedrooms,
      beds,
      baths,
      user,
      images,
    } = property;

    return (
      <Layout>
        <div
          className="property-image mb-3"
          style={{ backgroundImage: `url(${images[0].image_url})` }}
        />
        <div className="container">
          <div className="row">
            <div className="info col-12">
              <div className="mb-3">
                <h3 className="mb-0">{title}</h3>
                <hr />
                <p>{description}</p>

                <h3>Bookings for your Property:</h3>

                <div className="bookings row justify-content-center">
                  {propertyBookings.map((booking) => {
                    return (
                      <div
                        key={booking.id}
                        className="col-12 px-4 py-3 mb-3 property box-component"
                      >
                        <div className="large-screens row">
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
                          <div className="user d-flex d-md-block col-12 col-md-3 justify-content-around d-none">
                            <div className="mb-3">
                              <h6 className="mb-0">Guest:</h6>
                              <p className="mb-0">{booking.user.username}</p>
                            </div>
                            <div>
                              <h6 className="mb-0">Email:</h6>
                              <p className="mb-0">{booking.user.email}</p>
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
                            <h6 className="mb-0">Guest:</h6>
                            <p className="mb-0">{booking.user.username}</p>
                          </div>
                          <div className="col-6 d-md-none mb-3">
                            <h6 className="mb-0">Email:</h6>
                            <p className="mb-0">{booking.user.email}</p>
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

export default PropertyBookings;
