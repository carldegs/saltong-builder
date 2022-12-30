import { useCallback } from 'react';

const useJsonDownload = () => {
  const download = useCallback((obj: any, filename: string) => {
    const data = new Blob([JSON.stringify(obj)], { type: 'text/json' });
    const csvURL = window.URL.createObjectURL(data);

    const tempLink = document.createElement('a');
    tempLink.href = csvURL;
    tempLink.setAttribute('download', filename);
    tempLink.click();
  }, []);

  return download;
};

export default useJsonDownload;
