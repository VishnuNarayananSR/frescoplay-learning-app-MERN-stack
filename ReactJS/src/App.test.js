import Enzyme from "enzyme";
import Adapter from "enzyme-adapter-react-16";
import React from "react";
import { shallow } from "enzyme";
import App from "./App.js";

console.log("check");

Enzyme.configure({ adapter: new Adapter() });

describe("App component", () => {
  let component;

  beforeEach(() => {
    const mockJsonPromise = Promise.resolve([]); // 2
    const mockFetchPromise = Promise.resolve({
      json: () => mockJsonPromise,
    });
    jest.spyOn(global, "fetch").mockImplementation(() => mockFetchPromise); // 4
    window.alert = jest.fn();

    component = shallow(<App />);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("routes check", async () => {
    expect(global.fetch).toHaveBeenCalledTimes(1);
    expect(global.fetch).toHaveBeenCalledWith(
      "http://localhost:8001/courses/get"
    );
    global.fetch.mockClear();
  });

  it("data map check", () => {
    const data = [
      {
        _id: "5ff5706baf74d71378df935f",
        courseName: "Node.js",
        courseDept: "WD",
        description: "Node.js is used to create back-end services",
        duration: 10,
        isRated: false,
        isApplied: true,
        noOfRatings: 15,
        rating: 4.5,
      },
      {
        _id: "5ff5706baf74d71378df9360",
        courseName: "React.js",
        courseDept: "WD",
        description: "React.js is used to create front-end services",
        duration: 14,
        isRated: true,
        isApplied: true,
        noOfRatings: 145,
        rating: 4.3,
      },
      {
        _id: "5ff5706baf74d71378df9361",
        courseName: "Angular",
        courseDept: "WD",
        description: "Angular is used to create front-end services",
        duration: 18,
        isRated: true,
        isApplied: false,
        noOfRatings: 10,
        rating: 4.1,
      },
    ];
    component.instance().setState({ data });

    expect(component.find("ul").at(0).find("li").at(0).text()).toBe("Node.js");
    expect(component.find("ul").at(0).find("li").at(1).text()).toBe("WD");
    expect(component.find("ul").at(0).find("li").at(2).text()).toBe(
      "Node.js is used to create back-end services"
    );
    expect(component.find("ul").at(0).find("li").at(5).text()).toBe(
      "10 hrs . 15 Ratings . 4.5/5"
    );

    expect(component.find("ul").at(1).find("li").at(0).text()).toBe("React.js");
    expect(component.find("ul").at(1).find("li").at(1).text()).toBe("WD");
    expect(component.find("ul").at(1).find("li").at(2).text()).toBe(
      "React.js is used to create front-end services"
    );
    expect(component.find("ul").at(1).find("li").at(4).text()).toBe(
      "14 hrs . 145 Ratings . 4.3/5"
    );

    expect(component.find("ul").at(2).find("li").at(0).text()).toBe("Angular");
    expect(component.find("ul").at(2).find("li").at(1).text()).toBe("WD");
    expect(component.find("ul").at(2).find("li").at(2).text()).toBe(
      "Angular is used to create front-end services"
    );
    expect(component.find("ul").at(2).find("li").at(4).text()).toBe(
      "18 hrs . 10 Ratings . 4.1/5"
    );
  });

  it("Add rating Check", () => {
    const data = [
      {
        _id: "5ff5706baf74d71378df935f",
        courseName: "Node.js",
        courseDept: "WD",
        description: "Node.js is used to create back-end services",
        duration: 10,
        isRated: false,
        isApplied: true,
        noOfRatings: 15,
        rating: 4.5,
      },
    ];
    component.instance().setState({ data });

    const addRating = component
      .find("ul")
      .at(0)
      .find("li")
      .at(3)
      .find("li")
      .at(0)
      .find(".rate")
      .find("button");
    addRating.simulate("click");
    component
      .find(".rating")
      .simulate("change", { target: { name: "rating", value: 5 } });
    expect(component.state().rating).toBe(5);

    //patch

    let spy = jest.spyOn(component.instance(), "handleAddRating");
    spy();
    expect(global.fetch).toHaveBeenCalledTimes(3);
    expect(global.fetch).toHaveBeenCalledWith(
      "http://localhost:8001/courses/rating/5ff5706baf74d71378df935f",
      {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: '{"rating":1}',
      }
    );
    global.fetch.mockClear();
  });

  it("Apply check", async () => {
    const data = [
      {
        _id: "5ff5706baf74d71378df935f",
        courseName: "Node.js",
        courseDept: "WD",
        description: "Node.js is used to create back-end services",
        duration: 10,
        isRated: false,
        isApplied: false,
        noOfRatings: 15,
        rating: 4.5,
      },
    ];
    component.instance().setState({ data });

    const apply = component.find("ul").at(0).find("li").at(3).find(".btn");
    apply.simulate("click");
    let spy = jest.spyOn(component.instance(), "handleApply");
    await spy();
    expect(spy).toHaveBeenCalledTimes(1);
    expect(global.fetch).toHaveBeenCalledTimes(5);
    expect(global.fetch).toHaveBeenCalledWith(
      "http://localhost:8001/courses/enroll/5ff5706baf74d71378df935f",
      {
        method: "post",
        headers: { "Content-Type": "application/json" },
      }
    );
    let spy1 = jest.spyOn(component.instance(), "handleGetData");
    spy1();
    expect(spy1).toHaveBeenCalledTimes(1);
    global.fetch.mockClear();
  });

  it("drop rating Check", () => {
    const data = [
      {
        _id: "5ff5706baf74d71378df935f",
        courseName: "Node.js",
        courseDept: "WD",
        description: "Node.js is used to create back-end services",
        duration: 10,
        isRated: true,
        isApplied: true,
        noOfRatings: 15,
        rating: 4.5,
      },
    ];
    component.instance().setState({ data });

    const addRating = component.find("ul").at(0).find("li").at(3).find(".drop");
    addRating.simulate("click");

    //delete

    let spy = jest.spyOn(component.instance(), "handleDrop");
    spy();
    window.alert = jest.fn();
    expect(global.fetch).toHaveBeenCalledTimes(3);
    expect(global.fetch).toHaveBeenCalledWith(
      "http://localhost:8001/courses/drop/5ff5706baf74d71378df935f",
      {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
      }
    );
    window.alert.mockClear();
    global.fetch.mockClear();
  });
});
