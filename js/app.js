function fetchCatagory() {
  const url = fetch("https://openapi.programming-hero.com/api/news/categories")
    .then((response) => response.json())
    .then((data) => loadCatagory(data.data.news_category));
}

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
    const getId = event.target.id;

    function fetchNews(getId) {
      fetch(`https://openapi.programming-hero.com/api/news/category/${getId}`)
        .then((response) => response.json())
        .then((data) => getNews(data.data));
    }
    fetchNews(getId);

    const getNewsFoundElement = document.getElementById("item-count");

    function getNews(newsData) {
      if (newsData.length == 0) {
        getNewsFoundElement.innerText = "No News Founde For This Catagory";
      } else {
        const newsLength = newsData.length;
        getNewsFoundElement.innerText = `${newsLength} News Found For This Catagory`;
      }
    }
  });

fetchCatagory();
