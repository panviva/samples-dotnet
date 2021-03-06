import React from "react";
import { SearchResultsHeading } from "./SearchResultsHeading";
import { SearchResultsList } from "./SearchResultsList";

export const SearchResults = (props) => {
  return (
    <div className="p-1">
      <SearchResultsHeading
        searchQuery={props.searchQuery}
        isLoading={props.isLoading}
      />
      <SearchResultsList
        searchResults={props.searchResults}
        searchQuery={props.searchQuery}
        isLoading={props.isLoading}
      />
    </div>
  );
};
