import React, { useEffect, useState } from "react";
import Header from "../../components/Header/HeaderHome";
import { useLocation } from "react-router-dom";
import { Link } from "react-router-dom";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "./css/searchedResults.css"
import "./css/placesCard.css";


const SearchedResults = () => {
  const [places, setPlaces] = useState([]);
  const [searchValue, setSearchValue] = useState("");
  const location = useLocation();

  useEffect(() => {
    if (location.state && location.state.searchResults) {
      const outputSearch = location.state.searchResults || [];
      setPlaces(outputSearch);
      console.log("Search Results:", outputSearch.length);
    }

    if (location.state && location.state.searchValue) {
      setSearchValue(location.state.searchValue);
      console.log("Search Value:", location.state.searchValue);
    }
  }, [location.state]);

  return (
    <div>
      <Header />
      <div className="searched">Search Results for "{searchValue}"</div>

      <div className="SearchedRes">
        <div className="place-cards-container">
          {places.length > 0 &&
            places.map((place) => (
              <Link
                key={place.placeid}
                to={`/book-place/${place.placeid}`}
                className="place-card-link no-underline"
                style={{ textDecoration: 'none', color: 'black' }}
              >
                <div key={place.placeid} className="place-card">
                  <img src={place.place_image} alt={place.place_name} />
                  {/* Assuming placesCard is a component */}
                  <placesCard place={place} />
                  <div className="places-card-info">
                    <h3 className="places-card-title black-text">
                      {place.place_name}
                    </h3>
                    <p className="places-card-cat black-text">
                      {place.cat_name}
                    </p>
                    <p className="places-card-description black-text">
                      {place.description}
                    </p>
                    <p className="places-card-rating black-text">
                      Rating: {place.rating}/5
                    </p>
                  </div>
                </div>
              </Link>
            ))
          }
        </div>

        {places.length === 0
          ? <div>No search results</div>
          : null
        }
      </div>
    </div>
  );
};

export default SearchedResults;
