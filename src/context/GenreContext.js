/*
 * Assignment create by Group 1
 */
import { createContext, useState } from "react";
const GenreContext = createContext();

const GenreProvider = ({ children }) => {
  const [selectedGenre, setSelectedGenre] = useState("All");

  const value = {
    selectedGenre,
    setSelectedGenre,
  };

  return (
    <GenreContext.Provider value={value}>{children}</GenreContext.Provider>
  );
};

export { GenreContext, GenreProvider };
