import React from "react";
import { Link45deg } from "react-bootstrap-icons";
import { DocumentSubSection } from "./DocumentSubSection";
import { DocumentSectionAndSubSectionBody } from "./DocumentSectionAndSubSectionBody";

export const DocumentSection = (props) => (
  <div className="m-1">
    <h2 className="containerHeader">
      <Link45deg />
      {props?.section?.name}
    </h2>

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
