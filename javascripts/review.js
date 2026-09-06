const FAVORITES_KEY = "f1-favorites-search-filter";
const CUSTOM_FAVORITE_ID = "rexy-review-card";

const product = {
    id: 1,
    category: "IMSA weather tech championship",
    name: "AO Racing's Porsche 911 GT3 (Rexy)",
    description: "A prototype racing car the competes in the IMSA weathertech championship",
    image: "images/AddReview/Rexy.jpg",
    engine: "    Naturally aspirated 4.2-liter flat-six engine",
    horsePower: "    565 horsepower",
    gearBox: "    Six-speed sequential gearbox",
    zero: "    0 –100 km/h in roughly 2.8 seconds",
    topSpeed: "    Top speed = 290 km/h",
    reviews: [
        {
          user: "John Smith",
          rating: 5,
          date: "2026-01-15",
          comment: "My kids love the livery."
        },
        {
          user: "Sarah Jones",
          rating: 4,
          date: "2026-02-10",
          comment: "Very fast and responsive, but expensive."
        },
        {
          user: "Michael Lee",
          rating: 5,
          date: "2026-03-05",
          comment: "very reliable, will race at full speed for 14 hours."
      }]
    };

    //-------------------------------------------------------------
    //Load Product
    const loadProduct = () => {
      // Copy the product data into the matching elements on the page.
      const productCategory = document.getElementById("productCategory");
      const productName = document.getElementById("productName");
      const productDescription = document.getElementById("productDescription");
      const productImage = document.getElementById("productImage");
      const productDetails = {
        engine: product.engine,
        horsePower: product.horsePower,
        gearBox: product.gearBox,
        zero: product.zero,
        topSpeed: product.topSpeed
      };

      if (productCategory) productCategory.textContent = product.category;
      if (productName) productName.textContent = product.name;
      if (productDescription) productDescription.textContent = product.description;
      if (productImage) productImage.src = product.image;
      Object.entries(productDetails).forEach(([id, value]) => {
        const element = document.getElementById(id);
        if (element) element.textContent = value;
      });
      
    }

    //-------------------------------------------------------------
    // Render Reviews
    const renderReviews = () => {
      const container = document.getElementById("reviewsContainer");
      container.innerHTML = "";
      // Rebuild the list so newly added reviews appear immediately.
      product.reviews.forEach(review => {
        // Display filled stars for the rating and empty stars for the remainder.
        const stars = "★".repeat(review.rating) + "☆".repeat(5 - review.rating);
        container.innerHTML += `
          <div class="card mb-3">
            <div class="card-body">
              <div class="d-flex justify-content-between">
                <h5>${review.user}</h5>
                <small class="text-muted">${review.date}</small>
              </div>
              <div class="text-warning mb-2"> ${stars} </div>
              <p class="mb-0">${review.comment}</p>
            </div>
          </div>
        `;
      });
    }

    //-------------------------------------------------------------
    // Add Review
    document.getElementById("reviewForm").addEventListener("submit", (e) => {
      e.preventDefault();
      // Read the submitted values from the form controls.
      const user = document.getElementById("reviewUser").value;
      const rating = parseInt(document.getElementById("reviewRating").value);
      const comment = document.getElementById("reviewComment").value;
      const newReview = {
        user,
        rating,
        comment,
        date: new Date().toISOString().split("T")[0]
      };
      // Add the newest review to the beginning of the review list.
      product.reviews.unshift(newReview);
      renderReviews();
      e.currentTarget.reset();
      alert("Review added successfully!");
    });
    const rexyFavButton = document.getElementById("RexyFav");
    if (rexyFavButton) {
      const favoriteIds = new Set(JSON.parse(localStorage.getItem(FAVORITES_KEY) || "[]"));
      const isSaved = favoriteIds.has(CUSTOM_FAVORITE_ID);
      rexyFavButton.classList.toggle("active", isSaved);
      rexyFavButton.textContent = isSaved ? "Added to favorites" : "Add to favorites";
      rexyFavButton.setAttribute("aria-pressed", String(isSaved));

      rexyFavButton.addEventListener("click", () => {
        const currentFavorites = new Set(JSON.parse(localStorage.getItem(FAVORITES_KEY) || "[]"));

        if (currentFavorites.has(CUSTOM_FAVORITE_ID)) {
          currentFavorites.delete(CUSTOM_FAVORITE_ID);
        } else {
          currentFavorites.add(CUSTOM_FAVORITE_ID);
        }

        localStorage.setItem(FAVORITES_KEY, JSON.stringify([...currentFavorites]));
        window.dispatchEvent(new CustomEvent("favoritesUpdated"));

        const isActive = rexyFavButton.classList.toggle("active");
        rexyFavButton.textContent = isActive ? "Added to favorites" : "Add to favorites";
        rexyFavButton.setAttribute("aria-pressed", String(isActive));
      });
    }

    // Populate the product details and existing reviews when the page loads.
    loadProduct();
    renderReviews();