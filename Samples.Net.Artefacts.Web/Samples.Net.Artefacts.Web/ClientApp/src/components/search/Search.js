import React, { useState, useEffect } from 'react';
import { useHistory, useParams, useLocation } from 'react-router-dom';
import { SearchBar } from './SearchBar';
import { SearchFilter } from './SearchFilter';
import { SearchResults } from './SearchResults';

const initFilterStateFromQueryString = (windowLocation) => {
  const searchParams = new URLSearchParams(windowLocation.search);
  const queryMetadataArray = searchParams.getAll('metaData');
  return (
    queryMetadataArray?.reduce((metaDataObj, metaDataStr, idx) => {
      const [metaDataKey, metaDataValuesStr] = metaDataStr.split(':');
      const metaDataValues = metaDataValuesStr.split(',');

      metaDataObj[metaDataKey] = metaDataValues;
      return metaDataObj;
    }, {}) ?? {}
  );
};

export const Search = () => {
  const history = useHistory();
  const location = useLocation();
  const [params] = useState(useParams());
  const [title, setTitle] = useState('');
  const [pendingQuery, setPendingQuery] = useState(
    params && params.query !== '' ? params.query : '*'
  );

  const [searchQuery] = useState(
    params && params.query !== '' ? params.query : '*'
  );
  const [metaData] = useState(initFilterStateFromQueryString(location));

  const [searchResults, setSearchResults] = useState({});
  const [isLoading, setLoading] = useState(true);

  const clear = () => {
    history.push('/');
  };

  const generateAPIQueryStringFromFilterState = () =>
    Object.keys(metaData).reduce((filterStr, key) => {
      if (!metaData[key]) {
        return '';
      }
      if (filterStr) {
        return filterStr.concat(
          ` and metaData/${key}/values/any(val: search.in(val, '${metaData[
            key
          ].join(',')}', ','))`
        );
      } else {
        return `&filter=metaData/${key}/values/any(val: search.in(val, '${metaData[
          key
        ].join(',')}', ','))`;
      }
    }, '');

  const generateQueryStringFromFilterState = (newMetaData) =>
    Object.keys(newMetaData).reduce(
      (filterStr, key) =>
        (filterStr ?? '').concat(
          newMetaData[key]?.length > 0
            ? `${filterStr ? '&' : '?'}metaData=${key}:${newMetaData[key].join(
                ','
              )}`
            : ''
        ),
      ''
    );

  const executeSearch = (newMetaData = metaData) => {
    const query = pendingQuery || searchQuery || '*';
    const path = `/search/${query}${generateQueryStringFromFilterState(
      newMetaData
    )}`;

    history.push(path);
  };

  // update the document title
  useEffect(() => {
    document.title = title;
  }, [title]);

  // lookup content
  useEffect(() => {
    const searchContent = async (query) => {
      const url = `/api/panviva/search?advancedQuery=${
        query || '*'
      }${generateAPIQueryStringFromFilterState()}`;

      try {
        const response = await fetch(url);
        const data = await response.json();

        if (response.status !== 200) {
          const errorMessage = `${data.message}`;
          const path = `/error/${response.status}/${errorMessage}`;
          console.error(errorMessage);
          history.push(path);
        } else {
          setSearchResults(data);
        }

        setLoading(false);
      } catch (error) {
        const errorMessage = JSON.stringify(error);
        const path = `/error/unknown/${errorMessage}`;
        console.error(errorMessage);
        history.push(path);
      }
    };

    setLoading(true);

    if (searchQuery !== '') {
      searchContent(searchQuery);
      setTitle(`Panviva - Search results for ${searchQuery}`);
    } else {
      searchContent();
      setTitle(`Panviva - Search everything!`);
    }
  }, [searchQuery, metaData, history]);

  return (
    <>
      <div className="d-flex align-content-center flex-wrap">
        <SearchBar
          handleInputChange={(e) => {
            setPendingQuery(e.target.value);
          }}
          executeSearch={() => executeSearch()}
          initalValue={searchQuery}
          clear={clear}
        />
      </div>
      <div className="d-flex align-content-center flex-wrap">
        {metaData && (
          <SearchFilter
            metaData={metaData}
            onMetaDataDelete={(key, name) => {
              executeSearch({
                ...metaData,
                [key]: metaData[key].filter((value) => value !== name),
              });
            }}
          />
        )}
      </div>
      <SearchResults
        searchResults={searchResults}
        searchQuery={searchQuery}
        isLoading={isLoading}
        onMetaDataAdd={(key, name) => {
          if (metaData[key]) {
            executeSearch({
              ...metaData,
              [key]: metaData[key].some((val) => val === name)
                ? metaData[key]
                : [...metaData[key], name],
            });
          } else {
            executeSearch({
              ...metaData,
              [key]: [name],
            });
          }
        }}
      />
    </>
  );
};
