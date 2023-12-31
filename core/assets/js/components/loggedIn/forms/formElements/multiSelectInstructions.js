import React from "react";

/** 
 * Instructions for the multi-select form elements.
 * @returns JSX
*/
const MultiSelectInstructions = () => {
    return (
      <p>
        <small>
          If you don't see any books/shelves, add some to your library first!
          <br />
          To select multiple, hold the ctrl button (Windows) or the cmd button
          (macOS).
        </small>
      </p>
    );
  };

export default MultiSelectInstructions;
  