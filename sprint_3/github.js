

const q = document.getElementById('q');
const clear = document.getElementById('clear');
const btn = document.getElementById('btn');
const msg = document.getElementById('msg');
const card = document.getElementById('card');
const load = document.getElementById('load');
const err = document.getElementById('err');
const list = document.getElementById('list');

const colors = {
    javascript: '#f1e05a',
    typescript: '#3178c6',
    html: '#e34c26',
    css: '#563d7c',
    python: '#3572a5',
    java: '#b07219',
    go: '#00add8',
    rust: '#dea584',
    c: '#555555',
    'c++': '#f34b7d',
    'c#': '#178600',
    ruby: '#701516',
    php: '#4f5d95',
    shell: '#89e051',
    swift: '#f05138',
    kotlin: '#a97bff',
    vue: '#41b883',
    dart: '#00b4ab'
};

const fmtDate = str => {
    if (!str) return '';
    return new Date(str).toLocaleDateString('en-US', {
        day: 'numeric',
        month: 'short',
        year: 'numeric'
    });
};

const setMeta = (elId, valId, val) => {
    const parent = document.getElementById(elId);
    const child = document.getElementById(valId);
    if (val) {
        child.innerText = val;
        parent.style.display = 'flex';
    } else {
        parent.style.display = 'none';
    }
};

const setLink = (elId, valId, url, txt) => {
    const parent = document.getElementById(elId);
    const child = document.getElementById(valId);
    if (url) {
        let href = url;
        if (!url.startsWith('http://') && !url.startsWith('https://')) {
            href = `https://${url}`;
        }
        child.href = href;
        child.innerText = txt || url;
        parent.style.display = 'flex';
    } else {
        parent.style.display = 'none';
    }
};

q.addEventListener('input', () => {
    clear.style.display = q.value.trim() ? 'flex' : 'none';
});

clear.addEventListener('click', () => {
    q.value = '';
    clear.style.display = 'none';
    q.focus();
});

q.addEventListener('keypress', e => {
    if (e.key === 'Enter') search(q.value.trim());
});

btn.addEventListener('click', () => search(q.value.trim()));

async function search(user) {
    if (!user) return;

    card.style.display = 'none';
    err.style.display = 'none';
    load.style.display = 'block';
    msg.innerText = '';

    try {
        const res = await fetch(`https://api.github.com/users/${user}`);
        if (res.status === 404) throw new Error('Not Found');
        if (!res.ok) throw new Error('API Error');

        const data = await res.json();


        document.getElementById('avatar').src = data.avatar_url;
        document.getElementById('name').innerText = data.name || data.login;

        const userLink = document.getElementById('user');
        userLink.innerText = `@${data.login}`;
        userLink.href = data.html_url;

        document.getElementById('bio').innerText = data.bio || 'This developer profile has no bio.';


        document.getElementById('repos').innerText = data.public_repos;
        document.getElementById('followers').innerText = data.followers;
        document.getElementById('following').innerText = data.following;


        setMeta('c-company', 'val-company', data.company);
        setMeta('c-loc', 'val-loc', data.location);
        setMeta('c-date', 'val-date', `Joined ${fmtDate(data.created_at)}`);

        setLink('c-web', 'val-web', data.blog);
        setLink('c-tw', 'val-tw', data.twitter_username ? `https://twitter.com/${data.twitter_username}` : null, data.twitter_username ? `@${data.twitter_username}` : null);

        document.getElementById('link').href = data.html_url;

        const reposRes = await fetch(`${data.repos_url}?per_page=100`);
        if (reposRes.ok) {
            const repos = await reposRes.json();
            repos.sort((a, b) => b.stargazers_count - a.stargazers_count);

            list.innerHTML = '';
            const topRepos = repos.slice(0, 6);

            if (topRepos.length === 0) {
                list.innerHTML = '<p class="empty" style="grid-column: 1/-1; text-align: center; color: var(--text-secondary); font-size: 14px; padding: 20px;">No public repositories available.</p>';
            } else {
                topRepos.forEach(repo => {
                    const item = document.createElement('a');
                    item.className = 'repo';
                    item.href = repo.html_url;
                    item.target = '_blank';

                    const lang = repo.language ? repo.language.toLowerCase() : null;
                    const dot = lang && colors[lang] ? colors[lang] : '#8b949e';

                    item.innerHTML = `
                        <div class="top">
                            <div class="title">
                                <svg viewBox="0 0 24 24" width="16" height="16"><path fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"></path></svg>
                                <span class="name" title="${repo.name}">${repo.name}</span>
                            </div>
                            <p class="desc">${repo.description || 'No description provided.'}</p>
                        </div>
                        <div class="row">
                            ${repo.language ? `
                                <div class="lang">
                                    <span class="dot" style="background-color: ${dot}"></span>
                                    <span>${repo.language}</span>
                                </div>
                            ` : ''}
                            <div class="stars">
                                <svg viewBox="0 0 24 24" width="12" height="12"><path fill="currentColor" d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"></path></svg>
                                <span>${repo.stargazers_count}</span>
                            </div>
                            <div class="forks">
                                <svg viewBox="0 0 24 24" width="12" height="12"><path fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" d="M6 3v12a3 3 0 003 3h6a3 3 0 003-3V3M18 6h-6m6 12h-6M6 6H4M6 12H4"></path></svg>
                                <span>${repo.forks_count}</span>
                            </div>
                        </div>
                    `;
                    list.appendChild(item);
                });
            }
        }

        load.style.display = 'none';
        card.style.display = 'flex';

    } catch (e) {
        console.error(e);
        load.style.display = 'none';
        err.style.display = 'flex';
    }
}
