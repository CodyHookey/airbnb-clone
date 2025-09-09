import React from "react";
import Layout from "../layout";
import { handleErrors } from "../utils/fetchHelper";

import "./success.scss";

class Success extends React.Component {
  state = {
    property: {},
    loading: true,
    paymentStatus: false,
    currency: "",
    amount: 0,
  };

  componentDidMount() {
    console.log("Success props:", this.props);
    this.getPropertyInfo();
    this.getPaymentStatus();
  }

  getPropertyInfo() {
    fetch(`/api/properties/${this.props.property_id}`)
      .then(handleErrors)
      .then((data) => {
        this.setState({
          property: data.property,
          loading: false,
        });
      });
  }

  getPaymentStatus() {
    fetch(`/api/payment-status/${this.props.booking_id}`)
      .then(handleErrors)
      .then((data) => {
        console.log(data);
        this.setState({
          paymentStatus: data.charge.completed,
          currency: data.charge.currency,
          amount: data.charge.amount,
        });
      });
  }

  render() {
    const { property, loading, paymentStatus, currency, amount } = this.state;

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
      image_url,
      user,
    } = property;

    return (
      <Layout>
        <div className="container text-center">
          <h1 className="mt-4 mb-0">Booking Received!</h1>
          <p className="mb-4 text-secondary">
            Thank you for booking your next adventure with us!
          </p>
          <div className="row mb-5">
            <div className="col-12">
              <h3 className="mb-0">
                <a
                  className="link-item"
                  href={`/property/${this.props.property_id}`}
                >
                  {title}
                </a>
              </h3>
              <p className="mb-3 text-secondary">{description}</p>
              <a href={`/property/${this.props.property_id}`}>
                <div
                  className=" property-image"
                  style={{ backgroundImage: `url(${image_url})` }}
                />
              </a>
            </div>
          </div>
          <div className="row mb-5">
            <div className="col-6">
              <h6>
                <strong>Check In:</strong>
              </h6>
              <p>{this.props.start_date}</p>
            </div>
            <div className="col-6">
              <h6>
                <strong>Check Out:</strong>
              </h6>
              <p>{this.props.end_date}</p>
            </div>
          </div>
          <div className="row mb-5">
            <div className="col-6">
              <h6>
                <strong>Amount:</strong>
              </h6>
              <p>
                {currency.toUpperCase()}: {amount}
              </p>
            </div>
            <div className="col-6">
              <h6>
                <strong>Booking Status:</strong>
              </h6>
              {paymentStatus ? (
                <p className="pay pay-complete px-3 py-1">Paid</p>
              ) : (
                <p className="pay pay-processing px-3 py-1">Processing</p>
              )}
            </div>
          </div>

          <h3 className="mb-5">Guest Info:</h3>
          <div className="row mb-5">
            <div className="col-lg-4 col-12 mb-sm-3 mb-lg-0">
              <h6>
                <strong>Username:</strong>
              </h6>
              <p>{this.props.user_username}</p>
            </div>
            <div className="col-lg-4 col-12 mb-sm-3 mb-lg-0">
              <h6>
                <strong>Email:</strong>
              </h6>
              <p>{this.props.user_email}</p>
            </div>
            <div className="col-lg-4 col-12">
              <h6>
                <strong>Booking Reference:</strong>
              </h6>
              <p>{this.props.booking_id}</p>
            </div>
          </div>
        </div>
      </Layout>
    );
  }
}

export default Success;
