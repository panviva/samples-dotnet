import React from 'react';
import { Badge } from 'react-bootstrap';
import { Search, X } from 'react-bootstrap-icons';

export const SearchFilter = (props) => (
  <>
    {Object.keys(props.metaData)
      .filter((metaDatumName) => {
        return props.metaData[metaDatumName];
      })
      .map((metaDatumName) => {
        return (
          <>
            {props.metaData[metaDatumName].map((metaDatumValue) => (
              <Badge variant="secondary" style={{ margin: '5px' }}>
                #{metaDatumValue}
                <X
                  onClick={() =>
                    props.onMetaDataDelete(metaDatumName, metaDatumValue)
                  }
                />
              </Badge>
            ))}
          </>
        );
      })}
  </>
);
