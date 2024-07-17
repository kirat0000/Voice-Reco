document.getElementById('microphone').addEventListener('click', () => {
    const microphoneIcon = document.getElementById('microphone');
    const isRecording = microphoneIcon.classList.contains('fa-microphone');
    if (isRecording) {
      microphoneIcon.classList.remove('fa-microphone');
      microphoneIcon.classList.add('fa-microphone-slash');
      // Stop recording logic here if needed
    } else {
      microphoneIcon.classList.remove('fa-microphone-slash');
      microphoneIcon.classList.add('fa-microphone');
      startVoiceRecognition();
    }
  });
  
  function startVoiceRecognition() {
    const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
    recognition.lang = 'en-US';
    recognition.start();
  
    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      console.log('Transcript:', transcript);
      processVoiceCommand(transcript);
      document.getElementById('microphone').classList.remove('fa-microphone');
      document.getElementById('microphone').classList.add('fa-microphone-slash');
    };
  }
  
  async function processVoiceCommand(command) {
    try {
      const response = await axios.get('https://api.wit.ai/message', {
        params: { q: command },
        headers: {
          Authorization: `Bearer 4IMD5K7H36HYHYCFXTEF57NCZWYACYQS`
        }
      });
  
      console.log('Wit.ai Response:', response.data);
  
      const entities = response.data.entities;
      console.log('Entities:', JSON.stringify(entities, null, 2));  // Log the entities in detail
  
      // Correctly access the 'food_food:food_food' entity
      const food = entities['food_food:food_food'] ? entities['food_food:food_food'][0].value : null;
      console.log('Extracted Food:', food);
  
      if (food) {
        fetchMealData(food);
      } else {
        console.log('No food entity found.');
      }
    } catch (error) {
      console.error('Error processing voice command:', error);
    }
  }
  
  function fetchMealData(query) {
    const url = `https://www.themealdb.com/api/json/v1/1/search.php?s=${query}`;
    fetch(url)
      .then(response => response.json())
      .then(data => {
        console.log('MealDB Response:', data);
        if (data.meals) {
          displayMeals(data.meals);
        } else {
          displayNoResults();
        }
      })
      .catch(error => console.error('Error fetching data:', error));
  }
  
  function displayMeals(meals) {
    const suggestionsList = document.getElementById('suggestions');
    suggestionsList.innerHTML = '';
    meals.forEach(meal => {
      const li = document.createElement('li');
      li.innerHTML = `
        <h2>${meal.strMeal}</h2>
        <img src="${meal.strMealThumb}" alt="${meal.strMeal}" style="width:200px; height:auto;">
      `;
      suggestionsList.appendChild(li);
    });
    console.log('Displayed meals:', meals);
  }
  
  function displayNoResults() {
    const suggestionsList = document.getElementById('suggestions');
    suggestionsList.innerHTML = '<li>No results found</li>';
    console.log('No results found');
  }
  