const app = require('express')();
app.use(require('cors')())
const fetch = (...args) => import('node-fetch').then(({ default: fetch }) => fetch(...args));
const { verify } = require('hcaptcha');
const bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
let users = [];
const fetchUserData = (id) => {
    return fetch(`http://localhost:3001/user/${id}`)
        .then((response) => response.json())
        .then((data) => data)
        .catch((err) => {
            console.log(err);
            throw err; r
        });
};

function logRequest(req, res, next) {
    //console.log(`${req.method} ${req.url}`);
    next();
}
app.get('/favicon.ico', (req, res) => {
    res.sendFile('/SFMG.png', { root: __dirname });
})
app.get('/', (req, res) => {
    res.sendFile('/index.html', { root: __dirname });
})
app.get('/videos/:id', (req, res) => {
    res.sendFile('/video.html', { root: __dirname });
})
app.get('/trending', (req, res) => {
    res.sendFile('/trending.html', { root: __dirname });
})
app.get('/old', (req, res) => {
    res.sendFile('/old.html', { root: __dirname });
})
app.get('/search', (req, res) => {
    res.sendFile('/search.html', { root: __dirname });
})
app.get('/user', (req, res) => {
    res.sendFile('/user.html', { root: __dirname });
})
app.get('/live', (req, res) => {
    res.sendFile('/live.html', { root: __dirname });
})
app.get('/edit', (req, res) => {
    res.sendFile('/edit.html', { root: __dirname });
})
app.get('/verified.png', (req, res) => {
    res.sendFile('/verified.png', { root: __dirname });
})
app.get('/default.png', (req, res) => {
    res.sendFile('/default.png', { root: __dirname });
})
app.get('/bootstrap.css', (req, res) => {
    res.sendFile('/bootstrap.css', { root: __dirname });
})
app.get('/bootstrap.js', (req, res) => {
    res.sendFile('/bootstrap.js', { root: __dirname });
})
app.get('/jquery.js', (req, res) => {
    res.sendFile('/jquery.js', { root: __dirname });
})
app.get('/user2', (req, res) => {
    res.sendFile('/user.html', { root: __dirname });
})
app.get('/graph', (req, res) => {
    res.sendFile('/graph.html', { root: __dirname });
})
app.get('/highstock.js', (req, res) => {
    res.sendFile('/highstock.js', { root: __dirname });
})
app.get('/compare', (req, res) => {
    res.sendFile('/compare.html', { root: __dirname });
})
app.get('/odometer.js', (req, res) => {
    res.sendFile('/odometer.js', { root: __dirname });
})
app.get('/odometer.css', (req, res) => {
    res.sendFile('/odometer.css', { root: __dirname });
})
app.get('/login', (req, res) => {
    res.sendFile('/login.html', { root: __dirname });
})

app.post('/connect/:cid', (req, res) => {
    logRequest(req, res, () => { });
    fetch('http://localhost:3001/connect/' + req.params.cid + '', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(req.body)
    })
        .then(response => response.json())
        .then(data => res.send(data))
        .catch(err => { });
})

app.post('/login', (req, res) => {
    logRequest(req, res, () => { });
    fetch('http://localhost:3001/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(req.body)
    })
        .then(response => response.json())
        .then(data => res.send(data))
        .catch(err => { });
})

app.get('/check/:cid', (req, res) => {
    logRequest(req, res, () => { });
    fetch('http://localhost:3001/check/' + req.params.cid)
        .then(response => response.json())
        .then(data => res.send(data))
        .catch(err => { });
})

app.post('/search2', (req, res) => {
    console.log(req.body);
    logRequest(req, res, () => { });
    let user = users.find(user => user.name == req.body.name);
    if (user) {
        user.name = user.name.replace(/</g, "&lt;").replace(/>/g, "&gt;");
        res.send(user);
    } else {
        res.send({ error: 'User not found' });
    }
})

app.get('/me', (req, res) => {
    logRequest(req, res, () => { });
    let authToken = req.headers.authorization;
    if (authToken) {
        fetch('http://localhost:3001/me/' + authToken)
            .then(response => response.json())
            .then(data => res.send(data))
            .catch(err => { });
    } else {
        res.send({ error: 'No auth token' });
    }
})

