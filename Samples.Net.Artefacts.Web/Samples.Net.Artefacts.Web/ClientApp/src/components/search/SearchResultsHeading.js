import React from "react";
import { ProgressBar } from "react-bootstrap";

export const SearchResultsHeading = (props) => {
  return (
    <>
      <div
        className={
          !props.isLoading
            ? "hidden d-flex justify-content-center"
            : "d-flex justify-content-center"
        }
      >
        <h1 className="display-4">
          Loading results for{" "}
          <span className="text-primary">{` ${props.searchQuery} `}</span>
        </h1>
      </div>
      <div className={!props.isLoading ? "hidden" : ""}>
        <ProgressBar animated now={100} label="loading ..." variant="primary" />
      </div>
    </>
  );
};
