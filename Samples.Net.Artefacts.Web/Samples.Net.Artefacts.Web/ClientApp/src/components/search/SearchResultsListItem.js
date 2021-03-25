import React from "react";
import { useHistory } from "react-router-dom";
import { ListGroup } from "react-bootstrap";
import {
  JournalRichtext,
  FileEarmarkText,
  Folder,
} from "react-bootstrap-icons";
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
dayjs.extend(relativeTime);

export const SearchResultsListItem = (props) => {
  console.log("my props", props);
  const history = useHistory();
  // const getDocumentUrl = (item) => {
  //   if (item.type === "document") {
  //     return item && item.id ? `/document/${item.id}` : "#";
  //   } else if (item.type === "file") {
  //     return item && item.id ? `/api/panviva/file/${item.id}` : "#";
  //   } else if (item.type === "image") {
  //     return item && item.id ? `/api/panviva/image/${item.id}` : "#";
  //   }
  //   return "#";
  // };

  // const getFirstDocumentUrl = () => {
  //   if (props?.searchResults?.results?.length > 0) {
  //     return getDocumentUrl(props.searchResults.results[0]);
  //   }
  // };
  
  return (
    //<ListGroup variant="flush" defaultActiveKey={getFirstDocumentUrl()}>
    <ListGroup variant="flush" defaultActiveKey={1}>
      {props.searchResults?.results?.map((item) => {
        return (
          <React.Fragment key={item.id}>
            <ListGroup.Item
              className="pl-2 m-2 search-results-list-item"
              action
              //onClick={() => history.push(getDocumentUrl(item))}
            >
              <div className="d-flex w-100 justify-content-start">
                <div className="p-1">
                  <JournalRichtext
                    className={"block"}
                    size={50}
                  />
                </div>

                <div className="pl-2">
                  <h5 className="mb-1 text-secondary">{item.title}</h5>
                  <p className="lead">{item.primaryQuery}</p>
                  <p className="font-italic">
                    <span className="text-capitalize">Response</span>
                    {` #[${item.id}] was last updated `}
                    {dayjs(item?.updatedDate).fromNow()}
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