app.get('/all', (req, res) => {
    logRequest(req, res, () => { });
    let data = users
    let data2 = [];
    for (let i = 0; i < data.length; i++) {
        data2.push({
            "cid": data[i].cid,
            "name": data[i].name.replace(/</g, "&lt;").replace(/>/g, "&gt;"),
            "subs": data[i].subs,
            "image": data[i].image,
            "verified": data[i].verified,
            "commands": data[i].commands,
            "videos": data[i].videos,
            "shorts": data[i].shorts,
            "streams": data[i].streams,
            "songs": data[i].songs,
            "posts": data[i].posts,
            "comments": data[i].comments,
            "playlists": data[i].playlists,
            "podcasts": data[i].podcasts,
            "stories": data[i].stories,
            "playlists": data[i].playlists,
            "lastMSG": data[i].lastMSG,
            "views": data[i].views,
            "likes": data[i].likes,
            "dislikes": data[i].dislikes,
            "commentCount": data[i].commentCount
        })
    }
    res.send(data2);
});

app.get('/stats/:cid', (req, res) => {
    logRequest(req, res, () => { });
    fetch('http://localhost:3001/user/' + req.params.cid)
        .then(response => response.json())
        .then(data => res.send({ "list": data.list }))
        .catch(err => { });
})

app.get('/loadmore/:id/:type/:sort/:min/:max', async (req, res) => {
    try {
        logRequest(req, res, () => { });
        const userData = await fetchUserData(req.params.id);
        const type = req.params.type;
        const sort = req.params.sort;
        const min = Number(req.params.min);
        const max = Number(req.params.max);
        let response;
        if (type === 'all') {
            response = {
                videoList: userData.videoList
                    .sort((a, b) => b.posted - a.posted)
                    .slice(min, max),
                streamList: userData.streamList
                    .sort((a, b) => b.posted - a.posted)
                    .slice(min, max),
                shortList: userData.shortList
                    .sort((a, b) => b.posted - a.posted)
                    .slice(min, max),
                songList: userData.songList
                    .sort((a, b) => b.posted - a.posted)
                    .slice(min, max),
                podcastList: userData.podcastList
                    .sort((a, b) => b.posted - a.posted)
                    .slice(min, max),
                storyList: userData.storyList
                    .sort((a, b) => b.posted - a.posted)
                    .slice(min, max),
                playlistList: userData.playlistList
                    .sort((a, b) => b.posted - a.posted)
                    .slice(min, max),
                postList: userData.postList
                    .sort((a, b) => b.posted - a.posted)
                    .slice(min, max),
                commentList: userData.commentList
                    .sort((a, b) => b.posted - a.posted)
                    .slice(min, max),
            };
        } else {
            let dataList = userData[`${type.slice(0, -1)}List`];
            if (type === 'stories') {
                dataList = userData.storyList;
            }
            if (['videos', 'streams', 'shorts', 'songs', 'podcasts'].includes(type)) {
                if (sort === 'views') {
                    dataList.sort((a, b) => b.views - a.views);
                } else if (sort === 'likes') {
                    dataList.sort((a, b) => b.likes - a.likes);
                } else if (sort === 'dislikes') {
                    dataList.sort((a, b) => b.dislikes - a.dislikes);
                } else if (sort === 'date') {
                    dataList.sort((a, b) => b.posted - a.posted);
                    dataList.reverse();
                } else if (sort === 'length') {
                    dataList.sort((a, b) => b.length - a.length);
                } else if (sort === 'watchtime') {
                    dataList.sort((a, b) => b.algorithm.watchtime - a.algorithm.watchtime);
                } else if (sort === 'comments') {
                    dataList.sort((a, b) => b.commentCount - a.commentCount);
                } else if (sort === 'algorithm') {
                    dataList.sort((a, b) => b.inAlgorithm - a.inAlgorithm);
                }
            } else if (type === 'posts') {
                if (sort === 'likes') {
                    dataList.sort((a, b) => b.likes - a.likes);
                } else if (sort === 'comments') {
                    dataList.sort((a, b) => b.commentCount - a.commentCount);
                } else if (sort === 'date') {
                    dataList.sort((a, b) => b.posted - a.posted);
                    dataList.reverse();
                }
            } else if (type === 'comments') {
                if (sort === 'likes') {
                    dataList.sort((a, b) => b.likes - a.likes);
                } else if (sort === 'date') {
                    dataList.sort((a, b) => b.posted - a.posted);
                    dataList.reverse();
                } else if (sort === 'replies') {
                    dataList.sort((a, b) => b.replies - a.replies);
                }
            } else if (type === 'playlists') {
                if (sort === 'views') {
                    dataList.sort((a, b) => b.views - a.views);
                } else if (sort === 'videos') {
                    dataList.sort((a, b) => b.videos - a.videos);
                } else if (sort === 'date') {
                    dataList.sort((a, b) => b.posted - a.posted);
                    dataList.reverse();
                }
            } else if (type === 'stories') {
                if (sort === 'views') {
                    dataList.sort((a, b) => b.views - a.views);
                } else if (sort === 'likes') {
                    dataList.sort((a, b) => b.likes - a.likes);
                } else if (sort === 'comments') {
                    dataList.sort((a, b) => b.commentCount - a.commentCount);
                } else if (sort === 'date') {
                    dataList.sort((a, b) => b.posted - a.posted);
                    dataList.reverse();
                }
            } else {
                res.send({ error: 'Invalid type' });
                return;
            }
            response = dataList.slice(min, max);
        }
        res.send(response);
    } catch (err) {
        console.log(err);
        res.status(500).send({ error: 'An error occurred' });
    }
});


