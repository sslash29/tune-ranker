import { useState } from "react";
import { FaStar, FaStarHalfAlt } from "react-icons/fa";

function StarRate({ rating, setRating, size }) {
  const [isLastClicked, setIsLastClicked] = useState(null);

  function handleRating(value) {
    if (value === isLastClicked) {
      setRating(value - 0.5);
      setIsLastClicked(null);
    } else {
      setRating(value);
      // to set the value of isLastClicked so when I click on it again it will do the comparsion
      setIsLastClicked(value);
    }
  }

  return (
    <div>
      {[...Array(5)].map((star, index) => {
        const fullValue = index + 1;
        const halfValue = index + 0.5;
        const isHalf = rating === halfValue;
        const isFull = rating >= fullValue;
        return (
          <>
            <label key={index}>
              <input
                type="radio"
                name="rate"
                value={fullValue}
                onClick={() => handleRating(isHalf ? halfValue : fullValue)}
              />
              {/* it checks if there's a half rating if there is it uses
             the star half icon if not it uses the full star icon
             now on initial render it checks if there is half but no 
             then it does the else condition 
              */}
              {isHalf ? (
                <FaStarHalfAlt color="black" />
              ) : (
                <>
                  {/* on this condition it checks isFull if not it uses gray */}
                  <FaStar
                    color={isFull ? "#2A75E4" : "gray"}
                    size={size ? size : null}
                    stroke={"black"}
                  />
                </>
              )}{" "}
            </label>
          </>
        );
      })}
    </div>
  );
}

export default StarRate;
