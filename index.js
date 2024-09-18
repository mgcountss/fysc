const app = require('express')();
app.use(require('cors')())
const fetch = (...args) => import('node-fetch').then(({ default: fetch }) => fetch(...args));
const { verify } = require('hcaptcha');
const bodyParser = require('body-parser');
const path = require('path');
const fs = require('fs');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
require('dotenv').config();
const secret = process.env.SECRET;
let users = [];

app.use((req, res, next) => {
    //console.log(req.url);
    next();
});

app.get('/', (req, res) => {
    res.sendFile('/site.html', { root: __dirname });
})
app.get('/videos/:id', (req, res) => {
    res.sendFile('/video.html', { root: __dirname });
})
app.get('/old', (req, res) => {
    res.sendFile('/index.html', { root: __dirname });
})
app.get('/user', (req, res) => {
    res.sendFile('/user.html', { root: __dirname });
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
app.get('/compare/search', (req, res) => {
    res.sendFile('/compare/search.html', { root: __dirname });
})
app.get('/compare', (req, res) => {
    res.sendFile('/compare/index.html', { root: __dirname });
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
    fetch('http://localhost/connect/' + req.params.cid + '', {
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

const fetchUserData = async (id) => {
    let response = {
        error: 'An error occurred',
    }
    try {
        await fetch(`http://localhost/user/${id}`)
            .then((response) => response.json())
            .then((data) => {
                response = data;
            })
            .catch((err) => {
                console.log(err);
                throw err;
            });
    } catch (err) {
        console.log(err);
    }
    return response;
};

app.get('/video/:ids', async (req, res) => {
    try {
        const vid = req.params.ids.split('!')[0];
        const cid = req.params.ids.split('!')[1];
        const userData = await fetchUserData(cid);
        let video = userData.videoList.find((video) => video.id == vid) ? userData.videoList.find((video) => video.id == vid) :
            userData.streamList.find((stream) => stream.id == vid) ? userData.streamList.find((stream) => stream.id == vid) :
                userData.shortList.find((short) => short.id == vid) ? userData.shortList.find((short) => short.id == vid) :
                    userData.songList.find((song) => song.id == vid) ? userData.songList.find((song) => song.id == vid) :
                        userData.podcastList.find((podcast) => podcast.id == vid) ? userData.podcastList.find((podcast) => podcast.id == vid) : undefined;
        if (video) {
            res.send(video);
        } else {
            res.send({ error: 'Video not found' });
        }
    } catch (err) {
        console.log(err);
        res.send({ error: 'Video not found' });
    }
});

app.post('/login', (req, res) => {
    fetch('http://localhost/login', {
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
    fetch('http://localhost/check/' + req.params.cid)
        .then(response => response.json())
        .then(data => res.send(data))
        .catch(err => { });
})

app.post('/search', (req, res) => {
    let user = users.find(user => user.name == req.body.name);
    if (user) {
        user.name = user.name.replace(/</g, "&lt;").replace(/>/g, "&gt;");
        res.send(user);
    } else {
        res.send({ error: 'User not found' });
    }
})

app.get('/me', (req, res) => {
    let authToken = req.headers.authorization;
    if (authToken) {
        fetch('http://localhost/me/' + authToken)
            .then(response => response.json())
            .then(data => {
                if (data.user) {
                    delete data.user.list;
                    delete data.user.videoList;
                    delete data.user.shortList;
                    delete data.user.streamList;
                    delete data.user.songList;
                    delete data.user.postList;
                    delete data.user.commentList;
                    delete data.user.playlistList;
                    delete data.user.podcastList;
                    delete data.user.last;
                }
                res.send(data);
            })
            .catch(err => {
                console.log(err)
                res.send({ error: 'An error occurred' });
            });
    } else {
        res.send({ error: 'No auth token' });
    }
})

app.get('/all', (req, res) => {
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

app.get('/user/:id', (req, res) => {
    fetch(`http://localhost/user/${req.params.id}`)
        .then(response => response.json())
        .then(data => {
            data.name = data.name.replace(/</g, "&lt;").replace(/>/g, "&gt;");
            res.send(data)
        })
        .catch(err => { });
});

app.get('/user2/:id', (req, res) => {
    fetch(`http://localhost/user/${req.params.id}`)
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
                "podcasts": data.podcasts
            })
        })
        .catch(err => { });
});

app.get('/delete', (req, res) => {
    let authToken = req.headers.authorization;
    if (authToken) {
        fetch('http://localhost/delete/' + authToken)
            .then(response => response.json())
            .then(data => res.send(data))
            .catch(err => { });
    } else {
        res.send({ error: 'No auth token' });
    }
});

app.get('/site', (req, res) => {
    res.sendFile('/site.html', { root: __dirname });
})

app.get('/SFMG_Home_website.png', (req, res) => {
    res.sendFile('/SFMG_Home_website.png', { root: __dirname });
})

app.get('/sfmg.png', (req, res) => {
    res.sendFile('/SFMG.png', { root: __dirname });
})

let clans = [];
function uClans() {
    fetch('http://localhost/top_clans')
        .then(response => response.json())
        .then(data => {
            clans = data;
        })
        .catch(err => { });
}
uClans()
setInterval(uClans, 30000)

app.get('/api/clans', (req, res) => {
    res.send(clans);
});

let useableTokens = [];
let tokenCreated = [];

let rateLimits = []

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
    "podcast": 61
}

app.get('/action/:action/:title', (req, res) => {
    let authToken = req.headers.authorization;
    let token = req.headers['hcaptcha'];
    rateLimits = rateLimits.filter(rateLimit2 => rateLimit2.token != authToken);
    let rateLimit = rateLimits.find(rateLimit => rateLimit.token == authToken && rateLimit.type == req.params.action);
    if (rateLimit) {
        console.log(rateLimit)
        if (rateLimit.start + rateLimit.duration * 1000 < Date.now()) {
            rateLimits = rateLimits.filter(rateLimit2 => rateLimit2 != rateLimit);
        } else {
            res.send({
                'success': false,
                'cooldown': rateLimit.duration
            })
            return;
        }
    }
    if (token) {
        if (useableTokens.includes(token)) {
            if (tokenCreated[useableTokens.indexOf(token)] + 1800000 > Date.now()) {
                if (authToken) {
                    fetch('http://localhost/action/!' + req.params.action + '/' + authToken + '/' + req.params.title)
                        .then(response => response.json())
                        .then(data => {
                            if (data.success == false) {
                                rateLimits.push({
                                    "token": authToken,
                                    "type": req.params.action,
                                    "duration": actionNormalCooldowns[req.params.action],
                                    "start": Date.now()
                                })
                                res.send({
                                    'success': false,
                                    'cooldown': actionNormalCooldowns[req.params.action]
                                })
                            } else {
                                rateLimits.push({
                                    "token": authToken,
                                    "type": req.params.action,
                                    "duration": actionNormalCooldowns[req.params.action],
                                    "start": Date.now()
                                })
                                res.send(data)
                            }
                        })
                        .catch(err => {
                            console.log(err)
                        });
                } else {
                    res.send({ error: 'No auth token' });
                }
            } else {
                res.send({ error: 'Captcha expired' });
            }
        } else {
            verify(secret, token)
                .then(data => {
                    console.log(data)
                    if ((data.success)) {
                        if (authToken) {
                            fetch('http://localhost/action/!' + req.params.action + '/' + authToken + '/' + req.params.title)
                                .then(response => response.json())
                                .then(data => {
                                    if (data.success == false) {
                                        rateLimits.push({
                                            "token": authToken,
                                            "type": req.params.action,
                                            "duration": actionNormalCooldowns[req.params.action],
                                            "start": Date.now()
                                        })
                                        res.send({
                                            'success': false,
                                            'cooldown': actionNormalCooldowns[req.params.action]
                                        })
                                    } else {
                                        useableTokens.push(token);
                                        tokenCreated.push(Date.now());
                                        rateLimits.push({
                                            "token": authToken,
                                            "type": req.params.action,
                                            "duration": actionNormalCooldowns[req.params.action],
                                            "start": Date.now()
                                        })
                                        res.send(data)
                                    }
                                })
                                .catch(err => { });
                        } else {
                            res.send({ error: 'No auth token' });
                        }
                    } else {
                        res.send({ error: 'Captcha failed' });
                    }
                })
                .catch(err => {
                    console.log(err)
                });
        }
    } else {
        res.send({ error: 'No captcha token' });
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
    "playlists": []
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
    "version": "5.0",
}
let mostSubs = [];
let mostViews = [];
let mostNew = [];

app.get('/stats', (req, res) => {
    res.send(stats);
});

app.get('/mostViewed2/:type', (req, res) => {
    let response = { "videos": [], "shorts": [], "streams": [], "songs": [], "podcasts": [] };
    for (let q = 0; q < 5; q++) {
        let type = Object.keys(response)[q];
        let uploads3 = [...uploads[type]]
        uploads3 = uploads3.sort((a, b) => b.views - a.views);
        uploads3 = uploads3.slice(0, 9);
        response[type] = uploads3;
    }
    res.send(response);
});

app.get('/trending2/:type', (req, res) => {
    let type = req.params.type;
    if (type == 'channels') {
        let users2 = [...users]
        users2 = users2.sort((a, b) => b.gain - a.gain);
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

function getUploads() {
    fetch('http://localhost/videos')
        .then(response => response.json())
        .then(data => {
            let uploads2 = {
                "videos": [],
                "shorts": [],
                "streams": [],
                "songs": [],
                "podcasts": [],
                "posts": [],
                "comments": [],
                "playlists": []
            }
            for (let q = 0; q < data.length; q++) {
                if (!uploads2[data[q].type]) {
                    console.log(data[q])
                }
                uploads2[data[q].type].push(data[q]);
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
            stats["total"] = stats["videos"] + stats["shorts"] + stats["streams"] + stats["songs"] + stats["podcasts"] + stats["posts"] + stats["comments"] + stats["playlists"];
            stats["totalAlgorithm"] = stats["videosInAlgorithm"] + stats["shortsInAlgorithm"] + stats["streamsInAlgorithm"] + stats["songsInAlgorithm"] + stats["podcastsInAlgorithm"];
        })
        .catch(err => {
            console.log(err)
        });
    fetch('http://localhost/all2')
        .then(response => response.json())
        .then(data => {
            let views = 0;
            let subs = 0;
            let likes = 0;
            let dislikes = 0;
            let comments = 0;
            let commands = 0;
            for (let i = 0; i < data.users.length; i++) {
                data.users[i].name = data.users[i].name.replace(/</g, "&lt;").replace(/>/g, "&gt;");
                data.users[i].videoList = []
                data.users[i].shortList = []
                data.users[i].streamList = []
                data.users[i].songList = []
                data.users[i].postList = []
                data.users[i].commentList = []
                data.users[i].playlistList = []
                data.users[i].podcastList = []
                data.users[i].list = []
                views += data.users[i].views;
                subs += data.users[i].subs;
                likes += data.users[i].likes;
                dislikes += data.users[i].dislikes;
                comments += data.users[i].comments;
                commands += data.users[i].commands;
            }
            users = data.users;
            mostSubs = [...data.users].sort((a, b) => b.subs - a.subs).slice(0, 10);
            mostViews = [...data.users].sort((a, b) => b.views - a.views).slice(0, 10);
            mostNew = [...data.users].sort((a, b) => b.lastMSG - a.lastMSG).slice(0, 10);
            stats["totalViews"] = views;
            stats["totalSubs"] = subs;
            stats["totalLikes"] = likes;
            stats["totalDislikes"] = dislikes;
            stats["totalComments"] = comments;
            stats["totalCommands"] = commands;
            stats["totalUsers"] = data.users.length;
            stats["verifiedUsers"] = data.users.filter(user => user.verified).length;
            stats["battle"] = data.battle;
            stats["totalMessages"] = parseFloat(data.messages);
            stats["activeUsers"] = data.users.filter(user => user.lastMSG > Date.now() - 1000 * 60 * 60 * 24).length;
        })
        .catch(err => {
            console.log(err)
        });
}
getUploads()
setInterval(getUploads, 1000)

app.get('/site/:type', (req, res) => {
    try {
        const { min = 0, max = 16, sort, order } = req.query;
        const { type } = req.params;

        const validSortTypes1 = [
            'algorithm',
            'views',
            'likes',
            'dislikes',
            'comments',
            'posted'
        ]
        const validSortTypes2 = [
            'subs',
            'views',
            'likes',
            'dislikes',
            'comments',
            'commands',
            'videos',
            'shorts',
            'streams',
            'songs',
            'posts',
            'playlists',
            'podcasts',
            'lastMSG',
            'posted'
        ];

        let uploads2 = [];
        if (type == 'creators') {
            let users2 = [...users];
            users2 = users2.sort((a, b) => b[sort] - a[sort]);
            if (order === 'asc') {
                users2 = users2.reverse();
            }
            for (let i = 0; i < users2.length; i++) {
                users2[i].name = users2[i].name.replace(/</g, "&lt;").replace(/>/g, "&gt;");
                delete users2[i].list;
                delete users2[i].videoList;
                delete users2[i].shortList;
                delete users2[i].streamList;
                delete users2[i].songList;
                delete users2[i].postList;
                delete users2[i].commentList;
                delete users2[i].playlistList;
                delete users2[i].podcastList;
            }
            uploads2 = users2.slice(min, max);
            return res.send({
                "uploads": uploads2,
                "type": type,
                "sort": sort,
                "select": validSortTypes2
            });
        } else {

            if (!uploads[type]) {
                return res.send({ error: 'Invalid type' });
            }
            let uploads3 = [...uploads[type]];

            if (sort === 'algorithm') {
                uploads3 = [...uploads3].filter(video => video.inAlgorithm);
                if (order === 'asc') {
                    uploads3 = uploads3.reverse();
                }
                let num = uploads3.length < max ? uploads3.length : max;
                for (let i = 0; i < num; i++) {
                    let video = uploads3[Math.floor(Math.random() * uploads3.length)];
                    if (video && video.inAlgorithm) {
                        uploads2.push(video);
                    } else {
                        i--;
                    }
                }
            } else {
                uploads2 = [...uploads3].sort((a, b) => b[sort] - a[sort]);
                if (order === 'asc') {
                    uploads2 = uploads2.reverse();
                }
                uploads2 = uploads2.slice(min, max);
            }

            for (let i = 0; i < uploads2.length; i++) {
                let user = users.find(user => user.cid == uploads2[i].owner);
                if (user) {
                    uploads2[i].owner = user.name.replace(/</g, "&lt;").replace(/>/g, "&gt;");
                    uploads2[i].ownerID = user.cid;
                    uploads2[i].ownerImage = user.image;
                    if (uploads2[i].title) {
                        uploads2[i].title = uploads2[i].title.replace(/</g, "&lt;").replace(/>/g, "&gt;");
                    }
                }
            }
            return res.send({
                "uploads": uploads2,
                "type": type,
                "sort": sort,
                "select": validSortTypes1
            });
        }
    } catch (err) {
        console.log(err);
        res.send({ error: 'An error occurred' });
    }
});

app.get('/thumbnail/:id', (req, res) => {
    res.sendFile('/images/' + req.params.id + '.png', { root: __dirname + '/..' }, (err) => {
        if (err) {
            res.sendFile('/default.png', { root: __dirname });
        }
    });
});

app.listen(3000)