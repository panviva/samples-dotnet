import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Input, Spinner } from "reactstrap";
import Moment from "react-moment";

const Search = () => {
  // Retrieve params into a variable
  const [params, setParams] = useState(useParams());
  const [isDebugEnabled, setDebugEnabledStatus] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState({});
  const [isLoading, setLoading] = useState(true);

  // Set params
  useEffect(() => {
    document.title = "Panviva - Search";
    setSearchQuery(params.query);
    setLoading(false);
  }, [params]);

  // Run panviva search
  const searchContent = async (query) => {
    const response = await fetch(`/api/panviva/search/${query}`);
    const data = await response.json();
    setSearchResults(data);
    setLoading(false);
  };

  return (
    <div>
      <div className={isLoading ? "d-block" : "d-none"}>
        <Spinner style={{ width: "3rem", height: "3rem" }} />
      </div>
      <div className="text-right">
        <Input
          type="checkbox"
          checked={isDebugEnabled}
          onClick={() => setDebugEnabledStatus(!isDebugEnabled)}
        />{" "}
        debug
      </div>
      <form
        className={isLoading ? "d-none" : "d-block"}
        onSubmit={(event) => {
          searchContent(searchQuery);
          event.preventDefault();
          event.stopPropagation();
        }}
      >
        <div class="form-row align-items-center">
          <div class="col-lg-9 my-1">
            <label class="sr-only">Search</label>
            <div class="input-group">
              <div class="input-group-prepend">
                <div class="input-group-text" role="img">
                  🔎
                </div>
              </div>
              <input
                type="text"
                class="form-control form-control-lg"
                placeholder="Search .."
                value={searchQuery}
                onChange={(event) => {
                  setSearchQuery(event.target.value);
                  event.preventDefault();
                }}
              />
            </div>
          </div>
          <div class="col-auto my-1">
            <button type="submit" class="btn btn-primary">
              Search
            </button>
          </div>
        </div>
      </form>
      <div>
        <h2>
          Results for "{searchQuery}" ...{" "}
          <span class="badge badge-primary badge-pill">
            {searchResults?.results?.length}
          </span>
        </h2>

        <div class="list-group">
          {searchResults?.results?.map((item) => {
            return (
              <a
                href={`/document/${item.id}`}
                class="list-group-item list-group-item-action"
                target="_blank"
              >
                <div class="d-flex w-100 justify-content-between">
                  <h5 class="mb-1">{item.name}</h5>
                  <small>#{item.id}</small>
                </div>
                <p class="mb-1">
                  Last edited on{" "}
                  <Moment format="dddd, MMM Do YYYY, h:mm:ss a zz">
                    {item?.updatedDate}
                  </Moment>
                </p>
                <small>#{item.type}</small>
              </a>
            );
          })}
        </div>
      </div>
      <pre className={isDebugEnabled ? "d-block" : "d-none"}>
        {JSON.stringify(searchResults, null, 4)}
      </pre>
    </div>
  );
};

export default Search;
