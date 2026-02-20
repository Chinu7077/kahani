import { motion } from "framer-motion";
import { Chapter } from "@/data/storyData";

interface BookPageProps {
  chapter: Chapter;
  pageNumber: number;
  totalPages: number;
}

const BookPage = ({ chapter, pageNumber, totalPages }: BookPageProps) => {
  
  // ✅ Odia number converter
  const toOdia = (n: number) => {
    const odiaNumbers = ["୦", "୧", "୨", "୩", "୪", "୫", "୬", "୭", "୮", "୯"];
    return n
      .toString()
      .split("")
      .map((digit) => odiaNumbers[parseInt(digit)])
      .join("");
  };

  // ✅ Image path logic: Chapter 1 -> 100.png, Chapter 2 -> 101.png...
  const imageSrc = `/images/${99 + chapter.id}.png`;

  return (
    <div className="w-full h-full bg-book-paper rounded-r-lg page-shadow flex flex-col overflow-hidden">
      {/* Page inner content */}
      <div className="flex-1 flex flex-col p-6 md:p-10 overflow-y-auto overflow-x-hidden" style={{ WebkitOverflowScrolling: 'touch', minHeight: 0 }}>
        
        {/* Chapter title */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
        >
          <span className="font-serif text-sm tracking-widest uppercase text-muted-foreground">
            ଅଧ୍ୟାୟ {chapter.displayId}
          </span>
          <h2 className="font-serif text-2xl md:text-3xl text-foreground mt-1 mb-6">
            {chapter.title}
          </h2>
        </motion.div>

        {/* ✅ Updated Image Section (Placeholder hatakar image daal di hai) */}
        <motion.div
          className="image-container mb-6 flex-shrink-0 bg-muted/10 rounded-lg overflow-hidden h-48 md:h-60 flex items-center justify-center border border-border/20 shadow-sm"
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4, duration: 0.5 }}
        >
          <img 
            src={imageSrc} 
            alt={chapter.title}
            className="w-full h-full object-cover"
            onError={(e) => {
              // Agar image na mile toh placeholder ya invisible ho jaye
              e.currentTarget.style.opacity = '0';
            }}
          />
        </motion.div>

        {/* Story text */}
        <motion.p
          className="font-sans text-sm md:text-base leading-relaxed text-foreground/80 pb-4"
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.6 }}
        >
          {chapter.text}
        </motion.p>
      </div>

      {/* Page number section */}
      <div className="px-6 md:px-10 pb-4 flex justify-center flex-shrink-0">
        <span className="font-serif text-sm text-muted-foreground/60 border-t border-border/30 pt-2 px-4">
          {toOdia(pageNumber)}
        </span>
      </div>
    </div>
  );
};

export default BookPage;