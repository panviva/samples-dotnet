import React from "react";

export const DocumentSectionAndSubSectionBody = (props) => {
  const fixImages = (htmlObject) => {
    let panvivaImages = htmlObject?.getElementsByTagName("img");
    for (let idx = 0; idx < panvivaImages.length; idx++) {
      let imageId = panvivaImages[idx]?.getAttribute("data-image-id");
      panvivaImages[idx].setAttribute("src", `api/panviva/image/${imageId}`);
    }
    return htmlObject;
  };

  const fixTooltips = (htmlObject) => {
    let tooltipClassName = "pv-tooltip-link";
    let tooltipElements = htmlObject?.getElementsByClassName(tooltipClassName);
    for (let idx = 0; idx < tooltipElements.length; idx++) {
      tooltipElements[idx].setAttribute("data-toggle", "tooltip");
      tooltipElements[idx].setAttribute("data-placement", "top");
      tooltipElements[idx].setAttribute("href", "#");
    }

    return htmlObject;
  };

  // todo: fix internal links

  // todo: fix external links

  // todo: fix image maps

  const getHtml = (body) => {
    var htmlObject = document.createElement("div");
    htmlObject.innerHTML = body;
    htmlObject = fixImages(htmlObject);
    htmlObject = fixTooltips(htmlObject);
    return { __html: htmlObject.innerHTML };
  };

  return (
    <>
      <div
        className="m-1 p-1"
        dangerouslySetInnerHTML={getHtml(props?.container?.body)}
      />
    </>
  );
};
