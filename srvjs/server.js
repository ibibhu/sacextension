const express = require('express');
const app = express();

const xsenv = require('@sap/xsenv');
xsenv.loadEnv();
const services = xsenv.getServices({
    uaa: { label: 'xsuaa' }
});


const xssec = require('@sap/xssec');
const passport = require('passport');
passport.use('JWT', new xssec.JWTStrategy(services.uaa));
app.use(passport.initialize());
app.use(passport.authenticate('JWT', {
    session: false
}));


app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// app home
app.get('/srvjs', function (req, res) {
    if (req.authInfo.checkScope('$XSAPPNAME.Viewer')) {
        res.status(200).send('SACEXTENSION');
    } else {
        res.status(403).send('Forbidden');
    }
});

// app user info
app.get('/srvjs/info', function (req, res) {
    if (req.authInfo.checkScope('$XSAPPNAME.Viewer')) {
        let info = {
            'userInfo': req.user,
            'subdomain': req.authInfo.getSubdomain()
        };
        res.status(200).json(info);
    } else {
        res.status(403).send('Forbidden');
    }
});

// app destination
const httpClient = require('@sap-cloud-sdk/http-client');
const { retrieveJwt } = require('@sap-cloud-sdk/connectivity');
app.get('/srvjs/dest', async function (req, res) {
    if (req.authInfo.checkScope('$XSAPPNAME.Viewer')) {
        try {
            let res1 = await httpClient.executeHttpRequest(
                {
                    destinationName: req.query.destination || ''
                    ,
                    jwt: retrieveJwt(req)
                },
                {
                    method: 'GET',
                    url: req.query.path || ''
                }
            );
            res.status(200).json(res1.data);
        } catch (err) {
            console.log(err.stack);
            res.status(500).send(err.message);
        }
    } else {
        res.status(403).send('Forbidden');
    }
});


const port = process.env.PORT || 5002;
app.listen(port, function () {
    console.info('Listening on http://localhost:' + port);
});