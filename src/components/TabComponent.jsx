import { AnimatePresence, motion } from "motion/react";

function TabComponent({ display, setDisplay }) {
  return (
    <>
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-semibold">Albums</h3>
        <div className="flex gap-5 text-md ">
          <div className="relative">
            <span
              onClick={() => setDisplay("favorite-albums")}
              className="cursor-pointer"
            >
              Favorite Albums
            </span>
            {display === "favorite-albums" && (
              <AnimatePresence>
                <motion.div
                  initial={{ x: 100 }}
                  animate={{ x: 0 }}
                  exit={{ x: 100 }}
                  transition={{ duration: 0.3 }}
                  className="bg-white absolute w-full h-[1px] -bottom-2.5"
                ></motion.div>
              </AnimatePresence>
            )}
          </div>
          <div className="relative">
            <span
              onClick={() => setDisplay("recent-activity")}
              className="cursor-pointer"
            >
              Recent Activity
            </span>
            {display === "recent-activity" && (
              <AnimatePresence>
                <motion.div
                  initial={{ x: -100 }}
                  animate={{ x: 0 }}
                  exit={{ x: -100 }}
                  transition={{ duration: 0.3 }}
                  className="bg-white absolute w-full h-[1px] -bottom-2.5"
                ></motion.div>
              </AnimatePresence>
            )}
          </div>
        </div>
      </div>
      <hr className="my-2 border-t-[0.1px]" />
    </>
  );
}

export default TabComponent;
