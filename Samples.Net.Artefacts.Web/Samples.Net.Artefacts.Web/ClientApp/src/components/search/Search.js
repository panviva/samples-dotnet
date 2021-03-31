import React, { useState, useEffect, useRef } from 'react';
import { useHistory, useParams, useLocation } from 'react-router-dom';
import { ButtonGroup, ToggleButton, Badge } from 'react-bootstrap';
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
  const isInitialMount = useRef(true);
  const history = useHistory();
  const location = useLocation();
  const [params] = useState(useParams());
  const [title, setTitle] = useState('');
  const [pendingQuery, setPendingQuery] = useState('');

  console.log(params.query);
  const [searchQuery, setSearchQuery] = useState(
    params && params.query !== '' ? params.query : '*'
  );
  const [metaData, setMetaData] = useState(
    initFilterStateFromQueryString(location)
  );

  // const [pendingCategory, setPendingCategory] = useState('');
  // const [category, setCategory] = useState(
  //   new URLSearchParams(location.search).get('category')
  // );

  const [searchResults, setSearchResults] = useState({});
  const [isLoading, setLoading] = useState(true);
  // const [categories, setCategories] = useState([]);
  // const [fullCategories, setFullCategories] = useState([]);

  const clear = () => {
    history.push('/');
  };

  const generateAPIQueryStringFromFilterState = () => {
    return Object.keys(metaData).reduce((filterStr, key) => {
      if (!metaData[key]) {
        return '';
      }
      if (filterStr) {
        return filterStr.concat(
          ` and metaData/${key}/values/any(val: search.in(val, '${metaData[
            key
          ].join(', ')}'))`
        );
      } else {
        return `&filter=metaData/${key}/values/any(val: search.in(val, '${metaData[
          key
        ].join(', ')}'))`;
      }
    }, '');
  };

  const generateQueryStringFromFilterState = () => {
    console.log(metaData, 'metadata is');
    return Object.keys(metaData).reduce((filterStr, key) => {
      return (filterStr ?? '').concat(
        metaData[key]?.length > 0
          ? `${filterStr ? '&' : '?'}metaData=${key}:${metaData[key].join(',')}`
          : ''
      );
    }, '');
  };

  const executeSearch = () => {
    // maybe do this via history ..?
    let query = pendingQuery || searchQuery || '*';
    // let filter = pendingFilter || "";
    let path = `/search/${query}${generateQueryStringFromFilterState()}`;
    console.log(path);
    history.push(path);
    setSearchQuery(pendingQuery);
  };

  // update the document title
  useEffect(() => {
    document.title = title;
  }, [title]);

  //refresh on metaData changes
  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
    } else {
      executeSearch();
    }
  }, [metaData, history.push]);

  // useEffect(() => {
  //   if (isInitialMount.current) {
  //     isInitialMount.current = false;
  //   } else {
  //     executeSearch();
  //   }
  // }, [pendingCategory]);

  // fetch categories on load
  // useEffect(() => {
  //   const fetchCategories = async () => {
  //     try {
  //       const url = '/api/panviva/category';
  //       const response = await fetch(url);
  //       const data = await response.json();
  //       setFullCategories(data.categories);
  //     } catch (error) {
  //       let errorMessage = JSON.stringify(error);
  //       let path = `/error/unknown/${errorMessage}`;
  //       console.error(errorMessage);
  //       history.push(path);
  //     }
  //   };
  //   fetchCategories();
  // }, [setFullCategories]);

  // // update filter on category select
  // useEffect(() => {
  //   try {
  //     const url = '/api/panviva/categories';
  //     const response = await fetch(url);
  //     setCategories(response.categories);
  //   } catch (error) {
  //       let errorMessage = JSON.stringify(error);
  //       let path = `/error/unknown/${errorMessage}`;
  //       console.error(errorMessage);
  //       history.push(path);
  //     }
  // }, [setCategories]);

  // lookup content
  useEffect(() => {
    const searchContent = async (query) => {
      const url = `/api/panviva/search?advancedQuery=${
        query || '*'
      }${generateAPIQueryStringFromFilterState()}`;

      try {
        const response = await fetch(url);
        const data = await response.json();
        console.log(data);
        if (response.status !== 200) {
          let errorMessage = `${data.message}`;
          let path = `/error/${response.status}/${errorMessage}`;
          console.error(errorMessage);
          history.push(path);
        } else {
          setSearchResults(data);
          //setCategories(data.facets[0].groups);
        }
        setLoading(false);
      } catch (error) {
        let errorMessage = JSON.stringify(error);
        let path = `/error/unknown/${errorMessage}`;
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
  }, [searchQuery, history]);

  return (
    <>
      <div className="d-flex align-content-center flex-wrap">
        <SearchBar
          handleInputChange={(e) => {
            setPendingQuery(e.target.value);
          }}
          executeSearch={executeSearch}
          initalValue={searchQuery}
          clear={clear}
        />
      </div>
      <div className="d-flex align-content-center flex-wrap">
        {metaData && (
          <SearchFilter
            metaData={metaData}
            onMetaDataDelete={(key, name) => {
              setMetaData({
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
            setMetaData({
              ...metaData,
              [key]: metaData[key].some((val) => val === name)
                ? metaData[key]
                : [...metaData[key], name],
            });
          } else {
            setMetaData({
              ...metaData,
              [key]: [name],
            });
          }
        }}
      />
    </>
  );
};
