import React from "react";
import { Howl } from "howler";
import BaseCard from "./ui/BaseCard";

const VocabCard = ({ item, onClick }) => {
  const speakWord = (e, text) => {
    e.stopPropagation();
    const audioUrl = `https://dict.youdao.com/dictvoice?audio=${encodeURIComponent(text.toLowerCase())}&type=2`;
    const sound = new Howl({
      src: [audioUrl],
      format: ["mp3"],
      html5: true,
    });
    sound.play();
  };

  return (
    <BaseCard onClick={() => onClick(item)} className="p-5">
      <div className="flex justify-between items-start gap-3">
        {/* Left Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-baseline gap-2 mb-1">
            <h3 className="text-base font-black text-slate-800 dark:text-slate-100 truncate">
              {item.word}
            </h3>
            <span className="text-xs font-normal text-slate-400 dark:text-slate-500 font-serif italic">
              {item.ipa}
            </span>
          </div>

          <p className="text-[13px] text-slate-600 dark:text-slate-300 line-clamp-2 font-medium leading-normal">
            {item.vietnameseMeaning}
          </p>

          <p className="text-[10px] text-slate-300 dark:text-slate-600 mt-2 flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-400/50"></span>
            {item.userEmail ? item.userEmail.split("@")[0] : "Unknown"}
          </p>
        </div>

        {/* Right Action (Speaker) */}
        <button
          onClick={(e) => speakWord(e, item.word)}
          className="shrink-0 w-9 h-9 rounded-2xl bg-blue-50 dark:bg-blue-900/20 text-blue-500 dark:text-blue-400 flex items-center justify-center transition-all shadow-sm active:scale-90"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.707.707L4.586 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.586l3.707-3.707a1 1 0 011.09-.217zM14.657 2.929a1 1 0 011.414 0A9.972 9.972 0 0119 10a9.972 9.972 0 01-2.929 7.071 1 1 0 01-1.414-1.414A7.971 7.971 0 0017 10c0-2.21-.894-4.208-2.343-5.657a1 1 0 010-1.414zm-2.829 2.828a1 1 0 011.415 0A5.983 5.983 0 0115 10a5.984 5.984 0 01-1.757 4.243 1 1 0 01-1.415-1.415A3.984 3.984 0 0013 10a3.983 3.983 0 00-1.172-2.828 1 1 0 010-1.415z"
              clipRule="evenodd"
            />
          </svg>
        </button>
      </div>
    </BaseCard>
  );
};

export default VocabCard;
