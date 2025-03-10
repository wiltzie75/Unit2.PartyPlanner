const API_URL = "https://fsa-crud-2aa9294fe819.herokuapp.com/api/2502-FTB-ET-WEB-FT/events";

const state = {
    parties: [],
};

const partyList = document.querySelector("#partyList");

const addPartyForm = document.querySelector("#partyForm");
addPartyForm.addEventListener("submit", addParty);


/**
 * Sync state with the API and rerender
 */
async function render() {
    await getParties();
    renderParties();
  }
  render();

/**
 * Update state with guests from API
 */
async function getParties() {
    try {
      const response = await fetch(API_URL);
      const json = await response.json();
      console.log(json.data);
      state.parties = json.data;
    } catch (error) {
      console.log(error);  
    }
}

async function addParty(event) {
    event.preventDefault();

    await createParty(
      addPartyForm.name.value,
      new Date(addPartyForm.date.value).toISOString(),
      addPartyForm.description.value,
      addPartyForm.location.value
    );
    addPartyForm.reset();
    render();
}

/** Asks the API to create a new artist based on the given `artist` */
async function createParty(name, date, description, location) {
    try {
      const response = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({name, date, description, location}),
      });
      const json = await response.json();
  
      if (json.error) {
        throw new Error(json.error.message);
      }
    } catch (error) {
      console.error(error);
    }
    render();
  }

async function updateParty(id, name, date, description, location) {
    // This is almost identical to `createRecipe` but uses the PUT method
    try {
      const response = await fetch(`${API_URL}/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({name, date, description, location}),
      });
      const json = await response.json();
  
      if (json.error) {
        throw new Error(json.error.message);
      }
    } catch (error) {
      console.error(error);
    }
    render();
}

async function deleteParty(id) {
    // TODO
    try {
      const response = await fetch(`${API_URL}/${id}`, {
        method: "DELETE",
      });
    } catch (error) {
      console.error(error);
    }
    render();
}
render();
/**
 * Render guests from state
 */
function renderParties() {
    if (!state.parties.length) {
      partyList.innerHTML =
        /*html*/
        `<li>No guests found.</li>`;
      return;
    }

    const partiesCards = state.parties.map((party) => {
      const partyCard = document.createElement("li");
      partyCard.classList.add("party");
      partyCard.innerHTML = /*html*/ `
        <h2>${party.name}</h2>
        <p>${party.date}</p>
        <p>${party.description}</p>
        <p>${party.location}</p>
      `;
  
    const deleteButton = document.createElement("button");
      deleteButton.textContent = "Delete party";
      partyCard.append(deleteButton);
  
      // Access the correct guest id
      deleteButton.addEventListener("click", () => deleteParty(party.id));
  
      return partyCard;
    });
    partyList.replaceChildren(...partiesCards);
  }