// IssueCover.jsx
// Карточка выпуска в архиве

import React from 'react';

const IssueCover = ({ title, date }) => {
  return (
    <div>
      <h3>{title}</h3>
      <p>{date}</p>
    </div>
  );
};

export default IssueCover;