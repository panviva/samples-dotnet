import React, { useState, useEffect, useRef } from 'react';
import { useHistory, useParams, useLocation } from 'react-router-dom';
import { ButtonGroup, ToggleButton, Badge } from 'react-bootstrap';
import { SearchBar } from './SearchBar';
import { SearchResults } from './SearchResults';

export const Search = () => {
  const isInitialMount = useRef(true);
  const history = useHistory();
  const location = useLocation();
  const [params] = useState(useParams());
  const [title, setTitle] = useState('');
  const [pendingQuery, setPendingQuery] = useState('');
  const [searchQuery, setSearchQuery] = useState(
    params && params.query !== '' ? params.query : '*'
  );

  const [pendingCategory, setPendingCategory] = useState('');
  const [category, setCategory] = useState(
    new URLSearchParams(location.search).get('category')
  );

  const [searchResults, setSearchResults] = useState({});
  const [isLoading, setLoading] = useState(true);
  const [categories, setCategories] = useState([]);
  const [fullCategories, setFullCategories] = useState([]);

  // update the document title
  useEffect(() => {
    document.title = title;
  }, [title]);

  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
    } else {
      executeSearch();
    }
  }, [pendingCategory]);

  // fetch categories on load
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const url = '/api/panviva/category';
        const response = await fetch(url);
        const data = await response.json();
        setFullCategories(data.categories);
      } catch (error) {
        let errorMessage = JSON.stringify(error);
        let path = `/error/unknown/${errorMessage}`;
        console.error(errorMessage);
        history.push(path);
      }
    };
    fetchCategories();
  }, [setFullCategories]);

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
      }&facet=category/name&filter=${
        category ? `category/name eq '${category}'` : ``
      }`;

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
          setCategories(data.facets[0].groups);
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

  const executeSearch = () => {
    // maybe do this via history ..?
    let query = pendingQuery || '*';
    // let filter = pendingFilter || "";
    let path = `/search/${query}?category=${pendingCategory}`;
    history.push(path);
    setSearchQuery(pendingQuery);
    setCategory(pendingCategory);
  };

  return (
    <>
      <div className="d-flex align-content-center flex-wrap">
        <SearchBar
          handleInputChange={(e) => {
            setPendingQuery(e.target.value);
          }}
          executeSearch={executeSearch}
          initalValue={searchQuery}
        />
        {/* {categories?.length > 0 && (
          <ButtonGroup toggle>
            {categories.map((radio, idx) => {
              //console.log(radio);
              return (
                <ToggleButton
                  key={idx}
                  type="radio"
                  variant="secondary"
                  name="radio"
                  value={radio.key}
                  checked={category === radio.key}
                  onChange={(e) => setPendingCategory(e.currentTarget.value)}
                >
                  {`${radio.key} (${radio.value})`}
                </ToggleButton>
              );
            })}
          </ButtonGroup>
        )} */}
        {/* {fullCategories?.length > 0 && (
          <ButtonGroup toggle>
            {fullCategories.map((radio, idx) => {
              //console.log(radio);
              return (
                <ToggleButton
                  key={idx}
                  type="radio"
                  variant="secondary"
                  name="radio"
                  value={radio.key}
                  checked={category === radio.key}
                  onChange={(e) => setPendingCategory(e.currentTarget.value)}
                >
                  {`${radio.key} (${radio.value})`}
                </ToggleButton>
              );
            })}
          </ButtonGroup>
        )} */}
      </div>
      <SearchResults
        searchResults={searchResults}
        searchQuery={searchQuery}
        isLoading={isLoading}
      />
    </>
  );
};
