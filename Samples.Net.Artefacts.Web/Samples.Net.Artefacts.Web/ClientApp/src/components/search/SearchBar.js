import React from 'react';
import { Button, InputGroup, FormControl } from 'react-bootstrap';
import { Search } from 'react-bootstrap-icons';

export const SearchBar = (props) => (
  <InputGroup className="p-5">
    <FormControl
      size="lg"
      style={{
        borderWidth: 0,
        borderRadius: 0,
        borderBottomWidth: '1px',
      }}
      placeholder="What're you searching for?"
      aria-label="Query"
      onChange={props.handleInputChange}
      onKeyDown={(event) => {
        if (event.key === 'Enter') {
          setTimeout(() => {
            props.executeSearch();
          }, 250);
        }
      }}
      defaultValue={props.initalValue}
    />
    <Button
      onClick={props.executeSearch}
      className="m-2"
      variant="primary"
      type="submit"
    >
      <Search />
    </Button>
    <Button className="m-2" variant="outline-primary" onClick={props.clear}>
      Clear
    </Button>{' '}
  </InputGroup>
);
