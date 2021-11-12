const root = document.getElementById('root');
const tweetStorage = window.localStorage;
const maxMessageLength = 140;
const zero = 0;
const one = 1;
const notificationTimeOut = 2000;

const tweetItems = root.querySelector('#tweetItems');
const tweetsList = root.querySelector('#list');

const mainHeader = tweetItems.querySelector('h1');

const textForm = root.querySelector('#modifyItem');
const formInput = root.querySelector('#modifyItemInput');

const navigationButtons = root.querySelector('#navigationButtons');

const modifyItemHeader = root.querySelector('#modifyItemHeader');

const buttonCancel = root.querySelector('#cancelModification');
const buttonSave = root.querySelector('#saveModifiedItem');
const buttonAdd = root.querySelector('.addTweet');

const alertMessageContainer = root.querySelector('#alertMessage');
const alertMessageText = root.querySelector('#alertMessageText');

const buttonBack = document.createElement('button');
buttonBack.classList = 'back_button';
buttonBack.innerText = 'back';
buttonBack.classList.add('hidden');
navigationButtons.appendChild(buttonBack);

const buttonGoToLiked = document.createElement('button');
buttonGoToLiked.classList = 'liked_button';
buttonGoToLiked.innerText = 'Liked';
buttonGoToLiked.classList.add('hidden');
buttonGoToLiked.addEventListener('click', function () {
    location.hash = '#/liked';
});
navigationButtons.appendChild(buttonGoToLiked);

const getAllTweets = () => {
    return JSON.parse(tweetStorage.getItem('tweets')) || [];
}

const getLikedTweets = () => {
    const tweets = getAllTweets();
    let liked = [];

    tweets.forEach(function (tweet) {
        if (tweet.likes > 0) {
            liked.push(tweet);
        }
    });

    return liked;
}

const renderTweets = (tweets) => {
    let tweetsMarkup = '';
    tweets.map(tweet => {
        const tweetMarkup = '' +
            '<li class="tweet_wrapper" id="'+tweet.id+'">' +
            '<div class="tweet_message" data-id="'+tweet.id+'">'+ tweet.message +'</div>' +
            '<div class="tweet_buttons">'+
            '<button class="tweet_remove" data-id="'+tweet.id+'"></button>' +
            '<button class="tweet_like likes'+ tweet.likes + '" data-id="'+tweet.id+'"></button>' +
            '</div>' +
            '</li>';
        tweetsMarkup += tweetMarkup;
        return 1;
    })

    return tweetsMarkup;
}

const updateTweets = () => {
    tweetsList.innerHTML = renderTweets(getAllTweets());
    addEventListenersToLikesButtons();
    addEventListenersToRemoveButtons();
    addEventListenersToMessages();
    return 1;
}

const renderMainPage = () => {
    mainHeader.innerText = 'Simple Twitter';
    buttonBack.classList.add('hidden');

    buttonAdd.classList.remove('hidden');

    tweetItems.classList.remove('hidden');
    textForm.classList.add('hidden');
    tweetsList.innerHTML = renderTweets(getAllTweets());

    buttonAdd.addEventListener('click', function () {
        location.hash = '#/add';
    })
}

const renderEditPage = (tweetID) => {
    let tweets = getAllTweets();
    const tweet = tweets.find(item => item.id === parseInt(tweetID));
    formInput.value = tweet.message;

    modifyItemHeader.innerText = 'Edit tweet';
    tweetItems.classList.add('hidden');
    textForm.classList.remove('hidden');

    buttonCancel.addEventListener('click', function () {
        goToMain();
    });

    buttonSave.addEventListener('click', function () {
        editTweet(tweetID);
    });
}

const renderAddPage = () => {
    tweetItems.classList.add('hidden');
    modifyItemHeader.innerText = 'Add tweet';
    textForm.classList.remove('hidden');

    buttonCancel.addEventListener('click', function () {
        goToMain();
    });

    buttonSave.addEventListener('click', function () {
        createTweet(getFormText());
    });
}

const renderLikedPage = () => {
    buttonAdd.classList.add('hidden');

    buttonBack.classList.remove('hidden');

    tweetItems.classList.remove('hidden');
    textForm.classList.add('hidden');
    mainHeader.innerText = 'Liked tweets';
    tweetsList.innerHTML = renderTweets(getLikedTweets());
    buttonBack.addEventListener('click', function () {
        goBack();
    })
}

