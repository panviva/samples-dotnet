import React, { useState, useEffect } from "react";
import { useHistory, useParams } from "react-router-dom";

export const Error = () => {
  const [params, setParams] = useState(useParams());
  const [message] = useState(
    params && params.message && params.message !== ""
      ? params.message
      : "Undefined error."
  );
  const [status] = useState(
    params && params.status && params.status !== "" ? params.status : "500"
  );

  return (
    <div className="">
      <h1 className="display-3">Error code {status} :(</h1>
      <p className="alert alert-danger lead" role="alert">
        {message}
      </p>
      <p>
        Please resolve the errors based on the exception message above and then
        try again.
      </p>
    </div>
  );
};
