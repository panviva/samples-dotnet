import React, { useState, useEffect } from "react";
import { useHistory, useParams } from "react-router-dom";
import { SearchBar } from "./SearchBar";
import { SearchResults } from "./SearchResults";

export const Search = () => {
  const history = useHistory();
  const [params, setParams] = useState(useParams());
  const [title, setTitle] = useState("");
  const [pendingQuery, setPendingQuery] = useState("");
  const [searchQuery, setSearchQuery] = useState(
    params && params.query !== "" ? params.query : "*"
  );
  const [searchResults, setSearchResults] = useState({});
  const [isLoading, setLoading] = useState(true);

  // update the document title
  useEffect(() => {
    document.title = title;
  }, [title]);

  // lookup content
  useEffect(() => {
    setLoading(true);
    if (searchQuery !== "") {
      searchContent(searchQuery);
      setTitle(`Panviva - Search results for ${params.query}`);
    } else {
      searchContent();
      setTitle(`Panviva - Search everything!`);
    }
  }, [searchQuery]);

  // Run panviva search
  const searchContent = async (query) => {
    const url = `/api/panviva/search/${query || "*"}`;
    try {
      const response = await fetch(url);
      const data = await response.json();
      setSearchResults(data);
      setLoading(false);
    } catch (error) {
      console.log(`error when fetching ${url}`, error);
    }
  };

  return (
    <>
      <div className="d-flex align-content-center flex-wrap">
        <SearchBar
          handleInputChange={(e) => {
            setPendingQuery(e.target.value);
          }}
          executeSearch={() => {
            // maybe do this via history ..?
            let query = pendingQuery || "*";
            let path = `/search/${query}`;
            history.push(path);
            setSearchQuery(pendingQuery);
          }}
          initalValue={searchQuery}
        />
      </div>
      <SearchResults
        searchResults={searchResults}
        searchQuery={searchQuery}
        isLoading={isLoading}
      />
    </>
  );
};
