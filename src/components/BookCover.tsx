import { motion } from "framer-motion";

interface BookCoverProps {
  isOpen: boolean;
  onOpen: () => void;
}

const BookCover = ({ isOpen, onOpen }: BookCoverProps) => {
  return (
    <div
      // Fix: Added w-full h-full to ensure it covers the whole parent container
      className={`book-cover absolute inset-0 w-full h-full z-50 cursor-pointer ${
        isOpen ? "book-cover-open pointer-events-none" : ""
      }`}
      onClick={() => !isOpen && onOpen()}
    >
      {/* Front cover */}
      <div 
        className="book-page-front bg-book-cover rounded-r-lg flex flex-col items-center justify-center p-4 sm:p-6 md:p-8 cover-shadow relative overflow-hidden h-full w-full"
        style={{
          backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.4)), url('/coverp.jpg')`,
          backgroundSize: 'cover', // 'cover' standard hai, agar image stretch ho toh '100% 100%' kar sakte hain
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat'
        }}
      >
        {/* Decorative border */}
        <div className="absolute inset-4 border border-book-gold/40 rounded pointer-events-none z-20" />
        <div className="absolute inset-6 border border-book-gold/20 rounded pointer-events-none z-20" />

        {/* Content wrapper */}
        <div className="relative z-30 flex flex-col items-center justify-center text-center">
          <div className="w-16 h-[2px] bg-book-gold/60 mb-8" />

          <motion.h1
            className="font-serif text-2xl sm:text-3xl md:text-4xl lg:text-5xl text-book-gold leading-tight tracking-wide drop-shadow-lg text-center break-words px-2"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.8 }}
          >
            ସେ ଥିଲେ…
            <br />
            କିନ୍ତୁ ମୋର ନୁହେଁ
          </motion.h1>

          <motion.p
            className="font-sans text-sm md:text-base text-book-gold-light/80 mt-4 tracking-widest uppercase font-bold"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8, duration: 0.8 }}
          >
            ସ୍ମୃତିର ଅଧ୍ୟାୟ
          </motion.p>

          <div className="w-16 h-[2px] bg-book-gold/60 mt-8" />
        </div>

        <div className="absolute bottom-6 sm:bottom-12 left-0 right-0 flex flex-col items-center gap-2 z-30">
          <motion.div
            className="flex flex-col items-center gap-1"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2, duration: 0.6 }}
          >
            <span className="font-sans text-base sm:text-xl text-book-gold tracking-widest font-bold">
              ଖୋଲନ୍ତୁ
            </span>
            <span className="font-sans text-xs sm:text-sm text-book-gold-light/80 tracking-wide flex items-center gap-1.5">
              <span className="text-base">👆</span>
              ଏଠି କ୍ଲିକ୍ କରନ୍ତୁ
            </span>
          </motion.div>
          <motion.span
            className="font-sans text-xs sm:text-sm text-book-gold/60 tracking-wide"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.4, duration: 0.6 }}
          >
            Created by – ଚିନୁ
          </motion.span>
        </div>
      </div>

      {/* Back of cover */}
      <div className="book-page-back bg-book-cover-inner rounded-r-lg h-full w-full" />
    </div>
  );
};

export default BookCover;