app.get('/video/:ids', async (req, res) => {
    try {
        const [vid, cid] = req.params.ids.split('!');
        logRequest(req, res, () => { });
        const userData = await fetchUserData(cid);
        let video = userData.videoList.find((video) => video.id == vid)
            || userData.streamList.find((stream) => stream.id == vid)
            || userData.shortList.find((short) => short.id == vid)
            || userData.songList.find((song) => song.id == vid)
            || userData.podcastList.find((podcast) => podcast.id == vid)
            || userData.storyList.find((story) => story.id == vid)
        if (video) {
            res.send(video);
        } else {
            res.send({ error: 'Video not found' });
        }
    } catch (err) {
        res.send({ error: 'Video not found' });
    }
});


app.get('/user2/:id', (req, res) => {
    logRequest(req, res, () => { });
    fetch(`http://localhost:3001/user2/${req.params.id}`)
        .then(response => response.json())
        .then(data => {
            res.send({
                "cid": data.id,
                "name": data.name.replace(/</g, "&lt;").replace(/>/g, "&gt;"),
                "subs": data.subs,
                "image": data.image,
                "verified": data.verified,
                "commands": data.commands,
                "videos": data.videos,
                "shorts": data.shorts,
                "streams": data.streams,
                "songs": data.songs,
                "posts": data.posts,
                "comments": data.comments,
                "playlists": data.playlists,
                "lastMSG": data.lastMSG,
                "views": data.views,
                "likes": data.likes,
                "dislikes": data.dislikes,
                "commentCount": data.commentCount,
                "podcasts": data.podcasts,
                "stories": data.stories
            })
        })
        .catch(err => { });
});

app.get('/delete', (req, res) => {
    logRequest(req, res, () => { });
    let authToken = req.headers.authorization;
    if (authToken) {
        fetch('http://localhost:3001/delete/' + authToken)
            .then(response => response.json())
            .then(data => res.send(data))
            .catch(err => { });
    } else {
        res.send({ error: 'No auth token' });
    }
});

let useableTokens = [];
let tokenCreated = [];

let actionNormalCooldowns = {
    "community": 31,
    "comment": 31,
    "playlist": 31,
    "song": 61,
    "stream": 61,
    "short": 66,
    "upload": 71,
    "daily": 86400,
    "hourly": 3600,
    "collab": 61,
    "drama": 61,
    "shoutout": 61,
    "story": 31,
    "podcast": 61,
}

