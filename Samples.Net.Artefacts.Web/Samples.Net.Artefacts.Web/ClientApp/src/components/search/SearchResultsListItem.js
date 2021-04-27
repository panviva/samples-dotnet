import React, { useState, useRef } from 'react';
import { ListGroup, Card, Button, Overlay, Toast } from 'react-bootstrap';
import { Clipboard } from 'react-bootstrap-icons';
import { toast } from 'react-toastify';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
dayjs.extend(relativeTime);

export const SearchResultsListItem = ({ onMetaDataAdd, searchResults }) => {
  const [show, setShow] = useState(false);
  const target = useRef(null);
  const notify = () => toast.success('Copied to clipboard!');

  const copyToClipboard = async (text) => {
    try {
      await navigator.clipboard.writeText(text);
      toast.success('Copied to clipboard!');
    } catch (err) {
      toast.error('Could not copy text!');
      console.error('Could not copy text: ', err);
    }
  };

  return (
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
                    {item.metaData[metaDatumName].value.map(
                      (metaDatumValue) => (
                        <Button
                          variant="secondary"
                          style={{ margin: '5px' }}
                          onClick={() =>
                            onMetaDataAdd(metaDatumName, metaDatumValue)
                          }
                        >
                          #{metaDatumValue}
                        </Button>
                      )
                    )}
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
            <ListGroup.Item
              className="pl-2 m-2 search-results-list-item"
              action
            >
              <Card>
                <Card.Body>
                  <Card.Title>
                    <span style={{ marginRight: '0.5em' }}>
                      <Button
                        variant="secondary"
                        ref={target}
                        onClick={() => copyToClipboard(simpleContent)}
                      >
                        <Clipboard />
                      </Button>
                    </span>
                    {cardTitle}
                  </Card.Title>
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
