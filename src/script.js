function vkApi(method, options) {
    if (!options.v) {
        options.v = '5.64';
    }

    return new Promise((resolve, reject) => {
        VK.api(method, options, response => {
            if (response.error) {
                reject(new Error(response.error.error_msg));
            } else {
                resolve(response);
            }
        });
    })
}

function vkInit() {
    return new Promise((resolve, reject) => {
        VK.init({
            apiId: 6060252
        });

        VK.Auth.login(response => {
            if (response.session) {
                resolve(response);
            } else {
                reject(new Error('Не удалось авторизоваться'));
            }
        }, 2);
    })
}

const template = `
{{#each response.items}}
    <div class="friend">
        <img class="photo-100" src={{photo_100}}>
        <div class="name">{{first_name}} {{last_name}}</div>
        <div id="add"></div>
    </div>
    <div class="plank"></div>
{{/each}}
`;
const templateFunc = Handlebars.compile(template);

new Promise(resolve => {
    window.addEventListener('load', () => resolve());
})
    .then(() => vkInit())
    .then(() => vkApi('users.get', {
        name_case: 'gen'
    }))
    .then(response => {
        headerInfo.textContent = `Друзья ${response.response[0].first_name} ${response.response[0].last_name}`;
    })
    .then(() => vkApi('friends.get', {
        fields: 'photo_100'
    }))
    .then(response => friends.innerHTML = templateFunc(response))
    .catch(e => alert('Ошибка ' + e.message));