app.get('/site', (req, res) => {
    res.sendFile('/site.html', { root: __dirname });
})

app.get('/SFMG_Home_website.png', (req, res) => {
    res.sendFile('/SFMG_Home_website.png', { root: __dirname });
})

app.get('/sfmg.png', (req, res) => {
    res.sendFile('/SFMG.png', { root: __dirname });
})

const rateLimits = new Map();

app.post('/action/:action', async (req, res) => {
    logRequest(req, res, () => { });
    const authToken = req.headers.authorization;
    const token = req.headers['hcaptcha'];
    if (rateLimits.has(authToken) && rateLimits.get(authToken).type === req.params.action) {
        const rateLimit = rateLimits.get(authToken);
        if (rateLimit.start + rateLimit.duration * 1000 > Date.now()) {
            res.send({ error: 'Cooldown, seconds left: ' + Math.round((rateLimit.start + rateLimit.duration * 1000 - Date.now()) / 1000) });
            return;
        } else {
            rateLimits.delete(authToken);
        }
    }
    if (!token) {
        res.send({ error: 'No captcha token' });
        return;
    }
    if (useableTokens.includes(token)) {
        if (tokenCreated[useableTokens.indexOf(token)] + 600000 > Date.now()) {
            if (!authToken) {
                res.send({ error: 'No auth token' });
                return;
            }
            try {
                const response = await fetch(`http://localhost:3001/action/!${req.params.action}/${authToken}`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        title: req.body.title,
                    }),
                });
                const data = await response.json();
                if (data.success === false) {
                    rateLimits.set(authToken, {
                        token: authToken,
                        type: req.params.action,
                        duration: data.cooldown + 1,
                        start: Date.now(),
                    });
                }
                rateLimits.set(authToken, {
                    token: authToken,
                    type: req.params.action,
                    duration: actionNormalCooldowns[req.params.action],
                    start: Date.now(),
                });
                res.send(data);
            } catch (err) {
                console.log(err);
                res.send({ error: 'An error occurred' });
            }
        } else {
            res.send({ error: 'Captcha expired' });
        }
    } else {
        try {
            const data = await verify(secret, token);
            if (data.success) {
                if (!authToken) {
                    res.send({ error: 'No auth token' });
                    return;
                }
                const response = await fetch(`http://localhost:3001/action/!${req.params.action}/${authToken}`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        title: req.body.title,
                    }),
                });
                const responseData = await response.json();
                if (responseData.success === false) {
                    rateLimits.set(authToken, {
                        token: authToken,
                        type: req.params.action,
                        duration: responseData.cooldown + 1,
                        start: Date.now(),
                    });
                }
                useableTokens.push(token);
                tokenCreated.push(Date.now());
                rateLimits.set(authToken, {
                    token: authToken,
                    type: req.params.action,
                    duration: actionNormalCooldowns[req.params.action],
                    start: Date.now(),
                });
                res.send(responseData);
            } else {
                res.send({ error: 'Captcha failed' });
            }
        } catch (err) {
            console.log(err);
            res.send({ error: 'An error occurred' });
        }
    }
});

let uploads = {
    "videos": [],
    "shorts": [],
    "streams": [],
    "songs": [],
    "podcasts": [],
    "posts": [],
    "comments": [],
    "playlists": [],
    "stories": []
}
let stats = {
    "total": 0,
    "videos": 0,
    "shorts": 0,
    "streams": 0,
    "songs": 0,
    "podcasts": 0,
    "posts": 0,
    "comments": 0,
    "playlists": 0,
    "stories": 0,
    "activeUsers": 0,
    "battle": {},
    "totalViews": 0,
    "totalSubs": 0,
    "totalLikes": 0,
    "totalDislikes": 0,
    "totalComments": 0,
    "totalCommands": 0,
    "totalMessages": 0,
    "totalUsers": 0,
    "verifiedUsers": 0,
    "videosInAlgorithm": 0,
    "shortsInAlgorithm": 0,
    "streamsInAlgorithm": 0,
    "songsInAlgorithm": 0,
    "podcastsInAlgorithm": 0,
    "totalAlgorithm": 0,
    "version": "4.5.4",
}

