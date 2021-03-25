import React, { useState, useEffect } from "react";
import { useHistory, useParams } from "react-router-dom";
import { ButtonGroup, ToggleButton} from 'react-bootstrap'
import { SearchBar } from "./SearchBar";
import { SearchResults } from "./SearchResults";

export const Search = () => {
  const history = useHistory();
  const [params] = useState(useParams());
  const [title, setTitle] = useState("");
  const [pendingQuery, setPendingQuery] = useState("");
  const [searchQuery, setSearchQuery] = useState(
    params && params.query !== "" ? params.query : "*"
  );

  // const [pendingFilter, setPendingFilter] = useState("");
  // const [searchFilter, setSearchFilter] = useState(
  //   params && params.query !== "" ? params.query : "*"
  // ); 
  const [searchResults, setSearchResults] = useState({});
  const [isLoading, setLoading] = useState(true);
  const [category, setCategory] = useState(null);
  const [categories, setCategories] = useState([]);

  // update the document title
  useEffect(() => {
    document.title = title;
  }, [title]);

  // // fetch categories on load
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
      const url = `/api/panviva/search?advancedQuery=${query || "*"}&facet=category/name`;
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

    if (searchQuery !== "") {
      searchContent(searchQuery);
      setTitle(`Panviva - Search results for ${searchQuery}`);
    } else {
      searchContent();
      setTitle(`Panviva - Search everything!`);
    }
  }, [searchQuery, history]);

  const executeSearch = () => {
    // maybe do this via history ..?
    let query = pendingQuery || "*";
    // let filter = pendingFilter || "";
    let path = `/search/${query}`;
    history.push(path);
    setSearchQuery(pendingQuery);
  };

  return (
    <>
      <div className="d-flex align-content-center flex-wrap">
      { categories?.length > 0 && 
      <ButtonGroup toggle>
        {categories.map((radio, idx) => {
          console.log(radio);
          return (
            <ToggleButton
              key={idx}
              type="radio"
              //variant="secondary"
              name="radio"
              value={`${radio.key} (${radio.value})`}
              //checked={category === radio.categoryName}
              onChange={(e) => setCategory(e.currentTarget.value)}
            >
              {radio.name}
            </ToggleButton>
          );
        })}
      </ButtonGroup>} 

        <SearchBar
          handleInputChange={(e) => {
            setPendingQuery(e.target.value);
          }}
          executeSearch={executeSearch}
          initalValue={searchQuery}
        />
      </div>
      <SearchResults
        searchResults={searchResults}
        searchQuery={searchQuery}
        isLoading={isLoading}
      />
    </>
  );
};
