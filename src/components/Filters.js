import React from 'react';
import styles from '../styles/Filters.module.css';

const Filters = ({ filters, selectedTags, onSelectTag }) => {
  const renderCheckboxes = (type) => {
    return filters[type].map((tag) => (
      <div key={tag} className={styles.checkboxContainer}>
        <input
          type="checkbox"
          className={styles.checkboxInput}  // Apply the CSS class here
          checked={selectedTags.includes(tag)}
          onChange={() => onSelectTag(tag, !selectedTags.includes(tag))}
        />
        <label>{tag}</label>
      </div>
    ));
  };

  return (
    <div className={styles.container}>
      <h3 className={styles.title}>Versatile</h3>
      {renderCheckboxes('versatile')}
      <h3 className={styles.title}>NSFW</h3>
      {renderCheckboxes('nsfw')}
    </div>
  );
};

export default Filters;