app.get('/stats', (req, res) => {
    logRequest(req, res, () => { });
    res.send(stats);
});

app.post('/search', (req, res) => {
    let term = req.body.search;
    //search for name in users array
    let results = [];
    for (let i = 0; i < users.length; i++) {
        if (users[i].name.toLowerCase().includes(term.toLowerCase())) {
            results.push(users[i]);
        }
    }
    res.send(results);
});

function getUploads() {
    Promise.all([
        fetch('http://localhost:3001/videos').then(response => response.json()),
        fetch('http://localhost:3001/all2').then(response => response.json())
    ])
        .then(([videosData, allData]) => {
            let uploads2 = {
                "all": videosData,
                "videos": [],
                "shorts": [],
                "streams": [],
                "songs": [],
                "podcasts": [],
                "posts": [],
                "comments": [],
                "playlists": [],
                "stories": []
            };
            for (let q = 0; q < videosData.length; q++) {
                uploads2[videosData[q].type].push(videosData[q]);
            }
            uploads = uploads2;
            stats["videosInAlgorithm"] = uploads2["videos"].filter(video => video.inAlgorithm == true).length;
            stats["shortsInAlgorithm"] = uploads2["shorts"].filter(video => video.inAlgorithm == true).length;
            stats["streamsInAlgorithm"] = uploads2["streams"].filter(video => video.inAlgorithm == true).length;
            stats["songsInAlgorithm"] = uploads2["songs"].filter(video => video.inAlgorithm == true).length;
            stats["podcastsInAlgorithm"] = uploads2["podcasts"].filter(video => video.inAlgorithm == true).length;
            stats["videos"] = uploads2["videos"].length;
            stats["shorts"] = uploads2["shorts"].length;
            stats["streams"] = uploads2["streams"].length;
            stats["songs"] = uploads2["songs"].length;
            stats["podcasts"] = uploads2["podcasts"].length;
            stats["posts"] = uploads2["posts"].length;
            stats["comments"] = uploads2["comments"].length;
            stats["playlists"] = uploads2["playlists"].length;
            stats["stories"] = uploads2["stories"].length;
            stats["total"] = stats["videos"] + stats["shorts"] + stats["streams"] + stats["songs"] + stats["podcasts"] + stats["posts"] + stats["comments"] + stats["playlists"] + stats["stories"];
            stats["totalAlgorithm"] = stats["videosInAlgorithm"] + stats["shortsInAlgorithm"] + stats["streamsInAlgorithm"] + stats["songsInAlgorithm"] + stats["podcastsInAlgorithm"];
            let views = 0;
            let subs = 0;
            let likes = 0;
            let dislikes = 0;
            let comments = 0;
            let commands = 0;
            allData.users.forEach(({ name, views: userViews, subs: userSubs, likes: userLikes, dislikes: userDislikes, comments: userComments, commands: userCommands }) => {
                name = name.replace(/</g, "&lt;").replace(/>/g, "&gt;");
                views += userViews;
                subs += userSubs;
                likes += userLikes;
                dislikes += userDislikes;
                comments += userComments;
                commands += userCommands;
            });
            users = allData.users;
            mostSubs = [...allData.users].sort((a, b) => b.subs - a.subs).slice(0, 10);
            mostViews = [...allData.users].sort((a, b) => b.views - a.views).slice(0, 10);
            mostNew = [...allData.users].sort((a, b) => b.lastMSG - a.lastMSG).slice(0, 10);
            stats["totalViews"] = views;
            stats["totalSubs"] = subs;
            stats["totalLikes"] = likes;
            stats["totalDislikes"] = dislikes;
            stats["totalComments"] = comments;
            stats["totalCommands"] = commands;
            stats["totalUsers"] = allData.users.length;
            stats["verifiedUsers"] = allData.users.filter(user => user.verified).length;
            stats["battle"] = allData.battle;
            stats["totalMessages"] = parseFloat(allData.messages);
            stats["activeUsers"] = allData.users.filter(user => user.lastMSG > Date.now() - 600000).length;
        })
        .catch(err => { });
}
getUploads()
setInterval(getUploads, 10000)

