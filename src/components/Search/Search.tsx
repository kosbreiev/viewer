import React, { useCallback, useState } from "react";
import { useAbortController } from "../../hooks/useAbortController";
import { Scene, View } from "@novorender/webgl-api";
import { isolateObjects, iterateAsync, showAllObjects, api } from "../../api/NovorenderApi";
import './Search.css'

interface SearchProps {
  scene: Scene;
  view: View;
}

export default function Search({ scene, view }: SearchProps) {
  const [showForm, setShowForm] = useState(false);
  const [error, setError] = useState('');
  const { abortController } = useAbortController();

  const [query, setQuery] = useState("");

  const toggleSearchForm = () => setShowForm(prev => !prev);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
  };

  const getSearchPattern = useCallback(() => {
    return query;
  }, [query]);

  const search = useCallback(async () => {
    const abortSignal = abortController.signal;
    try {
      const iterator = scene.search({ searchPattern: getSearchPattern() }, abortSignal);
      const [nodes] = await iterateAsync({ iterator, abortSignal, count: 50 });
      isolateObjects(scene, nodes);
    } catch (e) {
      if (!abortSignal.aborted) {
        setError('Oops! Something went wrong.');
      }
    }
  }, [getSearchPattern, abortController, scene]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (query.length < 3) {
      showAllObjects(view, scene, api);
      return;
    }
    
    await search();
  };

  return (
    <>
      <button onClick={toggleSearchForm}>Search</button>
      {showForm && (
        <div className="form-container">
          <form className="search-form" onSubmit={handleSubmit}>
            <span>Type to search</span>
            <br />
            <br />
            <input
              name="search"
              id="search"
              type="text"
              value={query}
              onChange={handleSearchChange}
            />
            <button type="submit">Search</button>
          </form>
          {error && <div className="error">{error}</div>}
        </div>
      )}
    </>
  );
}
