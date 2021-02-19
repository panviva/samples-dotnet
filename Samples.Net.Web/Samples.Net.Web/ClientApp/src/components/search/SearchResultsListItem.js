import React from "react";
import { ListGroup } from "react-bootstrap";
import Moment from "react-moment";
import {
  JournalRichtext,
  FileEarmarkText,
  Folder,
} from "react-bootstrap-icons";

export const SearchResultsListItem = (props) => {
  const getDocumentUrl = (item) => {
    if (item.type === "document") {
      return item && item.id ? `/document/${item.id}` : "#";
    } else if (item.type === "file") {
      return item && item.id ? `/api/panviva/file/${item.id}` : "#";
    } else if (item.type === "image") {
      return item && item.id ? `/api/panviva/image/${item.id}` : "#";
    }
    return "#";
  };

  const getFirstDocumentUrl = () => {
    if (
      props &&
      props.searchResults &&
      props.searchResults.results &&
      props.searchResults.results.length > 0
    ) {
      return getDocumentUrl(props.searchResults.results[0]);
    }
  };
  return (
    <ListGroup variant="flush" defaultActiveKey={getFirstDocumentUrl()}>
      {props.searchResults?.results?.map((item) => {
        return (
          <React.Fragment key={item.id}>
            <ListGroup.Item
              className="pl-2 m-2 search-results-list-item"
              action
              href={getDocumentUrl(item)}
            >
              <div className="d-flex w-100 justify-content-start">
                <div className="p-1">
                  <JournalRichtext
                    className={item.type != "document" ? "hidden" : "block"}
                    size={50}
                  />
                  <FileEarmarkText
                    className={item.type != "file" ? "hidden" : "block"}
                    size={50}
                  />
                  <Folder
                    className={item.type != "folder" ? "hidden" : "block"}
                    size={50}
                  />
                </div>

                <div className="pl-2">
                  <h5 className="mb-1 text-secondary">{item.name}</h5>
                  <p className="lead">{item.descripton}</p>
                  <p className="font-italic">
                    <span className="text-capitalize">{item.type}</span>
                    {` #[${item.id}] was last updated `}
                    <Moment fromNow>{item?.updatedDate}</Moment>
                  </p>
                </div>
              </div>
            </ListGroup.Item>
          </React.Fragment>
        );
      })}
    </ListGroup>
  );
};