app.get('/trending2/:type', (req, res) => {
    let type = req.params.type;
    logRequest(req, res, () => { });
    if (type == 'channels') {
        let users2 = [...users]
        users2 = users2.sort((a, b) => b.fast.reduce((a, b) => a + b) / b.fast.length - a.fast.reduce((a, b) => a + b) / a.fast.length);
        for (let i = 0; i < users2.length; i++) {
            users2[i].gain = users2[i].fast.reduce((a, b) => a + b) / users2[i].fast.length;
        }
        res.send(users2.slice(0, 9));
    } else if (type == 'all') {
        let response = { "videos": [], "shorts": [], "streams": [], "songs": [], "podcasts": [] };
        for (let q = 0; q < 5; q++) {
            let type = Object.keys(response)[q];
            let uploads3 = [...uploads[type]]
            uploads3 = uploads3.filter(video => video.inAlgorithm);
            uploads3 = uploads3.sort((a, b) => (b.views - b.last) - (a.views - a.last));
            uploads3 = uploads3.slice(0, 9);
            for (let i = 0; i < uploads3.length; i++) {
                uploads3[i].gain = uploads3[i].views - uploads3[i].last;
                uploads3[i].uploader = users.find(user => user.cid == uploads3[i].owner);
                uploads3[i] = {
                    "id": uploads3[i].id,
                    "title": uploads3[i].title,
                    "views": uploads3[i].views,
                    "gain": uploads3[i].gain,
                    "uploader": {
                        name: uploads3[i].uploader.name,
                        cid: uploads3[i].uploader.cid,
                        image: uploads3[i].uploader.image
                    }
                }
            }
            response[type] = uploads3;
        }
        res.send(response);
    } else {
        let uploads3 = [...uploads[req.params.type]]
        uploads3 = uploads3.filter(video => video.inAlgorithm);
        uploads3 = uploads3.sort((a, b) => (b.views - b.last) - (a.views - a.last));
        uploads3 = uploads3.slice(0, 9);
        for (let i = 0; i < uploads3.length; i++) {
            uploads3[i].gain = uploads3[i].views - uploads3[i].last;
            uploads3[i].uploader = users.find(user => user.cid == uploads3[i].owner);
            uploads3[i] = {
                "id": uploads3[i].id,
                "title": uploads3[i].title,
                "views": uploads3[i].views,
                "gain": uploads3[i].gain,
                "uploader": {
                    name: uploads3[i].uploader.name,
                    cid: uploads3[i].uploader.cid,
                    image: uploads3[i].uploader.image
                }
            }
        }
        res.send(uploads3);
    }
});

