import React from 'react';
import { Howl } from 'howler';

const VocabDetail = ({ item }) => {
  const speak = (text) => {
    const sound = new Howl({
      src: [`https://dict.youdao.com/dictvoice?audio=${encodeURIComponent(text.toLowerCase())}&type=2`],
      html5: true
    });
    sound.play();
  };

  return (
    <div className="space-y-6">
      {/* Header Từ + IPA */}
      <div className="text-center pb-5 border-b border-slate-50 dark:border-slate-800">
        <div className="flex items-center justify-center gap-3 mb-2">
          <h2 className="text-3xl font-black text-slate-800 dark:text-white leading-none">{item.word}</h2>
          <button 
            onClick={() => speak(item.word)} 
            className="p-2 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-full active:scale-90 transition-all shadow-sm border border-blue-100 dark:border-blue-800/30"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.707.707L4.586 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.586l3.707-3.707a1 1 0 011.09-.217zM14.657 2.929a1 1 0 011.414 0A9.972 9.972 0 0119 10a9.972 9.972 0 01-2.929 7.071 1 1 0 01-1.414-1.414A7.971 7.971 0 0017 10c0-2.21-.894-4.208-2.343-5.657a1 1 0 010-1.414zm-2.829 2.828a1 1 0 011.415 0A5.983 5.983 0 0115 10a5.984 5.984 0 01-1.757 4.243 1 1 0 01-1.415-1.415A3.984 3.984 0 0013 10a3.983 3.983 0 00-1.172-2.828 1 1 0 010-1.415z" clipRule="evenodd" />
            </svg>
          </button>
        </div>
        <p className="text-lg text-slate-400 dark:text-slate-500 font-serif italic">{item.ipa}</p>
      </div>

      {/* Thông tin chi tiết */}
      <div className="space-y-4">
        <div className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-2xl">
          <p className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase mb-1">Tiếng Việt</p>
          <p className="font-medium text-slate-800 dark:text-slate-200">{item.vietnameseMeaning}</p>
        </div>

        {item.englishMeaning && (
          <div className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-2xl">
            <p className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase mb-1">English Meaning</p>
            <p className="font-medium text-slate-800 dark:text-slate-200">{item.englishMeaning}</p>
          </div>
        )}

        {item.exampleSentence && (
          <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-2xl border border-blue-100 dark:border-blue-800/30">
            <p className="text-xs font-bold text-blue-600 dark:text-blue-400 uppercase mb-2">Ví dụ</p>
            <p className="text-slate-700 dark:text-slate-300 font-serif italic text-sm leading-relaxed whitespace-pre-wrap">{item.exampleSentence}</p>
          </div>
        )}

        {item.collocationIdiom && (
          <div className="bg-orange-50 dark:bg-orange-900/20 p-4 rounded-2xl border border-orange-100 dark:border-orange-800/30">
            <p className="text-xs font-bold text-orange-600 dark:text-orange-400 uppercase mb-2">Collocation / Idiom</p>
            <p className="text-slate-700 dark:text-slate-300 font-medium text-sm whitespace-pre-wrap">{item.collocationIdiom}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default VocabDetail;