const search = document.getElementById('search');
const submit = document.getElementById('submit');
const random = document.getElementById('random');
const mealEl = document.getElementById('meals');
const resultHeading = document.getElementById('result-heading');
const single_mealEl = document.getElementById('single-meal');

function searchMeal(e)  {
    e.preventDefault();

    single_mealEl.innerHTML = '';

    const term = search.value;

    if(term.trim()) {
        fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${term}`)
        .then(res => res.json())
        .then(data => {
                resultHeading.innerHTML = `<h2>Search results for ${term}:</h2>`;

                if(data.meals === null){
                    resultHeading.innerHTML = `<p>There are no Search results. Try agian!</p>`;
                }   else    {
                    mealEl.innerHTML = data.meals.map(meal =>`
                    <div class="meal">
                    <img src="${meal.strMealThumb}" alt="${meal.strMeal}" />
                        <div class="meal-info" data-mealID="${meal.idMeal}">
                            <h3>${meal.strMeal}</h3>
                        </div>
                    </div>
                    `).join('');
                }
            });
        search.value = '';
    }   else    {
            alert('Please enter a search term')
    }
    
}

function getMealById(ID)  {
    fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${ID}`)
    .then(res => res.json())
        .then(data => {
            const meal = data.meals[0];
            addDataToTheDOM(meal);
            });
}

function clearMealsResults(){
    mealEl.innerHTML = '';
    resultHeading.innerHTML = '';
}

function getRandomMeal()   {
    fetch(`https://www.themealdb.com/api/json/v1/1/random.php`)
    .then(res => res.json())
    .then(data => {
        const meal = data.meals[0];
        addDataToTheDOM(meal);
        });
}

function addDataToTheDOM(meal)  {
    clearMealsResults();
    const ingrediens = []
    const youtubeLink = meal.strYoutube ? meal.strYoutube.slice(32) : '';
    console.log(meal);
    for(let i = 1; i <= 20; i++){
        if(meal[`strIngredient${i}`])   {
            ingrediens.push(`${meal[`strIngredient${i}`]} - ${meal[`strMeasure${i}`]}`);
        }   else{
            break;
        }
    }
    single_mealEl.innerHTML = `
    <div class="single-meal">
    <h1>${meal.strMeal}</h1>
    <img src="${meal.strMealThumb}" alt="${meal.strMeal}"/>
        <div class="single-meal-info">
        ${meal.strCategory ? `<p>${meal.strCategory}</p>` : ''}  
        ${meal.strArea ? `<p>${meal.strArea}</p>` : ''}   
        ${meal.strTags ? `<p>${meal.strTags}</p>` : ''}
        </div>
        <div class="main">
        <p>${meal.strInstructions}</p>
        <h2>Instructions</h2>
        <ul>
        ${ingrediens.map(ing => `<li>${ing}</li>`).join('')}
        </ul>
        </div>
        <h2>Try it yourself:</h2>
        <iframe  
        src="https://www.youtube.com/embed/${youtubeLink}" 
        frameborder="0" 
        allow="autoplay; 
        encrypted-media" 
        allowfullscreen></iframe>
    </div>`;
}

submit.addEventListener('submit' , searchMeal);
random.addEventListener('click' , getRandomMeal);
mealEl.addEventListener('click', e => {
    const mealInfo = e.path.find(item => {
        if(item.classList)  {
            return item.classList.contains('meal-info');
        } else{
            return false;
        }
    });
    
    if(mealInfo)    {
        const mealID = mealInfo.getAttribute('data-mealid');
        getMealById(mealID);
    }
    
});