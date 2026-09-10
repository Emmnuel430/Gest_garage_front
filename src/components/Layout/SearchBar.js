import React, { useState, useEffect, useRef } from "react";

const SearchBar = ({
  placeholder = "Recherche...",
  value: controlledValue,
  defaultValue = "",
  onSearch,
  delay = 300,
}) => {
  const [inputValue, setInputValue] = useState(
    controlledValue !== undefined ? controlledValue : defaultValue,
  );
  const onSearchRef = useRef(onSearch);
  const isFirstRender = useRef(true);

  useEffect(() => {
    onSearchRef.current = onSearch;
  }, [onSearch]);

  // Synchronisation si la valeur externe change
  useEffect(() => {
    if (controlledValue !== undefined) {
      setInputValue((prev) => (prev !== controlledValue ? controlledValue : prev));
    }
  }, [controlledValue]);

  useEffect(() => {
    // Évite de déclencher une recherche au premier montage
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }

    const handler = setTimeout(() => {
      if (onSearchRef.current) {
        onSearchRef.current(inputValue);
      }
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [inputValue, delay]);

  const handleChange = (e) => {
    setInputValue(e.target.value);
  };

  return (
    <form
      className="d-flex my-4 position-relative align-items-center"
      onSubmit={(e) => e.preventDefault()}
    >
      <input
        type="search"
        className="form-control border pe-5"
        placeholder={placeholder}
        value={inputValue}
        onChange={handleChange}
      />
    </form>
  );
};

export default SearchBar;
