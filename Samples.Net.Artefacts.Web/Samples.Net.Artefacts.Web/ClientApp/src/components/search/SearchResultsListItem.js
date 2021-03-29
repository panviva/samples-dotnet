import React from 'react';
import { useHistory } from 'react-router-dom';
import { ListGroup, Card, Button, Badge } from 'react-bootstrap';
import {
  JournalRichtext,
  FileEarmarkText,
  Folder,
  Clipboard,
} from 'react-bootstrap-icons';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
dayjs.extend(relativeTime);

export const SearchResultsListItem = (props) => {
  console.log('my props', props);
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
        const simpleContent = item.content
          .filter((section) => section.mediaType === 'text/plain')
          .map((section) => section.text)
          .join(' ')
          .trim();

        const metaDataBlock = (
          <>
            {Object.keys(item.metaData)
              .filter((metaDatumName) => {
                return item.metaData[metaDatumName].value;
              })
              .map((metaDatumName) => {
                return (
                  <>
                    {item.metaData[metaDatumName].value.map(
                      (metaDatumValue) => (
                        <Button variant="info" style={{ margin: '5px' }}>
                          #{metaDatumValue} <Badge variant="light">9</Badge>
                        </Button>
                      )
                    )}
                  </>
                );
              })}
          </>
        );

        //console.log('block is', metaDataBlock);

        const isLongAnswer = simpleContent.length > 50;
        const cardTitle = isLongAnswer
          ? simpleContent.slice(0, 49).trim().concat('...')
          : simpleContent;
        const cardText = isLongAnswer
          ? '...'.concat(simpleContent.slice(49).trim())
          : '';
        const cardSubtitle = item.primaryQuery;

        return (
          <React.Fragment key={item.id}>
            <ListGroup.Item
              className="pl-2 m-2 search-results-list-item"
              action
              //onClick={() => history.push(getDocumentUrl(item))}
            >
              {/* <div className="d-flex w-100 justify-content-start">
                <div className="p-1">
                  <Clipboard className={'block'} size={25} />
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
              </div> */}
              <Card>
                <Card.Body>
                  <Card.Title>{cardTitle}</Card.Title>
                  <Card.Text>{cardText}</Card.Text>
                  <Card.Subtitle>{cardSubtitle}</Card.Subtitle>
                  <br />
                  {metaDataBlock}
                </Card.Body>
              </Card>
            </ListGroup.Item>
          </React.Fragment>
        );
      })}
    </ListGroup>
  );
};
