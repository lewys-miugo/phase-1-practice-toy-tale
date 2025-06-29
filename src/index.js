let addToy = false;

document.addEventListener("DOMContentLoaded", () => {
  const addBtn = document.querySelector("#new-toy-btn");
  const toyFormContainer = document.querySelector(".container");
  const toyForm = document.querySelector(".add-toy-form");
  const toyCollection = document.getElementById("toy-collection");

  // toggling toy form
  addBtn.addEventListener("click", () => {
    // hide & seek with the form
    addToy = !addToy;
    if (addToy) {
      toyFormContainer.style.display = "block";
    } else {
      toyFormContainer.style.display = "none";
    }
  });

  // Fetching toys from the API
  fetch("http://localhost:3000/toys")
    .then(res => res.json())
    .then(toys => toys.forEach(renderToyCard));

  //  handling form submission
  toyForm.addEventListener("submit", e => {
    e.preventDefault();
    const name = e.target.name.value;
    const image = e.target.image.value;

    const toyData = {
      name,
      image,
      likes: 0
    };

    fetch("http://localhost:3000/toys", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json"
      },
      body: JSON.stringify(toyData)
    })
      .then(res => res.json())
      .then(newToy => {
        renderToyCard(newToy);
        e.target.reset(); // clear form
      });
  });

  // rendering toy

  function renderToyCard(toy) {
    const card = document.createElement("div");
    card.className = "card";

    const h2 = document.createElement("h2");
    h2.textContent = toy.name;

    const img = document.createElement("img");
    img.src = toy.image;
    img.className = "toy-avatar";

    const p = document.createElement("p");
    p.textContent = `${toy.likes} Likes`;

    const button = document.createElement("button");
    button.className = "like-btn";
    button.id = toy.id;
    button.textContent = "Like ❤️";

    // Like button click event
    button.addEventListener("click", () => {
      const newLikes = toy.likes + 1;

      fetch(`http://localhost:3000/toys/${toy.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json"
        },
        body: JSON.stringify({ likes: newLikes })
      })
        .then(res => res.json())
        .then(updatedToy => {
          toy.likes = updatedToy.likes;
          p.textContent = `${updatedToy.likes} Likes`;
        });
    });

    card.append(h2, img, p, button);
    toyCollection.appendChild(card);
  }
});
