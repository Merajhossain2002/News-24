function fetchCatagory() {
  const url = fetch("https://openapi.programming-hero.com/api/news/categories")
    .then((response) => response.json())
    .then((data) => loadCatagory(data.data.news_category))
    .catch((error) => console.log(error));
}

const toggleSpinner = (isLoading) => {
  const spinner = document.getElementById("spinner");
  if (isLoading === true) {
    spinner.classList.remove("d-none");
  } else {
    spinner.classList.add("d-none");
  }
};

const loadCatagory = (catagoryData) => {
  const getCataUl = document.getElementById("catagories");
  catagoryData.forEach((catagory) => {
    const li = document.createElement("li");
    li.classList.add("border", "p-2", "my-1");
    li.setAttribute("id", `${catagory.category_id}`);
    li.innerText = catagory.category_name;
    getCataUl.appendChild(li);
  });
};

document
  .getElementById("catagories")
  .addEventListener("click", function (event) {
    toggleSpinner(true);

    const getId = event.target.id;
    const newsSection = document.getElementById("news");
    newsSection.innerHTML = "";

    function fetchNews(getId) {
      fetch(`https://openapi.programming-hero.com/api/news/category/${getId}`)
        .then((response) => response.json())
        .then((data) => getNews(data.data))
        .catch((error) => console.log(error));
    }
    fetchNews(getId);

    const getNewsFoundElement = document.getElementById("item-count");

    function getNews(newsData) {
      if (newsData.length == 0) {
        getNewsFoundElement.innerText = "No News Found For This Catagory";
        newsSection.innerHTML = `
        <h1 class= "fw-bold" >No News found for this catagory.</h1>`;
      } else {
        const newsLength = newsData.length;
        getNewsFoundElement.innerText = `${newsLength} News Found For This Catagory`;
      }

      const mostViewed = newsData.sort(function (a, b) {
        return b.total_view - a.total_view;
      });

      mostViewed.forEach((news) => {
        const newsLength = news.details.length;

        const details = (lengthOfNews) => {
          if (lengthOfNews >= 600) {
            const elipsisDetail = news.details.slice(0, 600);
            const details = elipsisDetail + "...";
            return details;
          } else {
            return news.details;
          }
        };

        const dataCheck = (dataPath) => {
          if (dataPath === null || dataPath === "" || dataPath === "system") {
            const notFoundMsg = "No data found";
            return notFoundMsg;
          } else {
            return dataPath;
          }
        };

        const authorName = dataCheck(news.author.name);
        const viewData = dataCheck(news.total_view);
        const dateData = dataCheck(news.author.published_date);
        const newsDtails = details(newsLength);

        const div = document.createElement("div");
        div.setAttribute("id", `${news._id}`);
        div.innerHTML = `
        <div style="height: 22rem;" class="card mb-3">
        <div class="row g-0">
          <div class="col-md-3 d-flex justify-content-center">
            <img
              src="${news.image_url}"
              class="img-fluid rounded-start p-2"
              alt="..."
            />
          </div>
          <div class="col-md-9">
            <div class="card-body">
              <h5 class="card-title"
              title="Click To Read Full"
              data-bs-toggle="modal"
              data-bs-target="#myModal">${news.title}</h5>
              <p class="d-none d-lg-block card-text" title="Click To Read Full"  data-bs-toggle="modal"
              data-bs-target="#myModal">${newsDtails}</p>
              <div
                class="row align-items-center d-flex flex-column flex-md-row"
              >
                <!-- author start -->
                <div class="d-none d-lg-block card col col-md-3 border-0 my-4 my-lg-0">
                  <div class="row g-0 py-1">
                    <div
                      style="height: 40px"
                      class="col-3 col-md-3 d-flex align-items-center justify-content-center"
                    >
                      <img
                        src="${news.author.img}"
                        class="img-fluid rounded-circle p-lg-2"
                        alt="..."
                      />
                    </div>
                    <div class="col-9 col-md-9 ps-2 ps-lg-0">
                      <div style="height: 40px" class="card-body p-0">
                        <h5 class="card-title fs-6 m-0">${authorName}</h5>
                        <p class="card-title m-0">${dateData}</p>
                      </div>
                    </div>
                  </div>
                </div>
                <!-- author end -->

                <!-- view start -->
                <div class="col col-md-3">
                  <i class="fa-regular fa-eye"></i
                  ><span id="view" class="fw-semibold"> ${viewData}</span>
                </div>
                <!-- view end -->

                <!-- rating start -->
                <div class="col col-md-3">
                  <i class="fa-solid fa-star-half-stroke"></i>
                  <i class="fa-regular fa-star"></i>
                  <i class="fa-regular fa-star"></i>
                  <i class="fa-regular fa-star"></i>
                  <i class="fa-regular fa-star"></i>
                </div>
                <!-- rating end -->

                <!-- arrow button start -->
                <div class="d-none d-lg-block col col-md-3">
                  <button class="btn logo-color">
                    <i class="fa-solid fa-arrow-right"></i>
                  </button>
                </div>
                <!-- arrow button end -->
              </div>
            </div>
          </div>
        </div>
      </div>`;
        newsSection.appendChild(div);
      });
      toggleSpinner(false);
    }
  });

document.getElementById("news").addEventListener("click", function (event) {
  const getId =
    event.target.parentElement.parentElement.parentElement.parentElement
      .parentElement.id;
  console.log(getId);

  function fetchNews(getId) {
    fetch(`https://openapi.programming-hero.com/api/news/${getId}`)
      .then((response) => response.json())
      .then((data) => showModal(data.data[0]))
      .catch((error) => console.log(error));
  }
  fetchNews(getId);

  const showModal = (newsdata) => {
    function getElm(elmId) {
      const modalTitleElm = document.getElementById(elmId);
      return modalTitleElm;
    }
    const modalTitleElm = getElm("modalTitle");
    modalTitleElm.innerText = `${newsdata.title}`;

    const modalDetails = getElm("modalBody");
    modalDetails.innerText = `${newsdata.details}`;

    const modalImg = getElm("modal-img");
    modalImg.setAttribute("src", `${newsdata.image_url}`);
  };
});

fetchCatagory();
