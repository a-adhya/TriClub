// context/ApiDataContext.js
import { createContext, useState, useContext, useEffect } from 'react';
import executeStravaLogic from '../pages/api/service';

const ApiDataContext = createContext();

export const ApiDataProvider = ({ children }) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = async () => {
      executeStravaLogic()
      .then((data) => {
        setData(data);
        setLoading(false);
      })
      .catch((error) => {
        setError(error);
        setLoading(false);
      });
  };

  return (
    <ApiDataContext.Provider value={{ data, loading, error, fetchData }}>
      {children}
    </ApiDataContext.Provider>
  );
};

export const useApiData = () => useContext(ApiDataContext);
