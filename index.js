function createElement(tagName, className) {
    const element = document.createElement(tagName);
    if (className) element.classList.add(className);
    return element;
  }
  
  let input = document.querySelector('#body__input');
  let autocompleteList = document.querySelector('.body__list-autocomplete');
  let reposDiv = document.querySelector('.body__repos');
  let listRepos = document.querySelector('.body__list-repos');
  let listReposItem = document.querySelector('.body__list-repos__item');
  
  const debounce = (fn, debounceTime) => {
    let timerId
    return function (){
      clearTimeout(timerId)
      timerId = setTimeout(() => {
        fn.apply(this, arguments)
      }, debounceTime);
    };
  };
  
  async function requester() {
    let response = await fetch(`https://api.github.com/search/repositories?q=${input.value}`)
    let data = await response.json();
    let repoArr = data.items;
    autocompleteList.innerHTML = ''
    for ( let i = 0; i < 5; i++) {
  
      let liItem = createElement('li', 'body__list-autocomplete__item');
      liItem.innerText = repoArr[i].name;
      autocompleteList.append(liItem);
      liItem.addEventListener('click',  () => {
        createFavorite(repoArr[i].name, repoArr[i].owner.login, repoArr[i].stargazers_count, repoArr[i].id);
        input.value = '';
        autocompleteList.innerHTML = '';
      })
    }
  }
  
  function createFavorite(name, owner, stars, id) {
    let favoriteItem = createElement('li', 'body__list-repos__item');
    favoriteItem.id = id;
    let favoriteWrapper = createElement('div', 'favorite-wrapper');
    let favoriteSpanWrapper = createElement('div', 'favorite__span-wrapper');
    let favoriteName = createElement('span');
    let favoriteOwner = createElement('span');
    let favoriteStars = createElement('span');
    let favoriteDel = createElement('div', 'delete');
  
    favoriteName.innerHTML = `Name: ${name}`;
    favoriteOwner.innerHTML = `Owner: ${owner}`;
    favoriteStars.innerHTML = `Stars: ${stars}`;
  
    favoriteItem.append(favoriteWrapper);
    favoriteSpanWrapper.append(favoriteName);
    favoriteSpanWrapper.append(favoriteOwner);
    favoriteSpanWrapper.append(favoriteStars);
    favoriteWrapper.append(favoriteSpanWrapper);
    favoriteWrapper.append(favoriteDel);
    listRepos.append(favoriteItem);
  
    favoriteDel.addEventListener('click', () => {
      document.getElementById(id).remove()
    })
  };
  
  const fn = () => {
      requester();
  };
  
  const debouncedFn = debounce(fn, 500);
  input.addEventListener('input', debouncedFn);
  
  
  
  