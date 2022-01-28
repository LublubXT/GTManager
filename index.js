const express = require('express');
const bodyParser = require('body-parser');
const pug = require('pug');
const mongoose = require("mongoose");

const app = express();
app.set('view engine', 'pug');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));

mongoose.connect("mongodb+srv://your-mongodb-atlas-link-here", { useNewUrlParser: true, useUnifiedTopology: true });

var people;

const userSchema = {
    data: {},
    password: String,
    email: String,
    firstname: String,
    lastname: String
}

const User = mongoose.model("User", userSchema);

console.log("started server")

var Gpassword = ''
var Gemail = ''

var starting_data = {
    "data": [{
        "password": '',
        "email": '',
        "firstname": '',
        "lastname": '',
        "type": "FeatureCollection",
        "features": [{
            "type": "Feature",
            "index": 0,
            "color": "green",
            "geometry": {
                "type": "Point",
                "coordinates": [-114.369140625,
                    44.569909228537455
                ]
            },
            "properties": {
                "description": "<div class=\"block\" style=\"background-color: rgba(252, 252, 252, 0.6); backdrop-filter: blur(5px);\"><div><p id=\"coordinates\" style=\"text-align: center; width: 75%; margin: auto; margin-top: 20px; font-size: 18px;\">-114.369140625, 44.569909228537455</p><div id=\"status-popup\" class=\"status\" style=\"position: fixed; top: 11px; right: 11px; width: 5px; height: 5px;\"></div></div><div style=\"display: flex; flex-direction: row; width: 100%; margin: auto;  margin-top: 30px; margin-bottom: 20px;\"><button class=\"button-gray\" onclick=\"notHome()\" style=\"font-size: 15px; width: 150px;\">Not Home</button><button style=\"font-size: 15px;  width: 150px; margin-left: 5px; margin-right: -50px;\", onclick=\"show()\" class=\"button-green\" id=\"input-info\" onclick=\"show()\">Input Info</button><button style=\"font-size: 15px;  width: 150px; margin-left: 63px; margin-right: 20px;\", class=\"button-green\" id=\"input-info\" onclick=\"showstatus()\">Show Status</button></div></div>"
            },
            "data": {
                "firstName": "First",
                "lastName": "Marker",
                "occupation": "Hello",
                "wasHome": true,
                "wantsMoreAnswers": false,
                "saved": true,
                "wantsToGoToChurch": true,
                "talkedAbout": "Welcome to GTM!",
                "comments": "Hope this app will be of service to you, as you spread the good news!",
                "color": "red"
            }
        }]
    }]
}

var userfile = '';

app.get("/", function(req, res) {
    console.log("this is the sign in page is it working!!!!!!!!!!11111!!!!")
    res.render('index');
});

app.get('/signup', function(req, res) {
    res.render('signup');
});

app.get('/home', async function(req, res) {

    User.find({ email: Gemail, password: Gpassword }, async function(err, foundItems) {

        if (err) {
            console.log(err)
        } else {
            people = await foundItems;

            console.log(people)
            console.log("user is ", people[0].password, people[0].email)

            res.render("home", { people: people[0].data.data, person_data: people[0].data.data.features });
        }
    });
});

app.post('/signin', function(req, res) {
    const username = req.body.username
    const lastname = req.body.lastname
    const password = req.body.password
    const email = req.body.email

    Gpassword = password
    Gemail = email

    // console.log(username, password, email)

    userfile = username.toString() + lastname.toString();

    console.log('user file', userfile)

    if (username != '' && lastname != '' && email != '' && password != '') {
        res.redirect('/home')
    } else {
        res.redirect('/')
    }
})

app.post('/signup', function(req, res) {
    const username = req.body.username
    const lastname = req.body.lastname
    const password = req.body.password
    const email = req.body.email

    console.log(username, password, email)

    userfile = username.toString() + lastname.toString();

    console.log('user file', userfile)

    starting_data.data[0].email = email;
    starting_data.data[0].password = password;
    starting_data.data[0].firstname = username;
    starting_data.data[0].lastname = lastname;

    var data = starting_data.data[0]

    // var json = JSON.stringify(starting_data)

    const user = new User({
        data: { data },
        password: password,
        email: email,
        firstname: username,
        lastname: lastname
    });

    user.save();

    res.redirect('/');
})

app.post('/finishhouse', async function(req, res) {
    var data = req.body.data
    var firstname = req.body.firstName
    var lastname = req.body.lastName
    var occupation = req.body.occupation
    var washome = req.body.washome
    var wantsmoreanswers = req.body.wantsmoreanswers
    var saved = req.body.saved
    var wantstogotochurch = req.body.wantstogotochurch
    var talkedabout = req.body.talkabout
    var comments = req.body.comments
    var coordinates = req.body.coordinates
    var itemindex = req.body.itemindex

    console.log("coordinates", coordinates, "index", itemindex)

    data = JSON.parse(data)

    var d = {
        data: [data]
    }

    d.data[0].features[itemindex].data.firstName = firstname
    d.data[0].features[itemindex].data.lastName = lastname
    d.data[0].features[itemindex].data.occupation = occupation
    d.data[0].features[itemindex].data.wasHome = washome
    d.data[0].features[itemindex].data.wantsMoreAnswers = wantsmoreanswers
    d.data[0].features[itemindex].data.saved = saved
    d.data[0].features[itemindex].data.wantsToGoToChurch = wantstogotochurch
    d.data[0].features[itemindex].data.talkedAbout = talkedabout
    d.data[0].features[itemindex].data.comments = comments
    d.data[0].features[itemindex].data.color = ''

    if (d.data[0].features[itemindex].data.saved == 'on') {
        d.data[0].features[itemindex].data.color = 'green'
        console.log('should be green', d.data[0].features[itemindex].data.color)
    } else if (d.data[0].features[itemindex].data.wantsMoreAnswers == 'on') {
        d.data[0].features[itemindex].data.color = 'yellow'
        console.log('should be yellow', d.data[0].features[itemindex].data.color)
    } else if (d.data[0].features[itemindex].data.wasHome == undefined || d.data[0].features[itemindex].data.wasHome == false) {
        d.data[0].features[itemindex].data.color = 'gray'
        console.log('should be gray', d.data[0].features[itemindex].data.color)
    } else if (d.data[0].features[itemindex].data.saved == undefined) {
        d.data[0].features[itemindex].data.color = 'red'
        console.log('should be red', d.data[0].features[itemindex].data.color)
    }

    // var json = JSON.stringify(d)

    userfile = userfile

    data = d.data[0];

    await User.updateOne({ email: Gemail, password: Gpassword }, {
        data: { data }
    });

    res.redirect('/home')
})

let port = process.env.PORT;
if (port == null || port == "") {
    port = 3000;
}

app.listen(port, function() {
    console.log("Server started on port", port);
    console.log("its working so far so good!")
});
