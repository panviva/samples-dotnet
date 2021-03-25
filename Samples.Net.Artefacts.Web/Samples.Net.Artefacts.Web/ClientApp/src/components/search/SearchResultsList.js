import React from "react";
import { SearchResultsListItem } from "./SearchResultsListItem";

export const SearchResultsList = (props) => {
  return (
    <>
      <div
        className={
          props.isLoading
            ? "hidden d-flex justify-content-center"
            : "d-flex justify-content-center"
        }
      >
        <h4>
          Showing
          <span className="text-primary">
            {` ${props.searchResults?.results?.length || 0} `}
          </span>
          results for{" "}
          <span className="text-primary">{` ${props.searchQuery}.`}</span>
        </h4>
      </div>
      <div className={props.isLoading ? "hidden" : ""}>
        <SearchResultsListItem
          searchResults={props.searchResults}
        ></SearchResultsListItem>
      </div>
    </>
  );
};
