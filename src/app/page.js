"use client"
import { useEffect, useState, useMemo } from 'react';
import axios from 'axios';

const types = ['sfw', 'nsfw'];
const sfwCategories = [
  'waifu', 'neko', 'shinobu', 'megumin', 'bully', 'cuddle', 'cry', 'hug', 'awoo',
  'kiss', 'lick', 'pat', 'smug', 'bonk', 'yeet', 'blush', 'smile', 'wave', 'highfive',
  'handhold', 'nom', 'bite', 'glomp', 'slap', 'kill', 'kick', 'happy', 'wink',
  'poke', 'dance', 'cringe'
];
const nsfwCategories = ['waifu', 'neko', 'trap', 'blowjob'];

const BackgroundImage = () => {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedType, setSelectedType] = useState(types[0]);
  const [selectedCategory, setSelectedCategory] = useState(sfwCategories[0]);
  const [page, setPage] = useState(1);
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    fetchImages();
  }, [selectedType, selectedCategory]);

  useEffect(() => {
    setSelectedCategory(selectedType === 'sfw' ? sfwCategories[0] : nsfwCategories[0]);
    setImages([]);
    setPage(1);
  }, [selectedType]);

  const fetchImages = async () => {
    setLoading(true);
    try {
      const response = await axios.post(`https://api.waifu.pics/many/${selectedType}/${selectedCategory}`, {
        params: { page: page, limit: 10 }
      });
      setImages(prevImages => [...prevImages, ...response.data.files]);
      setLoading(false);
    } catch (error) {
      console.error(error);
      setLoading(false);
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      if (window.innerHeight + document.documentElement.scrollTop >= document.documentElement.offsetHeight - 100) {
        if (!loading) {
          setPage(prevPage => prevPage + 1);
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [loading]);

  useEffect(() => {
    if (page > 1) {
      fetchImages();
    }
  }, [page]);

  const memoizedImages = useMemo(() => images.map(item => ({
    ...item,
    uri: item,
  })), [images]);

  const toggleFilters = () => {
    setShowFilters(!showFilters);
  };

  const categories = selectedType === 'sfw' ? sfwCategories : nsfwCategories;

  return (
    <div className="flex flex-col items-center bg-gray-100 min-h-screen p-4">
      <button
        className="bg-blue-500 text-white py-2 px-4 rounded mb-4"
        onClick={toggleFilters}
      >
        {showFilters ? 'Hide Filters' : 'Show Filters'}
      </button>

      {showFilters && (
        <div className="w-full bg-white bg-opacity-70 p-4 flex flex-col items-center gap-4 rounded-md">
          <div className="flex items-center gap-4">
            <span className="text-xl font-bold">Type: </span>
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="border border-gray-300 p-2 rounded"
            >
              {types.map(type => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-xl font-bold">Category: </span>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="border border-gray-300 p-2 rounded"
            >
              {categories.map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
          </div>
        </div>
      )}

      {loading && images.length === 0 ? (
        <div className="text-blue-500 text-xl">Loading...</div>
      ) : (
        <div className="flex flex-wrap justify-center gap-4 mt-4">
          {memoizedImages.map((item, index) => (
            <div className="w-11/12 md:w-9/12 lg:w-8/12 xl:w-7/12 mb-4 rounded overflow-hidden shadow-lg" key={`${item.uri}-${index}`}>
              <img src={item.uri} alt="Waifu" className="w-full h-auto object-contain" />
            </div>
          ))}
        </div>
      )}

      {loading && <div className="text-blue-500 text-xl mt-4">Loading...</div>}
    </div>
  );
};

export default BackgroundImage;
