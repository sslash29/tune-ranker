import { useState } from "react";

function StarRate({ rating, setRating, size }) {
  const [isLastClicked, setIsLastClicked] = useState(null);

  function handleRating(value) {
    if (value === isLastClicked) {
      setRating(value - 0.5);
      setIsLastClicked(null);
    } else {
      setRating(value);
      setIsLastClicked(value);
    }
  }

  return (
    <div className="flex gap-3">
      {[...Array(5)].map((_, index) => {
        const fullValue = index + 1;
        const halfValue = index + 0.5;
        const isHalf = rating === halfValue;
        const isFull = rating >= fullValue;

        return (
          <div key={index}>
            <label>
              <input
                type="radio"
                name="rate"
                value={fullValue}
                onClick={() => handleRating(isHalf ? halfValue : fullValue)}
                className="hidden"
              />
              {isHalf ? (
                // Half star (you can add a StarHalf.svg if needed)
                <img
                  src="/HalfStar.svg"
                  alt="Half Star"
                  style={{ width: size, height: size }}
                  className="opacity-80 w-[35px] h-[34px]"
                />
              ) : (
                <img
                  src={isFull ? "/StarFull.svg" : "/Star.svg"}
                  alt={isFull ? "Full Star" : "Empty Star"}
                  style={{ width: size, height: size }}
                  className="opacity-80"
                />
              )}
            </label>
          </div>
        );
      })}
    </div>
  );
}

export default StarRate;
