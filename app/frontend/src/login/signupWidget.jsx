import React from "react";
import { safeCredentials, handleErrors } from "../utils/fetchHelper";

class SignupWidget extends React.Component {
  state = {
    email: "",
    password: "",
    username: "",
    error: "",
  };

  handleChange = (event) => {
    this.setState({
      [event.target.name]: event.target.value,
    });
  };

  signup = (event) => {
    if (event) {
      event.preventDefault();
    }
    this.setState({
      error: "",
    });

    fetch(
      "/api/users",
      safeCredentials({
        method: "POST",
        body: JSON.stringify({
          user: {
            email: this.state.email,
            password: this.state.password,
            username: this.state.username,
          },
        }),
      })
    )
      .then(handleErrors)
      .then((data) => {
        if (data.user) {
          this.login();
        }
      })
      .catch((error) => {
        this.setState({
          error: "Could not sign up.",
        });
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
    const { email, password, username, error } = this.state;

    return (
      <>
        <form onSubmit={this.signup}>
          <input
            type="text"
            name="username"
            className="form-control form-control-lg mb-3"
            placeholder="Username"
            value={username}
            onChange={this.handleChange}
            required
          />
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
            Sign Up
          </button>
        </form>
        <hr />
        <p className="mb-0">
          Already have an account?{" "}
          <a className="text-primary" onClick={this.props.toggle}>
            Log In
          </a>
        </p>
      </>
    );
  }
}

export default SignupWidget;
