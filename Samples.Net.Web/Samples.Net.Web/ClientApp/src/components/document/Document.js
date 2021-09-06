import React, { useState, useEffect } from "react";
import { useParams, useHistory } from "react-router-dom";
import { ProgressBar } from "react-bootstrap";
import { DocumentSection } from "./DocumentSection";
import { DocumentShare } from "./DocumentShare";

export const Document = () => {
  const [history] = useState(useHistory());
  const [params] = useState(useParams());
  const [loading, setLoading] = useState(true);
  const [requestedDocument, setRequestedDocument] = useState();
  const [panvivaDocument, setPanvivaDocument] = useState({
    id: null,
    document: null,
    containers: null,
    relationships: null,
    errors: [],
  });

  useEffect(() => {
    const scrollToHash = (hash) => {
      var element = document.querySelector(
        `[data-link-id="${hash.replace("#", "")}"]`
      );
      if (element) {
        element.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }
    };
    if (history.location.hash && !loading) {
      scrollToHash(history.location.hash);
    }
  }, [history.location.hash, loading]);

  useEffect(() => {
    // Get Document
    const getDocument = async (id) => {
      const documentUrl = `/api/panviva/document/${id}`;
      const containerUrl = `/api/panviva/containers/${id}`;
      const relationshipsUrl = `/api/panviva/container/relationships/${id}`;
      const documentResponse = await fetch(documentUrl);
      const containerResponse = await fetch(containerUrl);
      const relationshipsResponse = await fetch(relationshipsUrl);

      const panvivaDocumentData = await documentResponse.json();
      const containers = await containerResponse.json();
      const relationships = await relationshipsResponse.json();

      if (
        documentResponse.status !== 200 ||
        containerResponse.status !== 200 ||
        relationshipsResponse.status !== 200
      ) {
        let errorMessages = [];
        if (panvivaDocumentData.message) {
          errorMessages.push(
            `Got the following error when requesting ${documentUrl}. \n${panvivaDocumentData?.message}`
          );
        }
        if (containers.message) {
          errorMessages.push(
            `Got the following error when requesting ${containerUrl}. \n${containers?.message}`
          );
        }
        if (relationships.message) {
          errorMessages.push(
            `Got the following error when requesting ${relationshipsUrl}. \n${relationships?.message}`
          );
        }

        setPanvivaDocument({
          id: requestedDocument,
          errors: errorMessages,
        });
        setLoading(false);
      } else {
        setPanvivaDocument({
          id: requestedDocument,
          document: panvivaDocumentData,
          containers: containers?.containers,
          relationships: relationships?.relationships,
          errors: [],
        });
        setLoading(false);
      }
    };

    if (requestedDocument) {
      window.scrollTo(0, 0);
      setLoading(true);
      getDocument(requestedDocument);
    }
  }, [requestedDocument]);

  useEffect(() => {
    if (params?.id) {
      setRequestedDocument(params.id);
    }
  }, [params]);

  useEffect(() => {
    if (
      history.location.pathname &&
      history.location.pathname.indexOf("/document") !== -1
    ) {
      var documentId = history.location.pathname.replace("/document/", "");
      setRequestedDocument(documentId);
    }
  }, [history.location.pathname]);

  // Fetch document content
  useEffect(() => {
    // Set document title
    document.title = loading
      ? "Panviva - Loading ..."
      : `Panviva - ${panvivaDocument?.document?.name} [#${panvivaDocument?.document?.id}]`;
  }, [panvivaDocument, loading]);

  const getSubSections = (children) => {
    let containers = [];

    if (children) {
      children.forEach((item) => {
        containers.push(
          panvivaDocument?.containers?.find(
            (container) => container.id === item
          )
        );
      });
    }
    return containers;
  };

  return (
    <div data-bs-spy="scroll">
      <div className={loading ? "d-block" : "d-none"}>
        <ProgressBar animated now={100} label="loading ..." variant="primary" />
      </div>
      <div
        className={panvivaDocument?.errors?.length > 0 ? "d-block" : "d-none"}
      >
        {panvivaDocument?.errors?.map((error) => {
          return <div className="alert alert-danger">{error}</div>;
        })}
      </div>
      <div
        className={
          !loading && panvivaDocument?.errors?.length === 0
            ? "d-block"
            : "d-none"
        }
      >
        <h1 className="display-4">
          {panvivaDocument?.document?.name}
        </h1>
        <hr />
        <div className="p-1">
          <DocumentShare id={panvivaDocument.id} />
        </div>
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
    </div>
  );
};