const renderContent = (location) => {
    // Split [location] value to get pages and id of tweet;
    switch (location.split('/')[1]) {
        case 'add':
            renderAddPage();
            break;
        case 'edit':
            renderEditPage(location.split('/:')[1]);
            break;
        case 'liked':
            renderLikedPage();
            break;
        default:
            renderMainPage();
            break;
    }
}

const createTweet = (message) => {
    const isDuplicate = getAllTweets().find(item => item.message === message);

    if (isDuplicate) {
        showNotification('Error! You can\'t tweet about that');
    }

    if (!isDuplicate && message !== '' && message.length <= maxMessageLenght) {
        let tweets = getAllTweets();
        const lastTweetId = tweets.length === zero ? one : tweets[tweets.length - one].id + one;

        const newTweet = {
            id: lastTweetId,
            message: message,
            likes: 0
        };

        tweets.push(newTweet);
        tweetStorage.setItem('tweets', JSON.stringify(tweets));

        goToMain();
    }
}

const likeTweet = (id) => {
    let tweets = getAllTweets();
    const tweet = tweets.find(item => item.id === parseInt(id));
    tweet.likes === 0 ? setTweetLike(tweet) : setTweetDislike(tweet);
    tweetStorage.setItem('tweets', JSON.stringify(tweets));
    return 1;
}

const setTweetLike = (tweet) => {
    alert('Hooray! You liked tweet with id '+ tweet.id +'!');
    tweet.likes = 1;
    return tweet.likes;
}

const setTweetDislike = (tweet) => {
    alert('Sorry you no longer like tweet with id '+ tweet.id +'!');
    tweet.likes = 0;
    return tweet.likes;
}

const showNotification = (message) => {
    alertMessageContainer.classList.remove('hidden');
    alertMessageText.innerText = message;
    const hideMessageContainer = () => {
        alertMessageContainer.classList.add('hidden');
    }

    setTimeout(hideMessageContainer, notificationTimeOut);
}

const removeTweet = (id) => {
    let tweets = getAllTweets();
    tweets = tweets.filter(function (tweet) {
        return tweet.id !== parseInt(id)
    });
    tweetStorage.setItem('tweets', JSON.stringify(tweets));
    updateTweets();
}

const editTweet = (tweetID) => {
    let tweets = getAllTweets();

    const tweet = tweets.find(item => item.id === parseInt(tweetID));

    const isDuplicate = tweets.find(item => item.message === getFormText());

    if (isDuplicate) {
        showNotification('Error! You can\'t tweet about that');
        return 0;
    }

    tweet.message = getFormText();

    tweetStorage.setItem('tweets', JSON.stringify(tweets));

    goToMain();
}

const getFormText = () => {
    return formInput.value;
}

const goToMain = () => {
    location.href = 'index.html';
    return 1;
}

const goBack = () => {
    window.history.back();
    return 1;
}

const addEventListenersToLikesButtons = () => {
    const likeButtons = root.querySelectorAll('.tweet_like');
    likeButtons.forEach(function (button) {
        button.addEventListener('click', function () {
            likeTweet(button.dataset.id);
            updateTweets();
            showButtonLiked();
        })
    })
}

const showButtonLiked = () => {
    if (shouldShowButtonGoLiked()) {
        buttonGoToLiked.classList.remove('hidden');
    } else {
        buttonGoToLiked.classList.add('hidden');
    }
}

const shouldShowButtonGoLiked = () => {
    const likeButtons = root.querySelectorAll('.tweet_like');

    let shouldShow = false;
    likeButtons.forEach(function (button) {
        if (button.classList.contains('likes1')) {
            shouldShow = true;
        }
    })

    return shouldShow;
}

const addEventListenersToRemoveButtons = () => {
    const removeButtons = root.querySelectorAll('.tweet_remove');
    removeButtons.forEach(function (button) {
        button.addEventListener('click', function () {
            removeTweet(button.dataset.id);
            updateTweets();
        })
    })
}

const addEventListenersToMessages = () => {
    const messages = root.querySelectorAll('.tweet_message');
    messages.forEach(function (message) {
        message.addEventListener('click', function () {
            location.hash = '#/edit/:' + message.dataset.id;
        })
    })
}

const refreshPageContent = () => {
    renderContent(location.hash);
    addEventListenersToLikesButtons();
    addEventListenersToRemoveButtons();
    addEventListenersToMessages();
    showButtonLiked();
}

window.addEventListener('load', function () {
    refreshPageContent();
});

window.addEventListener('hashchange', function () {
    refreshPageContent();
});