import React from "react";
import { handleErrors, safeCredentialsForm } from "../utils/fetchHelper";
import Layout from "../layout";

import "./addProperty.scss";

class AddProperty extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      title: "",
      description: "",
      city: "",
      country: "",
      property_type: "",
      price_per_night: 0,
      max_guests: 0,
      bedrooms: 0,
      beds: 0,
      baths: 0,
      images: [],
    };
  }

  handleChange = (e) => {
    this.setState({ [e.target.name]: e.target.value });
  };

  handleFileChange = (e) => {
    this.setState({ images: Array.from(e.target.files) });
  };

  handleSubmit = (e) => {
    e.preventDefault();

    let formData = new FormData();

    this.state.images.forEach((file) => {
      formData.append("property[images][]", file);
    });

    // Set other params in the form data.
    formData.set("property[title]", this.state.title);
    formData.set("property[description]", this.state.description);
    formData.set("property[city]", this.state.city);
    formData.set("property[country]", this.state.country);
    formData.set("property[property_type]", this.state.property_type);
    formData.set("property[price_per_night]", this.state.price_per_night);
    formData.set("property[max_guests]", this.state.max_guests);
    formData.set("property[bedrooms]", this.state.bedrooms);
    formData.set("property[beds]", this.state.beds);
    formData.set("property[baths]", this.state.baths);

    fetch(
      "/api/properties",
      safeCredentialsForm({
        method: "POST",
        body: formData,
      })
    )
      .then(handleErrors)
      .then((data) => {
        console.log("Property created:", data);
        this.setState({
          title: "",
          description: "",
          city: "",
          country: "",
          property_type: "",
          price_per_night: 0,
          max_guests: 0,
          bedrooms: 0,
          beds: 0,
          baths: 0,
          images: [],
        });
      })
      .catch((error) => {
        console.error("Error creating property:", error);
      });
  };

  render() {
    const {
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
      images,
    } = this.state;

    return (
      <Layout>
        <div className="container row m-auto mt-3 mb-3">
          <h3 className="mb-0">Add a Property:</h3>
          <p className="text-secondary">
            <small>Add a property to your account</small>
          </p>
          <form onSubmit={this.handleSubmit} className="col-12">
            <div className="mb-3">
              <label htmlFor="title" className="form-label">
                Title:
              </label>
              <input
                id="title"
                type="text"
                name="title"
                className="form-control"
                value={title}
                onChange={this.handleChange}
                required
              />
            </div>
            <div className="mb-3">
              <label htmlFor="description" className="form-label">
                Description:
              </label>
              <textarea
                id="description"
                className="form-control"
                rows="3"
                name="description"
                value={description}
                onChange={this.handleChange}
                required
              />
            </div>
            <div className="row mb-3">
              <div className="col-12 col-md-6">
                <label className="form-label" htmlFor="city">
                  City:
                </label>
                <input
                  id="city"
                  className="form-control"
                  type="text"
                  name="city"
                  value={city}
                  onChange={this.handleChange}
                  required
                />
              </div>

              <div className="col-12 col-md-6">
                <label className="form-label" htmlFor="country">
                  Country:
                </label>
                <input
                  id="country"
                  className="form-control"
                  type="text"
                  name="country"
                  value={country}
                  onChange={this.handleChange}
                  required
                />
              </div>
            </div>

            <div className="row mb-3">
              <div className="col-12 col-md-6">
                <label className="form-label" htmlFor="property-type">
                  Property Type:
                </label>
                <input
                  id="property-type"
                  className="form-control"
                  type="text"
                  name="property_type"
                  value={property_type}
                  onChange={this.handleChange}
                  required
                />
              </div>

              <div className="col-12 col-md-6">
                <label className="form-label" htmlFor="price">
                  Price Per Night:
                </label>
                <input
                  id="price"
                  className="form-control"
                  type="number"
                  name="price_per_night"
                  value={price_per_night}
                  onChange={this.handleChange}
                  required
                />
              </div>
            </div>

            <div className="row mb-3">
              <div className="col-12 col-md-6">
                <label className="form-label" htmlFor="guests">
                  Maximum Guests:
                </label>
                <input
                  className="form-control"
                  id="guests"
                  type="number"
                  name="max_guests"
                  value={max_guests}
                  onChange={this.handleChange}
                  required
                />
              </div>

              <div className="col-12 col-md-6">
                <label className="form-label" htmlFor="bedrooms">
                  Bedrooms:
                </label>
                <input
                  className="form-control"
                  id="bedrooms"
                  type="number"
                  name="bedrooms"
                  value={bedrooms}
                  onChange={this.handleChange}
                  required
                />
              </div>
            </div>

            <div className="row mb-3">
              <div className="col-12 col-md-6">
                <label className="form-label" htmlFor="beds">
                  Beds:
                </label>
                <input
                  id="beds"
                  className="form-control"
                  type="number"
                  name="beds"
                  value={beds}
                  onChange={this.handleChange}
                  required
                />
              </div>

              <div className="col-12 col-md-6">
                <label className="form-label" htmlFor="baths">
                  Baths:
                </label>
                <input
                  id="baths"
                  className="form-control"
                  type="number"
                  name="baths"
                  value={baths}
                  onChange={this.handleChange}
                  required
                />
              </div>
            </div>

            <div className="mb-3">
              <label className="form-label">Images:</label>
              <input
                className="form-control"
                type="file"
                multiple
                accept="image/*"
                onChange={this.handleFileChange}
                required
              />
            </div>

            {/* Optional Preview */}
            <div className="preview mb-3 bg-light p-2 rounded">
              <h6>Images Attached:</h6>
              {images.length > 0 &&
                images.map((file, idx) => (
                  <img
                    key={idx}
                    src={URL.createObjectURL(file)}
                    alt="preview"
                    style={{ width: "150px", marginRight: "10px" }}
                    className="rounded"
                  />
                ))}
            </div>

            <button type="submit" className="primary-btn btn w-100">
              Create Property
            </button>
          </form>
        </div>
      </Layout>
    );
  }
}

export default AddProperty;
