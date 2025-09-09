import React from "react";
import { safeCredentials, handleErrors } from "../utils/fetchHelper";

class LoginWidget extends React.Component {
  state = {
    email: "",
    password: "",
    error: "",
  };

  handleChange = (event) => {
    this.setState({
      [event.target.name]: event.target.value,
    });
  };

  login = (event) => {
    if (event) {
      event.preventDefault();
    }

    this.setState({
      error: "",
    });

    fetch(
      "/api/sessions",
      safeCredentials({
        method: "POST",
        body: JSON.stringify({
          user: {
            email: this.state.email,
            password: this.state.password,
          },
        }),
      })
    )
      .then(handleErrors)
      .then((data) => {
        if (data.success) {
          const params = new URLSearchParams(window.location.search);
          const redirect_url = params.get("redirect_url") || "/";
          window.location = redirect_url;
        }
      })
      .catch((error) => {
        this.setState({
          error: "Could not log in.",
        });
      });
  };

  render() {
    const { email, password, error } = this.state;

    return (
      <>
        <form onSubmit={this.login}>
          <input
            type="text"
            name="email"
            className="form-control form-control-lg mb-3"
            placeholder="Email"
            value={email}
            onChange={this.handleChange}
            required
          />
          <input
            type="password"
            name="password"
            className="form-control form-control-lg mb-3"
            placeholder="Password"
            value={password}
            onChange={this.handleChange}
            required
          />
          <button type="submit" className="btn btn-danger btn-block btn-lg">
            Log In
          </button>
          {error && <p className="text-danger mt-2">{error}</p>}
        </form>
        <hr />
        <p className="mb-0">
          Don't have an account?{" "}
          <a className="text-primary" onClick={this.props.toggle}>
            Sign Up
          </a>
        </p>
      </>
    );
  }
}

export default LoginWidget;
