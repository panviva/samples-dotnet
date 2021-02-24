import React from "react";
import { DocumentSubSection } from "./DocumentSubSection";
import { DocumentSectionAndSubSectionBody } from "./DocumentSectionAndSubSectionBody";

export const DocumentSection = (props) => {
  return (
    <div className="m-1">
      <h2 id={props.section.id}># {props.section.name}</h2>

      {props?.subSecions.map((subSection) => {
        return (
          <React.Fragment key={`sub-section-${subSection.id}`}>
            <DocumentSubSection subSection={subSection} />
          </React.Fragment>
        );
      })}

      <DocumentSectionAndSubSectionBody container={props.section} />
    </div>
  );
};
