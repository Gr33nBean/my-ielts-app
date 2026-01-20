import { useState, useEffect } from 'react';

export const useIPAControl = () => {
  const [showIPA, setShowIPA] = useState(false);
  const [activeInputRef, setActiveInputRef] = useState(null);

  const handleInsertIPA = (char) => {
    if (activeInputRef) {
      const input = activeInputRef;
      const start = input.selectionStart;
      const end = input.selectionEnd;
      input.value = input.value.substring(0, start) + char + input.value.substring(end);
      input.selectionStart = input.selectionEnd = start + char.length;
      input.focus();
      const event = new Event('input', { bubbles: true });
      input.dispatchEvent(event);
    }
  };

  const handleBackspace = () => {
    if (activeInputRef && activeInputRef.selectionStart > 0) {
      const input = activeInputRef;
      const start = input.selectionStart;
      input.value = input.value.substring(0, start - 1) + input.value.substring(start);
      input.selectionStart = input.selectionEnd = start - 1;
      input.focus();
      const event = new Event('input', { bubbles: true });
      input.dispatchEvent(event);
    }
  };

  // Click outside to close IPA Keyboard
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (showIPA && activeInputRef) {
        const keyboard = document.getElementById('ipa-keyboard');
        if (keyboard && !keyboard.contains(event.target) && event.target !== activeInputRef) {
          setShowIPA(false);
          setActiveInputRef(null);
        }
      }
    };

    if (showIPA) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showIPA, activeInputRef]);

  const openIPA = (el) => {
    setActiveInputRef(el);
    setShowIPA(true);
  };

  const closeIPA = () => {
    setShowIPA(false);
  };

  return { showIPA, openIPA, closeIPA, handleInsertIPA, handleBackspace };
};