app.get('/site/:type', (req, res) => {
    logRequest(req, res, () => { });
    let sort = req.query.sort;
    req.query.sort = req.query.sort.split('&')[0];
    req.params.type = req.params.type.split('?')[0];
    if (req.params.type == 'videos' || req.params.type == 'shorts' || req.params.type == 'streams' || req.params.type == 'songs' || req.params.type == 'podcasts') {
        if (sort == 'algorithm') {
            let uploads2 = [];
            let uploads3 = [...uploads[req.params.type]]
            uploads3 = uploads3.filter(video => video.inAlgorithm);
            for (let i = 0; i < 16; i++) {
                let video = uploads[req.params.type][Math.floor(Math.random() * uploads[req.params.type].length)];
                if (video.inAlgorithm) {
                    uploads2.push(video);
                } else {
                    i--;
                }
            }
            for (let i = 0; i < uploads2.length; i++) {
                let user = users.find(user => user.cid == uploads2[i].owner);
                if (user) {
                    uploads2[i].owner = user.name.replace(/</g, "&lt;").replace(/>/g, "&gt;");
                    uploads2[i].ownerID = user.cid;
                    uploads2[i].ownerImage = user.image;
                    if (uploads2.title) {
                        uploads2[i].title = uploads2[i].title.replace(/</g, "&lt;").replace(/>/g, "&gt;");
                    }
                }
            }
            res.send({
                "uploads": uploads2,
                "type": req.params.type,
                "sort": "algorithm",
                "select": [
                    'algorithm',
                    'views',
                    'likes',
                    'dislikes',
                    'comments',
                    'posted'
                ]
            });
        } else {
            if ((sort == 'views') || (sort == 'likes') || (sort == 'dislikes') || (sort == 'comments') || (sort == 'posted')) {
                let uploads2 = [...uploads[req.params.type]].sort((a, b) => b[sort] - a[sort]).slice(0, 16);
                for (let i = 0; i < uploads2.length; i++) {
                    let user = users.find(user => user.cid == uploads2[i].owner);
                    if (user) {
                        uploads2[i].owner = user.name.replace(/</g, "&lt;").replace(/>/g, "&gt;");
                        uploads2[i].ownerID = user.cid;
                        uploads2[i].ownerImage = user.image;
                        if (uploads2.title) {
                            uploads2[i].title = uploads2[i].title.replace(/</g, "&lt;").replace(/>/g, "&gt;");
                        }
                    }
                }
                res.send({
                    "uploads": uploads2,
                    "type": req.params.type,
                    "sort": sort,
                    "select": [
                        'algorithm',
                        'views',
                        'likes',
                        'dislikes',
                        'comments',
                        'posted'
                    ]
                });
            } else {
                res.send({ error: 'Invalid sort type' });
            }
        }
    } else if (req.params.type == 'comments') {
        if ((sort == 'likes') || (sort == 'replies') || (sort == 'posted')) {
            let uploads2 = [...uploads[req.params.type]].sort((a, b) => b[sort] - a[sort]).slice(0, 16);
            for (let i = 0; i < uploads2.length; i++) {
                let user = users.find(user => user.cid == uploads2[i].owner);
                if (user) {
                    uploads2[i].owner = user.name.replace(/</g, "&lt;").replace(/>/g, "&gt;");
                    uploads2[i].ownerID = user.cid;
                    uploads2[i].ownerImage = user.image;
                    if (uploads2.title) {
                        uploads2[i].title = uploads2[i].title.replace(/</g, "&lt;").replace(/>/g, "&gt;");
                    }
                }
            }
            res.send({
                "uploads": uploads2,
                "type": req.params.type,
                "sort": sort,
                "select": [
                    'likes',
                    'replies',
                    'posted'
                ]
            });
        } else {
            res.send({ error: 'Invalid sort type' });
        }
    } else if (req.params.type == 'posts') {
        if ((sort == 'likes') || (sort == 'comments') || (sort == 'posted')) {
            let uploads2 = [...uploads[req.params.type]].sort((a, b) => b[sort] - a[sort]).slice(0, 16);
            for (let i = 0; i < uploads2.length; i++) {
                let user = users.find(user => user.cid == uploads2[i].owner);
                if (user) {
                    uploads2[i].owner = user.name.replace(/</g, "&lt;").replace(/>/g, "&gt;");
                    uploads2[i].ownerID = user.cid;
                    uploads2[i].ownerImage = user.image;
                    if (uploads2.title) {
                        uploads2[i].title = uploads2[i].title.replace(/</g, "&lt;").replace(/>/g, "&gt;");
                    }
                }
            }
            res.send({
                "uploads": uploads2,
                "type": req.params.type,
                "sort": sort,
                "select": [
                    'likes',
                    'comments',
                    'posted'
                ]
            });
        } else {
            res.send({ error: 'Invalid sort type' });
        }
    } else if (req.params.type == 'playlists') {
        if ((sort == 'views') || (sort == 'posted')) {
            let uploads2 = [...uploads[req.params.type]].sort((a, b) => b[sort] - a[sort]).slice(0, 16);
            for (let i = 0; i < uploads2.length; i++) {
                let user = users.find(user => user.cid == uploads2[i].owner);
                if (user) {
                    uploads2[i].owner = user.name.replace(/</g, "&lt;").replace(/>/g, "&gt;");
                    uploads2[i].ownerID = user.cid;
                    uploads2[i].ownerImage = user.image;
                    if (uploads2.title) {
                        uploads2[i].title = uploads2[i].title.replace(/</g, "&lt;").replace(/>/g, "&gt;");
                    }
                }
            }
            res.send({
                "uploads": uploads2,
                "type": req.params.type,
                "sort": sort,
                "select": [
                    'views',
                    'posted'
                ]
            });
        } else {
            res.send({ error: 'Invalid sort type' });
        }
    } else if (req.params.type == 'stories') {
        if ((sort == 'views') || (sort == 'posted')) {
            let uploads2 = [...uploads[req.params.type]].sort((a, b) => b[sort] - a[sort]).slice(0, 16);
            for (let i = 0; i < uploads2.length; i++) {
                let user = users.find(user => user.cid == uploads2[i].owner);
                if (user) {
                    uploads2[i].owner = user.name.replace(/</g, "&lt;").replace(/>/g, "&gt;");
                    uploads2[i].ownerID = user.cid;
                    uploads2[i].ownerImage = user.image;
                    if (uploads2.title) {
                        uploads2[i].title = uploads2[i].title.replace(/</g, "&lt;").replace(/>/g, "&gt;");
                    }
                }
            }
            res.send({
                "uploads": uploads2,
                "type": req.params.type,
                "sort": sort,
                "select": [
                    'views',
                    'posted'
                ]
            });
        } else {
            res.send({ error: 'Invalid sort type' });
        }
    } else if (req.params.type == 'creators') {
        if ((sort == 'subs') || (sort == 'commands') || (sort == 'videos') || (sort == 'shorts') || (sort == 'streams') || (sort == 'songs') || (sort == 'posts') || (sort == 'comments') || (sort == 'playlists') || (sort == 'podcasts') || (sort == 'stories') || (sort == 'views') || (sort == 'likes') || (sort == 'dislikes') || (sort == 'commentcount')) {
            if (sort == 'commentcount') sort = 'commentCount';
            let uploads2 = [...users].sort((a, b) => b[sort] - a[sort]).slice(0, 16);
            for (let i = 0; i < uploads2.length; i++) {
                let user = users.find(user => user.cid == uploads2[i].owner);
                if (user) {
                    uploads2[i].owner = user.name.replace(/</g, "&lt;").replace(/>/g, "&gt;");
                }
            }
            res.send({
                "uploads": uploads2,
                "type": req.params.type,
                "sort": sort,
                "select": [
                    'subs',
                    'commands',
                    'videos',
                    'shorts',
                    'streams',
                    'songs',
                    'posts',
                    'comments',
                    'playlists',
                    'podcasts',
                    'stories',
                    'views',
                    'likes',
                    'dislikes',
                    'commentcount'
                ]
            });
        } else {
            res.send({ error: 'Invalid sort type' });
        }
    } else if (req.params.type == 'all') {
        let uploads2 = [...uploads['videos'], ...uploads['shorts'], ...uploads['streams'], ...uploads['songs']].filter(upload => upload.inAlgorithm)
        uploads2 = uploads2.sort(() => Math.random() - 0.5).slice(0, 16);
        for (let i = 0; i < uploads2.length; i++) {
            let user = users.find(user => user.cid == uploads2[i].owner);
            if (user) {
                uploads2[i].owner = user.name.replace(/</g, "&lt;").replace(/>/g, "&gt;");
                uploads2[i].ownerID = user.cid;
                uploads2[i].ownerImage = user.image;
                if (uploads2.title) {
                    uploads2[i].title = uploads2[i].title.replace(/</g, "&lt;").replace(/>/g, "&gt;");
                }
            }
        }
        res.send({
            "uploads": uploads2,
            "type": req.params.type,
            "sort": sort
        });
    } else {
        res.send({ error: 'Invalid sort type' });
    }
});

app.listen(3000)