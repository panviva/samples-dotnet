import React from "react";
import { useHistory } from "react-router-dom";

export const DocumentSectionAndSubSectionBody = (props) => {
  const history = useHistory();
  const panvivaCSSclassNames = {
    images: "pv-image",
    tooltips: "pv-tooltip-link",
    links: {
      internal: "pv-internal-link",
    },
  };
  const fixImages = (htmlObject) => {
    let elements = htmlObject?.getElementsByClassName(
      panvivaCSSclassNames.images
    );
    [...elements].forEach((element) => {
      let imageId = element?.getAttribute("data-image-id");
      element.setAttribute("src", `api/panviva/image/${imageId}`);
    });
    return htmlObject;
  };

  const fixTooltips = (htmlObject) => {
    let elements = htmlObject?.getElementsByClassName(
      panvivaCSSclassNames.tooltips
    );
    [...elements].forEach((element) => {
      element.className = "btn btn-secondary btn-sm";
      element.setAttribute("data-bs-toggle", "tooltip");
      element.setAttribute(
        "data-bs-original-title",
        element.getAttribute("title")
      );
    });
    return htmlObject;
  };

  const fixInternalLinks = (htmlObject) => {
    let elements = htmlObject?.getElementsByClassName(
      panvivaCSSclassNames.links.internal
    );
    [...elements].forEach((element) => {
      let documentId = element.getAttribute("data-document-id");
      let sectionId = element.getAttribute("data-section-task-id");
      let link = `/document/${documentId}`;
      if (sectionId) {
        link += `#${sectionId}`;
      }
      element.setAttribute("href", link);
    });
    return htmlObject;
  };
  // todo: fix external links

  // todo: fix image maps

  // todo: fix files

  const getHtml = (body) => {
    var htmlObject = document.createElement("div");
    htmlObject.innerHTML = body;
    htmlObject = fixImages(htmlObject);
    htmlObject = fixTooltips(htmlObject);
    htmlObject = fixInternalLinks(htmlObject);
    return { __html: htmlObject.innerHTML };
  };

  const onProcessedHtmlLinkClick = (e) => {
    const targetLink = e.target.closest("a");
    if (!targetLink) return;
    if (targetLink.getAttribute("data-link-type") === "internal") {
      e.preventDefault();
      let documentId = targetLink.getAttribute("data-document-id");
      let sectionId = targetLink.getAttribute("data-section-task-id");
      let link = `/document/${documentId}`;
      if (sectionId) {
        link += `#${sectionId}`;
      }
      history.push(link);
    }
  };

  return (
    <>
      <div
        className="m-1 p-1"
        onClick={onProcessedHtmlLinkClick}
        dangerouslySetInnerHTML={getHtml(props?.container?.body)}
      />
    </>
  );
};
