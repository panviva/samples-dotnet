import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import { Search } from "react-bootstrap-icons";
import { SearchBar } from "./search/SearchBar";

export const Home = () => {
  const history = useHistory();
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <div>
      <div
        className="d-flex align-content-center flex-wrap"
        style={{ height: "75vh" }}
      >
        <SearchBar
          handleInputChange={(e) => {
            setSearchQuery(e.target.value);
          }}
          executeSearch={() => {
            let query = searchQuery || "*";
            let path = `/search/${query}`;
            history.push(path);
          }}
        />
      </div>
      <div className="d-flex justify-content-end">
        <p className="p-5 font-weight-light font-style-italic">
          to search for
          {searchQuery && searchQuery !== "" ? " " : " something "}
          <strong className="text-primary">{searchQuery}</strong> click the{" "}
          <Search /> button.
        </p>
      </div>
    </div>
  );
};
