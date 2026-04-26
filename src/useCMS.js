import { useState, useEffect } from 'react';
import { dict } from './dictionary'; // We use your existing dictionary as the baseline

export function useCMS(language) {
  // Load from local storage if edited, otherwise use the default dictionary
  const [content, setContent] = useState(() => {
    const savedContent = localStorage.getItem('safar_cms_overrides');
    return savedContent ? JSON.parse(savedContent) : dict;
  });

  // Save changes to browser storage instantly
  useEffect(() => {
    localStorage.setItem('safar_cms_overrides', JSON.stringify(content));
  }, [content]);

  // Function to update a specific text node
  const updateText = (key, newText) => {
    setContent(prev => ({
      ...prev,
      [language]: {
        ...prev[language],
        [key]: newText
      }
    }));
  };

  const resetCMS = () => {
    if(window.confirm("Reset all text to default?")) {
      setContent(dict);
      localStorage.removeItem('safar_cms_overrides');
    }
  };

  return { t: content[language], updateText, resetCMS };
}