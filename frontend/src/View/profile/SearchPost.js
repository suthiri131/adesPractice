import React, { useEffect, useState } from "react";
import { useLocation, Link } from "react-router-dom";
import CardPost from "../../components/Cards/cardPost";
import Header from "../../components/Header/HeaderProfile";
import "./css/profileMain.css";

const SearchPost = () => {
  const location = useLocation();
  const [posts, setPosts] = useState([]);
  const [searchValue, setSearchValue] = useState("");
  let outputSearch;
  useEffect(() => {
    if (location.state && location.state.result) {
      outputSearch = location.state.result || [];
      setPosts(outputSearch);
      console.log("Search Results:", outputSearch.length);
    }

    if (location.state && location.state.searchValue) {
      setSearchValue(location.state.searchValue);
      console.log("Search Value:", location.state.searchValue);
    }
  }, [location.state]);

  console.log("Complete Search Results:", posts);

  return (
    <div>
      <Header />
      <div className="results">
      <div className="card-container col-12">

        {posts.length > 0 ? (
          posts.map((post) => (
            <Link
              key={post.postid}
              to={`/post-details/${post.postid}`}
              className="card-link"
            >
              <CardPost post={post} />
            </Link>
          ))
        ) : (
          <div>No posts available</div>
        )}
      </div>
      </div>
    </div>
  );
};

export default SearchPost;
