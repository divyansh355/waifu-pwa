"use client"
import React, { useState, useEffect } from 'react';
import { fetchWaifu } from '../lib/api'; // API request function
import Filters from '../components/Filters'; // Filter component
import styles from '../styles/Home.module.css'; // Home CSS module

const filtersData = {
  versatile: [
    'maid', 'waifu', 'marin-kitagawa', 'mori-calliope', 'raiden-shogun', 'oppai', 'selfies', 'uniform', 'kamisato-ayaka'
  ],
  nsfw: [
    'ass', 'hentai', 'milf', 'oral', 'paizuri', 'ecchi', 'ero'
  ]
};

const Home = () => {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showFilters, setShowFilters] = useState(false);
  const [selectedTags, setSelectedTags] = useState([]);
  const [score, setScore] = useState(0);

  useEffect(() => {
    fetchInitialImages();
  }, [selectedTags]);

  useEffect(() => {
    const appendImageInterval = setInterval(() => {
      appendImage();
    }, 10000);
    return () => clearInterval(appendImageInterval);
  }, [selectedTags]);

  const fetchInitialImages = async () => {
    setLoading(true);
    setError(null);
    try {
      const params = {
        included_tags: selectedTags,
        height: '>=2000',
        limit: 10
      };
      const data = await fetchWaifu(params);
      setImages(data.images.map(image => image.url));
    } catch (error) {
      setError('Failed to fetch Waifu images.');
    } finally {
      setLoading(false);
    }
  };

  const appendImage = async () => {
    try {
      const params = {
        included_tags: selectedTags,
        height: '>=2000',
        limit: 1
      };
      const data = await fetchWaifu(params);
      if (data.images.length > 0) {
        setImages((prevImages) => [...prevImages, data.images[0].url]);
      }
    } catch (error) {
      console.error('Failed to append new image:', error);
    }
  };

  const handleSelectTag = (tag, isSelected) => {
    if (isSelected) {
      setSelectedTags([...selectedTags, tag]);
    } else {
      setSelectedTags(selectedTags.filter((t) => t !== tag));
    }
  };

  const toggleFilters = () => {
    setShowFilters(!showFilters);
  };

  return (
    <div className={styles.container}>
      <div className={styles.scoreContainer}>
        <span className={styles.scoreText}>Score: {score}</span>
      </div>
      <div className={styles.navBar}>
        <button onClick={toggleFilters}>Filters</button>
      </div>
      {showFilters && (
        <Filters filters={filtersData} selectedTags={selectedTags} onSelectTag={handleSelectTag} />
      )}
      <div className={styles.imageContainer}>
        {loading && images.length === 0 ? (
          <div className={styles.loader}>Loading...</div>
        ) : (
          images.map((imageUrl, index) => (
            <img key={index} src={imageUrl} alt={`Waifu ${index}`} className={styles.image} />
          ))
        )}
        {error && <div className={styles.errorText}>{error}</div>}
      </div>
    </div>
  );
};

export default Home;
