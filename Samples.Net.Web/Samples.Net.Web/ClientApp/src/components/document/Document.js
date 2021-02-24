import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Spinner } from "reactstrap";
import { DocumentSection } from "./DocumentSection";

export const Document = () => {
  // Set document placeholder
  const [panvivaDocument, setPanvivaDocument] = useState({
    id: null,
    loading: true,
    document: null,
    containers: null,
    relationships: null,
  });
  // Retrieve params into a variable
  const [params, setParams] = useState(useParams());

  // Set Params
  useEffect(() => {
    setPanvivaDocument({
      ...panvivaDocument,
      id: params.id,
    });
  }, [params]);

  // Fetch document content
  useEffect(() => {
    // Set document title
    //document.title = "Document id ...";

    // todo: check if id is null ??
    if (panvivaDocument && panvivaDocument.id) {
      getDocument(panvivaDocument.id);
    }
  }, [panvivaDocument.id]);

  // Fetch document content
  useEffect(() => {
    // Set document title
    document.title = panvivaDocument.loading
      ? "Panviva - Loading ..."
      : `Panviva - ${panvivaDocument?.document?.name} [#${panvivaDocument?.document?.id}]`;
  }, [panvivaDocument.document]);

  const getDocument = async (id) => {
    const documentResponse = await fetch(`/api/panviva/document/${id}`);
    const containerResponse = await fetch(`/api/panviva/containers/${id}`);
    const relationshipsResponse = await fetch(
      `/api/panviva/container/relationships/${id}`
    );
    const panvivaDocumentData = await documentResponse.json();
    const containers = await containerResponse.json();
    const relationships = await relationshipsResponse.json();

    setPanvivaDocument({
      ...panvivaDocument,
      document: panvivaDocumentData,
      containers: containers?.containers,
      relationships: relationships?.relationships,
      loading: false,
    });
  };

  // Todo: Cleanup code
  const getHtml = (body) => {
    var htmlObject = document.createElement("div");
    htmlObject.innerHTML = body;
    for (
      let element = 0;
      element < htmlObject?.getElementsByTagName("img").length;
      element++
    ) {
      debugger;
      let imageId = htmlObject
        ?.getElementsByTagName("img")
        [element]?.getAttribute("data-image-id");
      htmlObject
        .getElementsByTagName("img")
        [element].setAttribute("src", `api/panviva/image/${imageId}`);
    }

    return { __html: htmlObject.innerHTML };
  };

  const getSubSections = (children) => {
    let containers = [];

    try {
      for (var key in children) {
        containers.push(
          panvivaDocument?.containers?.find(
            (container) => container.id === children[key]
          )
        );
      }
    } catch (error) {
      console.error(`Error fetching sub-sections`, error);
    }
    return containers;
  };

  // display params on a web page
  return (
    <div>
      <div className={panvivaDocument.loading ? "d-block" : "d-none"}>
        <Spinner style={{ width: "3rem", height: "3rem" }} />
      </div>

      <div className={panvivaDocument.loading ? "d-none" : "d-block"}>
        <h1 className="display-4">{panvivaDocument?.document?.name}</h1>
        <hr />
        <div className="documents">
          {panvivaDocument?.relationships?.map((relationship) => {
            return (
              <React.Fragment key={`section-${relationship.id}`}>
                <DocumentSection
                  relationship={relationship}
                  section={panvivaDocument?.containers?.find(
                    (container) => container.id === relationship.id
                  )}
                  subSecions={getSubSections(relationship?.children)}
                />
              </React.Fragment>
            );
          })}
        </div>
      </div>
      <pre>{JSON.stringify(panvivaDocument, null, 4)}</pre>
    </div>
  );
};
