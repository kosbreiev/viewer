import { useCallback, useEffect, useRef, useState } from "react";

/**
 * useAbortController - A custom React hook to provide an AbortController and its related functionalities.
 * This hook aids in aborting fetch requests or any other abortable operations.
 * See https://developer.mozilla.org/en-US/docs/Web/API/AbortController
 * 
 * @returns {Object}
 *   @property {AbortController} abortController An instance of AbortController which can be used to signal the aborting of an operation.
 *   @property {Function} abort A function to manually trigger the aborting of an operation.
 *   @property {boolean} isAborted State indicating if the operation has been aborted.
 * 
 * @example
 * const { abortController, abort, isAborted } = useAbortController();
 * fetch(url, { signal: abortController.signal });
 */
export const useAbortController = () => {
  // Reference to the AbortController instance
  const abortController = useRef(new AbortController());
  
  // State to track if the operation has been aborted
  const [isAborted, setIsAborted] = useState(false);

  /**
   * abort - Aborts the current operation, resets the abortController instance and the isAborted state.
   */
  const abort = useCallback(() => {
    if (!isAborted) {
      abortController.current.abort();
      setIsAborted(true);
    }
    abortController.current = new AbortController();
    setIsAborted(false);
  }, [isAborted]);

  // Effect to abort the operation when the component using the hook is unmounted
  useEffect(() => {
    return () => {
      abort();
    };
  }, [abort]);

  return {
    abortController: abortController.current,
    abort,
    isAborted
  };
};
