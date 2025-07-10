

const searchBtn = document.getElementById("searchBtn");
const clearBtn = document.getElementById("clearBtn");
const resultDiv =  document.getElementById("result");

function clearHandle(){
  document.getElementById("searchInput").value = "";
  resultDiv.innerHTML="";
}

function searchHandle(){
  const input = document.getElementById("searchInput");
  const inputText = input.value.trim().toLowerCase();
  if (inputText != ""){
    resultDiv.innerHTML = "";
    fetch("../data/travel_recommendation_api.json")
      .then(response => response.json())
      .then(data => {
        let matches = [];
        //traverse each country and its cities
        data.countries.forEach(country => {
          if (country.name.toLowerCase().includes(inputText)){
            matches.push({
              name: country.name,
           //   image: country.cities[0].imageUrl,
              description: `Enjoy the beauty of ${country.name}!`
            });
          }
            
            country.cities.forEach(city =>{
              if (city.name.toLowerCase().includes(inputText)){
                matches.push({
                  name: city.name,
                  image: city.imageUrl,
                  description: city.description
                })
              }
            });
        });

        //if input is temple or temples, show all temples
        if(["temple", "temples"].includes(inputText)){
          matches.push(...data.temples);
        } else{  //traverse temples if specific one was typed in
          data.temples.forEach(temple =>{
            if(temple.name.toLowerCase().includes(inputText)){
              matches.push({
                name: temple.name,
                image: temple.imageUrl,
                description: temple.description
              });
            }
          });
        }

        //if input is beach or beaches, show all beaches
        if(["beach", "beaches"].includes(inputText)){
          matches.push(...data.beaches);
        } else{//traverse all beaches if specific one is typed in
          data.beaches.forEach(beach =>{
            if(beach.name.toLowerCase().includes(inputText)){
              matches.push({
                name: beach.name,
                image: beach.imageUrl,
                description: beach.description
              });
            }
          });
        }

        displayResult(matches);
      })
      .catch(error =>{
        console.log("There was an error fetching the data: ", error);
        resultDiv.innerHTML = "<p>Error loading data</p>";
      });
  }
}

function displayResult(matches){
  if (matches.length === 0){
    resultDiv.innerHTML = "<p>No results were found for this serach.</p>";
    return;
  }
  matches.forEach(match =>{
    const res = document.createElement("div");
    res.className = "result-rectangle";

    res.innerHTML = `
      <img src="${match.image}" alt="image of ${match.name}" style="max-width: 200px;">
      <h3>${match.name}</h3>
      <p>${match.description}</p>
    `;
    resultDiv.appendChild(res);
  });  
}