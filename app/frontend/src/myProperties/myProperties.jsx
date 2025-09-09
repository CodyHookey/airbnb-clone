import React from "react";
import { handleErrors } from "../utils/fetchHelper";
import Layout from "../layout";

import "./myProperties.scss";

class MyProperties extends React.Component {
  state = {
    properties: [],
    total_pages: null,
    next_page: null,
    loading: true,
    current_page: null,
    prev_page: null,
  };

  componentDidMount() {
    fetch("/api/admin/properties?page=1")
      .then(handleErrors)
      .then((data) => {
        this.setState({
          properties: data.properties,
          total_pages: data.total_pages,
          next_page: data.next_page,
          loading: false,
          current_page: data.current_page,
          prev_page: data.prev_page,
        });
      });
  }

  loadPrev = () => {
    if (this.state.next_page === null) {
      return;
    }

    this.setState({ loading: true });

    fetch(`/api/admin/properties?page=${this.state.prev_page}`)
      .then(handleErrors)
      .then((data) => {
        this.setState({
          properties: data.properties,
          total_pages: data.total_pages,
          next_page: data.next_page,
          loading: false,
          current_page: data.current_page,
          prev_page: data.prev_page,
        });
      });
  };

  loadMore = () => {
    if (this.state.next_page === null) {
      return;
    }

    this.setState({ loading: true });

    fetch(`/api/admin/properties?page=${this.state.next_page}`)
      .then(handleErrors)
      .then((data) => {
        this.setState({
          properties: data.properties,
          total_pages: data.total_pages,
          next_page: data.next_page,
          loading: false,
          current_page: data.current_page,
          prev_page: data.prev_page,
        });
      });
  };

  render() {
    const { properties, next_page, loading } = this.state;
    return (
      <Layout>
        <div className="container pt-4">
          <h4 className="mb-1">Your Properties</h4>
          <p className="text-secondary mb-3">
            Manage all your properties here.
          </p>
          <a href="/add-property" className="primary-btn btn btn-large mb-3">
            Add Property
          </a>
          <div className="row">
            {properties.map((property) => {
              return (
                <div key={property.id} className="col-6 col-lg-4 mb-4 property">
                  <a
                    href={`/property/${property.id}`}
                    className="text-body text-decoration-none"
                  >
                    <div
                      className="property-image mb-1 rounded"
                      style={{
                        backgroundImage: `url(${property.images[0].image_url})`,
                      }}
                    />
                    <p className="text-uppercase mb-0 text-secondary">
                      <small>
                        <b>{property.city}</b>
                      </small>
                    </p>
                    <h6 className="mb-0">{property.title}</h6>
                  </a>
                  <div className="d-flex mt-3">
                    <a
                      className="btn btn-primary me-3"
                      href={`/property/${property.id}/bookings`}
                    >
                      View Bookings
                    </a>
                    <a
                      className="btn btn-danger"
                      href={`/property/edit/${property.id}/`}
                    >
                      Edit Property
                    </a>
                  </div>
                </div>
              );
            })}
          </div>
          {loading && <p>loading...</p>}
          {loading || next_page === null || (
            <div className="text-center">
              <button className="btn btn-light mb-4" onClick={this.loadMore}>
                Previous
              </button>
              <button>{this.state.current_page}</button>
              <button className="btn btn-light mb-4" onClick={this.loadMore}>
                Next
              </button>
            </div>
          )}
        </div>
      </Layout>
    );
  }
}

export default MyProperties;
