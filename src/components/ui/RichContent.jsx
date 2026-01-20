import React from "react";

const extractYoutubeId = (url) => {
  const regExp =
    /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#&?]*).*/;
  const match = url.match(regExp);
  return match && match[7].length === 11 ? match[7] : false;
};

const RichContent = ({ content, className = "" }) => {
  if (content === null || content === undefined) return null;
  const textContent = String(content);
  if (!textContent) return null;

  // Regex bắt URL
  const urlRegex = /(https?:\/\/[^\s]+)/g;
  const parts = textContent.split(urlRegex);

  return (
    <div
      className={`text-xs text-slate-700 dark:text-slate-300 leading-relaxed font-serif ${className}`}
    >
      {parts.map((part, idx) => {
        if (part.match(urlRegex)) {
          const ytId = extractYoutubeId(part);
          if (ytId) {
            return (
              <div
                key={idx}
                className="w-full aspect-video rounded-xl overflow-hidden shadow-sm my-3 border border-slate-200 dark:border-slate-700"
              >
                <iframe
                  width="100%"
                  height="100%"
                  src={`https://www.youtube.com/embed/${ytId}`}
                  title="Video Player"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                ></iframe>
              </div>
            );
          }

          if (part.includes("tiktok.com")) {
            return (
              <a
                key={idx}
                href={part}
                target="_blank"
                rel="noreferrer"
                className="block bg-black/90 dark:bg-white/10 text-white p-3 rounded-xl flex items-center gap-3 hover:opacity-90 transition-opacity my-2 no-underline"
              >
                <span className="text-xl">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="#000000"
                    width="20px"
                    height="20x"
                    viewBox="0 0 32 32"
                    version="1.1"
                  >
                    <path d="M16.656 1.029c1.637-0.025 3.262-0.012 4.886-0.025 0.054 2.031 0.878 3.859 2.189 5.213l-0.002-0.002c1.411 1.271 3.247 2.095 5.271 2.235l0.028 0.002v5.036c-1.912-0.048-3.71-0.489-5.331-1.247l0.082 0.034c-0.784-0.377-1.447-0.764-2.077-1.196l0.052 0.034c-0.012 3.649 0.012 7.298-0.025 10.934-0.103 1.853-0.719 3.543-1.707 4.954l0.020-0.031c-1.652 2.366-4.328 3.919-7.371 4.011l-0.014 0c-0.123 0.006-0.268 0.009-0.414 0.009-1.73 0-3.347-0.482-4.725-1.319l0.040 0.023c-2.508-1.509-4.238-4.091-4.558-7.094l-0.004-0.041c-0.025-0.625-0.037-1.25-0.012-1.862 0.49-4.779 4.494-8.476 9.361-8.476 0.547 0 1.083 0.047 1.604 0.136l-0.056-0.008c0.025 1.849-0.050 3.699-0.050 5.548-0.423-0.153-0.911-0.242-1.42-0.242-1.868 0-3.457 1.194-4.045 2.861l-0.009 0.030c-0.133 0.427-0.21 0.918-0.21 1.426 0 0.206 0.013 0.41 0.037 0.61l-0.002-0.024c0.332 2.046 2.086 3.59 4.201 3.59 0.061 0 0.121-0.001 0.181-0.004l-0.009 0c1.463-0.044 2.733-0.831 3.451-1.994l0.010-0.018c0.267-0.372 0.45-0.822 0.511-1.311l0.001-0.014c0.125-2.237 0.075-4.461 0.087-6.698 0.012-5.036-0.012-10.060 0.025-15.083z" />
                  </svg>
                </span>
                <div className="overflow-hidden">
                  <p className="text-[9px] font-bold uppercase text-slate-400">
                    Video TikTok
                  </p>
                  <p className="text-xs truncate opacity-90">{part}</p>
                </div>
                <div className="ml-auto text-xs font-bold bg-white text-black px-2 py-1 rounded-lg">
                  Mở
                </div>
              </a>
            );
          }

          // Link thường
          return (
            <a
              key={idx}
              href={part}
              target="_blank"
              rel="noreferrer"
              className="text-blue-600 dark:text-blue-400 underline break-all font-sans font-bold mx-1"
            >
              {part}
            </a>
          );
        }

        // Text thường (giữ nguyên xuống dòng)
        return (
          <span key={idx} className="whitespace-pre-wrap">
            {part}
          </span>
        );
      })}
    </div>
  );
};

export default RichContent;
