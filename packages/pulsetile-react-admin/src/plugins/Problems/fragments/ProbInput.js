import React, { Component } from "react";
import AsyncSelect from "react-select/lib/Async";
//import { stateOptions } from "./docs/data";

export default class SingleSelect extends Component {
  constructor(props) {
    super(props);
    this.state = { stateOptions: [] };
  }

  getAsyncOptions(inputValue) {
    console.log(inputValue);
    console.log(this.state);
    const myHeaders = new Headers();
    let url = `https://cpcr01.tcd.ie/snomedapi/api/v1/medication_catalog/search/elastic/ipu_vtm/${inputValue}`;
    myHeaders.append("Content-Type", "application/json");
    myHeaders.append(
      "Authorization",
      "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6Im1lZGljYXRpb25fY2F0YWxvZ0B0ZXN0LmNvbSIsIl9pZCI6IjVkOGIzMTA2N2VhNDBjNTM2NDQ4MTY1OCIsImlhdCI6MTU2OTQ4ODQ0NywiZXhwIjoxNjAxMDI0NDQ3fQ.nzvZ999pcagZbp2OfzrIWqS8fDkxeYm3rYsefO4YZDI"
    );

    fetch(url, {
      method: "GET",
      headers: myHeaders
    }).then(response => {
      if (response.status === 200) {
        response.json().then(data => {
          if (data.hits !== undefined) {
            const snomedItems = data.hits.hits.map(element => {
              return {
                value: element._id,
                label: element._source.NM
              };
            });
            this.setState(
              {
                stateOptions: snomedItems
              },
              function() {
                // setState is asynchronous! This function gets called
                // when it's finished.
                console.log("Job's done");
                console.log(this.state);
                console.log(snomedItems);
              }
            );
          }
        });
      }
    });

    return new Promise((resolve, reject) => {
      //const filtered = _.filter(this.state.stateOptions, o =>
      //  _.startsWith(_.toLower(o.label), _.toLower(inputValue))
      //);
      //resolve(this.state.stateOptions);
      setTimeout(() => resolve(this.state.stateOptions), 300);
    });
  }

  componentDidUpdate() {}

  render() {
    return (
      <div>
        <AsyncSelect
          cacheOptions
          defaultOptions
          isClearable
          className="basic-single"
          classNamePrefix="select"
          name="search"
          loadOptions={inputValue => this.getAsyncOptions(inputValue)}
        />
      </div>
    );
  }
}
