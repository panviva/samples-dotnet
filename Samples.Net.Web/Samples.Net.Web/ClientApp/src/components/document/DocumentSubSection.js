import React from "react";
import { DocumentSectionAndSubSectionBody } from "./DocumentSectionAndSubSectionBody";

export const DocumentSubSection = (props) => {
  return (
    <div className="p-2">
      <DocumentSectionAndSubSectionBody container={props.subSection} />
    </div>
  );
};
