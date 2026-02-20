import { motion } from "framer-motion";
import { chapters } from "@/data/storyData";

interface TableOfContentsProps {
  onChapterSelect: (chapterIndex: number) => void;
}

const TableOfContents = ({ onChapterSelect }: TableOfContentsProps) => {
  return (
    <div className="w-full h-full min-w-0 min-h-0 bg-book-paper rounded-r-lg page-shadow flex flex-col overflow-hidden">
      <div className="flex-1 flex flex-col items-center p-4 sm:p-6 md:p-10 overflow-y-auto min-h-0">
        {/* Ornament */}
        <div className="w-12 h-[1px] bg-border mb-6 mt-2" />

        <motion.h2
          className="font-serif text-2xl md:text-3xl text-foreground mb-8"
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          ସୂଚୀପତ୍ର
        </motion.h2>

        <div className="w-full max-w-[90%] sm:max-w-xs space-y-4">
          {chapters.map((chapter, index) => (
            <motion.button
              key={chapter.id}
              className="w-full flex items-center gap-3 group text-left"
              onClick={() => onChapterSelect(index)}
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 + index * 0.06, duration: 0.4 }}
            >
              {/* ✅ FIXED: id ki jagah displayId use kiya hai */}
              <span className="font-serif text-sm text-muted-foreground w-6 text-right flex-shrink-0">
                {chapter.displayId}
              </span>
              
              <span className="flex-1 border-b border-dotted border-border/60 pb-1" />
              
              <span className="chapter-link text-sm md:text-base text-book-chapter group-hover:text-foreground transition-colors break-words text-left">
                {chapter.title}
              </span>
            </motion.button>
          ))}
        </div>

        <div className="w-12 h-[1px] bg-border mt-8" />
      </div>
    </div>
  );
};

export default TableOfContents;