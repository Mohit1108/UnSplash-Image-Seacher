import React, { useState } from "react";
import { ToastProvider, useToasts } from "react-toast-notifications";

const UnsplashSearch = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [orientations, setOrientation] = useState("landscape");
  const [orderBy, setOrderBy] = useState("latest");
  const [images, setImages] = useState([]);
  const [zoomedImage, setZoomedImage] = useState(null);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const { addToast } = useToasts();
  const [totalPages, setTotalPages] = useState(0);

  const handleSearch = async (e) => {
    if (e) {
      e.preventDefault();
    }
    if (!searchQuery) {
      // Input validation: check if searchQuery is empty
      addToast("Please enter a search query.", { appearance: "error" });
      return;
    }

    setLoading(true);

    const fetchImages = async () => {
      const response = await fetch(
        `https://api.unsplash.com/search/photos?query=${searchQuery}&per_page=6&page=${page}&orientation=${orientations}&order_by=${orderBy}`,
        {
          headers: {
            Authorization:
              "Client-ID LphXfU4-R27mTwJfweSppMGEwAh8Zgwf2RihxDvtP4Q"
          }
        }
      );
      const data = await response.json();
      setImages(data.results);
      console.log(data);
      setTotalPages(data.total_pages);

      setLoading(false);
    };

    fetchImages();
  };

  const handleDownload = (imageUrl, imageId) => {
    setLoading(true);

    fetch(imageUrl)
      .then((response) => response.blob())
      .then((blob) => {
        const url = window.URL.createObjectURL(new Blob([blob]));
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", `${imageId}.jpg`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        // Stop the loader
        setLoading(false);
        addToast("Image successfully downloaded", { appearance: "success" });
      })
      .catch((error) => {
        // Stop the loader

        setLoading(false);
        console.error(error);
        addToast("Something went wrong.", { appearance: "error" });
      });
  };

  const handleImageClick = (imageUrl) => {
    setZoomedImage(imageUrl);
  };

  const handleZoomClose = () => {
    setZoomedImage(null);
  };
  const handleNextPage = () => {
    setPage((prevPage) => prevPage + 1);
    handleSearch(); // Fetch images for the new page
  };

  const handlePrevPage = () => {
    setPage((prevPage) => Math.max(prevPage - 1, 1));
    handleSearch(); // Fetch images for the new page
  };

  return (
    <div className="container mb-4">
      <h1 className="text-center mt-4">Unsplash Image Search</h1>
      <form
        onSubmit={handleSearch}
        className="d-flex justify-content-center mt-4 formInputSearch"
      >
        <input
          type="text"
          className="form-control "
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search images..."
        />
        <div className="input-group">
          <select
            className="form-select"
            value={orientations}
            onChange={(e) => setOrientation(e.target.value)}
          >
            <option value="landscape">Landscape</option>
            <option value="portrait">Portrait</option>
          </select>

          <select
            className="form-select"
            value={orderBy}
            onChange={(e) => setOrderBy(e.target.value)}
          >
            <option value="latest">Latest</option>
            <option value="curated">Curated</option>
          </select>

          <button type="submit" className="btn btn-primary">
            Search image
          </button>
        </div>
      </form>
      <div className="row mt-4">
        {searchQuery && (
          <div className="text-center mt-4 pageInfo">
            <div>Total Pages: {totalPages}</div>
            <div>Current Page: {page}</div>
          </div>
        )}
        {images.map((image) => (
          <div className="col-md-4 mb-4" key={image.id}>
            <div className="HoverBox">
              <div className="btn-group dld">
                <button
                  type="button"
                  className="btn btn-success dropdown-toggle btnDownload"
                  data-toggle="dropdown"
                  aria-haspopup="true"
                  aria-expanded="false"
                >
                  <i className="bi bi-download"></i>
                </button>
                <div className="dropdown-menu">
                  <button
                    className="dropdown-item"
                    onClick={() => handleDownload(image.urls.small, image.id)}
                  >
                    Small
                  </button>
                  <button
                    className="dropdown-item"
                    onClick={() => handleDownload(image.urls.regular, image.id)}
                  >
                    Regular
                  </button>
                  <button
                    className="dropdown-item"
                    onClick={() => handleDownload(image.urls.raw, image.id)}
                  >
                    Large
                  </button>

                  <div className="dropdown-divider"></div>
                  <button
                    className="dropdown-item"
                    onClick={() => handleDownload(image.urls.full, image.id)}
                  >
                    Original Download
                  </button>
                </div>
              </div>
              <img
                src={image.urls.small}
                alt={image.alt_description}
                className="img-fluid rounded main-images"
                onClick={() => handleImageClick(image.urls.small)}
                style={{ cursor: "pointer" }}
              />
              <div className="Meta-data">
                <div className="autherDesc">
                  <span>
                    <i className="bi bi-person-badge"></i>
                    {image.user.first_name + " " + image.user.last_name}
                  </span>
                  <span>
                    <i className="bi bi-instagram"></i>
                    {image.user.instagram_username}
                  </span>{" "}
                </div>

                <img
                  src={image.user.profile_image.medium}
                  alt={image.user.first_name}
                  className="img-fluid rounded"
                />
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="text-center mt-4">
        {page > 1 && (
          <button className="btn btn-primary me-2" onClick={handlePrevPage}>
            Previous
          </button>
        )}
        {images.length > 0 && (
          <button className="btn btn-primary" onClick={handleNextPage}>
            Next
          </button>
        )}
      </div>
      {/* Spinning loader */}
      {loading && (
        <div className="text-center mt-4 loading-circle">
          <div className="spinner-border" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      )}

      {zoomedImage && (
        <div className="modal d-block" tabIndex="-1" role="dialog">
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-body text-center">
                <img
                  src={zoomedImage}
                  alt="Zoomed"
                  className="img-fluid rounded"
                />
              </div>

              <i
                className="bi bi-x-lg top-0 end-0 m-2 btnCloseModal"
                onClick={handleZoomClose}
              ></i>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UnsplashSearch;
