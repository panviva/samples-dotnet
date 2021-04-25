import React from 'react';
import { ListGroup, Card, Button, Badge } from 'react-bootstrap';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
dayjs.extend(relativeTime);

export const SearchResultsListItem = ({ onMetaDataAdd, searchResults }) => (
  <ListGroup variant="flush" defaultActiveKey={1}>
    {searchResults?.results?.map((item) => {
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
                  {item.metaData[metaDatumName].value.map((metaDatumValue) => (
                    <Button
                      variant="secondary"
                      style={{ margin: '5px' }}
                      onClick={() =>
                        onMetaDataAdd(metaDatumName, metaDatumValue)
                      }
                    >
                      #{metaDatumValue}
                    </Button>
                  ))}
                </>
              );
            })}
        </>
      );

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
          <ListGroup.Item className="pl-2 m-2 search-results-list-item" action>
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
