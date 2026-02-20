import { motion } from "framer-motion";
import { Chapter, ImageCorner } from "@/data/storyData";

interface BookShayariPageProps {
  chapter: Chapter;
  pageNumber: number;
  totalPages: number;
}

const cornerClasses: Record<ImageCorner, string> = {
  "top-right": "top-0 right-0",
  "top-left": "top-0 left-0",
  "bottom-right": "bottom-0 right-0",
  "bottom-left": "bottom-0 left-0",
};

const cornerRounded: Record<ImageCorner, string> = {
  "top-right": "rounded-bl-3xl",
  "top-left": "rounded-br-3xl",
  "bottom-right": "rounded-tl-3xl",
  "bottom-left": "rounded-tr-3xl",
};

const BookShayariPage = ({ chapter, pageNumber }: BookShayariPageProps) => {
  
  const toOdia = (n: number) => {
    const odiaNumbers = ["୦", "୧", "୨", "୩", "୪", "୫", "୬", "୭", "୮", "୯"];
    return n.toString().split("").map((digit) => odiaNumbers[parseInt(digit)]).join("");
  };

  // ✅ Ab yeh har page ke liye alag image uthayega (1.png, 2.png, etc.)
  const imageSrc = `/images/${chapter.id}.png`;

  return (
    <div className="w-full h-full min-w-0 min-h-0 bg-book-paper rounded-r-lg page-shadow flex flex-col overflow-hidden relative border-l border-black/5">
      
      {/* ✅ Alag-alag Corner Image Section */}
      <div
        className={`absolute ${cornerClasses[chapter.imageCorner]} ${cornerRounded[chapter.imageCorner]} w-24 h-24 sm:w-32 sm:h-32 md:w-44 md:h-44 z-10 overflow-hidden shadow-sm`}
      >
        <img 
          src={imageSrc} 
          alt={`Shayari Illustration ${chapter.id}`}
          className="w-full h-full object-cover opacity-90 transition-opacity duration-500"
          onError={(e) => (e.currentTarget.style.display = 'none')}
        />
        {/* Paper texture overlay taaki image page ke saath mix ho jaye */}
        <div className="absolute inset-0 bg-book-paper/10 mix-blend-multiply pointer-events-none" />
      </div>

      {/* Shayari content - scrollable on small screens */}
      <div className="flex-1 flex flex-col items-center justify-center p-4 sm:p-6 md:p-14 relative z-20 overflow-y-auto min-h-0">
        <motion.div
          className="w-full max-w-md text-center"
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.8 }}
        >
          <span className="font-sans text-[10px] tracking-[0.4em] uppercase text-muted-foreground/50 mb-6 block">
            ✦ କିଛି ଅକୁହା କଥା ✦
          </span>
          <p className="font-serif text-base sm:text-xl md:text-2xl leading-[2.2] text-foreground/80 whitespace-pre-line italic break-words">
            {chapter.shayari}
          </p>
        </motion.div>
      </div>

      {/* Page number section */}
      <div className="px-4 md:px-10 pb-4 md:pb-6 flex justify-center flex-shrink-0 relative z-20">
        <span className="font-serif text-xs text-muted-foreground/30 border-t border-black/5 pt-2 px-6">
          {toOdia(pageNumber)}
        </span>
      </div>
    </div>
  );
};

export default BookShayariPage;