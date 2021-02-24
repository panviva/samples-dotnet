import React from "react";
import { DocumentSectionAndSubSectionBody } from "./DocumentSectionAndSubSectionBody";

export const DocumentSubSection = (props) => {
  return (
    <div className="p-2">
      <h5 id={props.subSection.id}>{props.subSection.name}</h5>
      <DocumentSectionAndSubSectionBody container={props.subSection} />
    </div>
  );
};
