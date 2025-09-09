import React from "react";
import { handleErrors, safeCredentials } from "./utils/fetchHelper";

import "./layout.scss";

class Layout extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      id: "",
      auth: false,
      propertyOwner: false,
    };

    this.handleClick = this.handleClick.bind(this);
  }

  componentDidMount() {
    this.getAuth();
  }

  getAuth() {
    fetch("/api/authenticated")
      .then(handleErrors)
      .then((data) => {
        console.log("Auth API response:", data);
        this.setState({
          id: data.id,
          auth: data.authenticated,
          propertyOwner: data.property_owner,
        });
      });
  }

  handleClick() {
    fetch(
      `api/users/become-a-host/${this.state.id}`,
      safeCredentials({
        method: "PATCH",
      })
    )
      .then(handleErrors)
      .then((response) => {
        this.setState({
          propertyOwner: response.user.property_owner,
        });
        window.location.reload();
      })
      .catch((error) => {
        console.log(error);
      });
  }

  render() {
    return (
      <>
        <nav className="navbar navbar-expand navbar-light bg-light px-3">
          <div className="container-fluid">
            <a href="/" className="navbar-brand text-danger">
              AirBnB
            </a>
            <div
              className="collapse navbar-collapse"
              id="navbarSupportedContent"
            >
              <ul className="navbar-nav ms-auto">
                <li className="nav-item me-3">
                  <a href="/" className="nav-link">
                    Home
                  </a>
                </li>
                {this.state.auth ? (
                  <li className="nav-item me-3">
                    <a
                      href={`/my-bookings/${this.state.id}`}
                      className="nav-link"
                    >
                      My Bookings
                    </a>
                  </li>
                ) : null}
                {this.state.propertyOwner ? (
                  <li className="nav-item cta-button">
                    <a href="/my-properties" className="nav-link">
                      My Properties
                    </a>
                  </li>
                ) : (
                  <li className="nav-item cta-button">
                    {this.state.auth ? (
                      <a
                        href="#"
                        className="nav-link"
                        onClick={this.handleClick}
                      >
                        Become a Host
                      </a>
                    ) : (
                      <a
                        href={`/login?redirect_url=${window.location.pathname}`}
                        className="nav-link"
                      >
                        Become a Host
                      </a>
                    )}
                  </li>
                )}
              </ul>
            </div>
          </div>
        </nav>
        {this.props.children}
        <footer className="p-3 bg-light">
          <div>
            <p className="me-3 mb-0 text-secondary">AirBnB Clone</p>
          </div>
        </footer>
      </>
    );
  }
}

export default Layout;
