import React, { Component } from "react";
import "./App.css";

class Home extends Component {
  BASE_URL = "http://localhost:8001/courses";
  state = {
    show: false,
    data: [],
    rating: 1,
  };
  componentDidMount = () => {
    // Write your code here
    this.handleGetData();
  };

  handleGetData = async () => {
    // Write your code here
    const res = await fetch(this.BASE_URL + "/get");
    this.setState({ data: await res.json() });
  };

  handleApply = async (id) => {
    // Write your code here
    const res = await fetch(this.BASE_URL + "/enroll/" + id, {
      method: "post",
      headers: { "Content-Type": "application/json" },
    });
    const data = await res.json();
    alert(data.message);
    this.handleGetData();
  };

  handleRating = (e) => {
    // Write your code here
    this.setState({ rating: e.target.value });
  };

  handleAddRating = async (id) => {
    // Write your code here
    const res = await fetch(this.BASE_URL + "/rating/" + id, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ rating: this.state.rating }),
    });
    const { error } = await res.json();
    error && alert(error);
    this.handleGetData();
  };

  handleDrop = async (id) => {
    // Write your code here
    const res = await fetch(this.BASE_URL + "/drop/" + id, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
    });
    const data = await res.json();
    alert(data.message);
    this.handleGetData();
  };

  render() {
    return (
      <div className="home">
        <header>
          <h2>ABC Learning</h2>
        </header>
        {/* write your code here */}
        <div className="cardContainer">
          {this.state.data.map((course) => {
            const {
              _id,
              courseName,
              courseDept,
              description,
              isApplied,
              isRated,
              duration,
              noOfRatings,
              rating,
            } = course;
            return (
              <div className="card" key={_id}>
                <ul>
                  <div className="header">
                    <li>{courseName}</li>
                    <li>{courseDept}</li>
                    <li>{description}</li>
                    {isApplied ? (
                      <li>
                        {!isRated && (
                          <li>
                            Rate:
                            <select
                              className="rating"
                              name="rating"
                              onChange={this.handleRating}
                            >
                              <option>1</option>
                              <option>2</option>
                              <option>3</option>
                              <option>4</option>
                              <option>5</option>
                            </select>
                            <button
                              className="rate"
                              onClick={() => {
                                this.handleAddRating(_id);
                              }}
                            >
                              Add
                            </button>
                          </li>
                        )}
                        <button
                          className="drop"
                          onClick={() => {
                            this.handleDrop(_id);
                          }}
                        >
                          Drop Course
                        </button>
                      </li>
                    ) : (
                      <li>
                        <button
                          className="btn"
                          onClick={() => {
                            this.handleApply(_id);
                          }}
                        >
                          Apply
                        </button>
                      </li>
                    )}
                  </div>
                  <div className="footer">
                    <li>
                      {duration} hrs . {noOfRatings} Ratings . {rating}/5
                    </li>
                  </div>
                </ul>
              </div>
            );
          })}
        </div>
      </div>
    );
  }
}

export default Home;
