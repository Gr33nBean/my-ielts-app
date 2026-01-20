import React, { useState, useRef, useEffect } from 'react';

const IPAKeyboard = ({ isOpen, onInsert, onClose, onBackspace }) => {
  const [mode, setMode] = useState('vowels'); // 'vowels' | 'consonants'
  const timerRef = useRef(null);
  const intervalRef = useRef(null);

  const startDelete = (e) => {
    e.preventDefault();
    onBackspace();
    timerRef.current = setTimeout(() => {
      intervalRef.current = setInterval(() => onBackspace(), 80);
    }, 500);
  };

  const stopDelete = () => {
    clearTimeout(timerRef.current);
    clearInterval(intervalRef.current);
  };

  if (!isOpen) return null;

  const vowels = [
    ['iː', 'ɪ', 'ʊ', 'uː'], ['e', 'ə', 'ɜː', 'ɔː'], ['æ', 'ʌ', 'ɑː', 'ɒ'],
    ['ɪə', 'eɪ', 'ʊə', 'ɔɪ'], ['əʊ', 'eə', 'aɪ', 'aʊ']
  ];

  const consonants = [
    ['p', 'b', 't', 'd', 'k'], ['g', 'tʃ', 'dʒ', 'f', 'v'],
    ['θ', 'ð', 's', 'z', 'ʃ'], ['ʒ', 'm', 'n', 'ŋ', 'h'],
    ['l', 'r', 'w', 'j']
  ];

  return (

    <div id="ipa-keyboard" className="fixed bottom-0 left-0 right-0 bg-slate-50/95 dark:bg-slate-900/95 backdrop-blur-xl z-[100] border-t border-slate-200 dark:border-slate-800 shadow-2xl transition-transform">
      <div className="flex justify-between items-center px-4 py-2 bg-white/80 dark:bg-slate-800/80 border-b border-slate-100 dark:border-slate-700">
        <button 
          onClick={() => setMode(mode === 'vowels' ? 'consonants' : 'vowels')}
          className={`px-3 py-1 rounded-lg text-white text-xs font-bold transition-colors ${mode === 'vowels' ? 'bg-blue-600' : 'bg-orange-600'}`}
        >
          ⇄ {mode === 'vowels' ? 'Consonants' : 'Vowels'}
        </button>
        <button onClick={onClose} className="px-4 py-1 bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-bold rounded-full">Xong</button>
      </div>

      <div className="p-2 pb-[calc(0.5rem+env(safe-area-inset-bottom))]">
        <div className="grid gap-2 mb-3" style={{ gridTemplateColumns: mode === 'vowels' ? 'repeat(4, 1fr)' : 'repeat(5, 1fr)' }}>
          {(mode === 'vowels' ? vowels.flat() : consonants.flat()).map(char => (
            <button 
              key={char} 
              onClick={() => onInsert(char)}
              className="bg-white dark:bg-slate-700 py-3 rounded-lg shadow-sm active:bg-blue-50 dark:active:bg-blue-900 active:scale-95 font-medium text-slate-700 dark:text-slate-200 transition-all font-sans"
            >
              {char}
            </button>
          ))}
        </div>
        
        <div className="grid grid-cols-6 gap-2 pt-2 border-t border-slate-200 dark:border-slate-700">
          <button onClick={() => onInsert('/')} className="bg-slate-200 dark:bg-slate-600 text-slate-800 dark:text-slate-200 py-3 rounded-lg font-bold">/</button>
          <button onClick={() => onInsert('ˈ')} className="bg-slate-200 dark:bg-slate-600 text-slate-800 dark:text-slate-200 py-3 rounded-lg font-bold">ˈ</button>
          <button onClick={() => onInsert(' ')} className="col-span-2 bg-slate-200 dark:bg-slate-600 text-slate-800 dark:text-slate-200 py-3 rounded-lg font-bold">Space</button>
          <button 
            onMouseDown={startDelete} onMouseUp={stopDelete} onMouseLeave={stopDelete}
            onTouchStart={startDelete} onTouchEnd={stopDelete}
            className="col-span-2 bg-red-100 dark:bg-red-900/40 text-red-600 dark:text-red-400 py-3 rounded-lg font-bold"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );

};

export default IPAKeyboard;