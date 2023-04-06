const cds = require('@sap/cds');
const debug = require('debug')('srv:catalog-service');
const log = require('cf-nodejs-logging-support');
log.setLoggingLevel('info');

module.exports = cds.service.impl(async function () {

    const SACTenant = await cds.connect.to('SACTenant');

    const {
        Stories,
        Users
    } = this.entities;

    this.on('READ', Stories, async (req) => {
        try {
           
            const tx = SACTenant.transaction(req);
            return await tx.send({
                query: req.query
            })
        } catch (err) {
            req.reject(err);
        }
    });

    this.on('READ', Users, async (req) => {
        try {
            const tx = SACTenant.transaction(req);
            console.log(`###### READ req.query ${req.query}`)
            const response = await tx.send({ query: req.query });
            const resources = response.Resources;
            return resources;
        } catch (err) {
            req.reject(err);
        }
    });

    this.on('userInfo', req => {
        let results = {};
        results.user = cds.context.user.id;
        results.locale = cds.context.locale;
        results.scopes = {};
        results.scopes.identified = req.user.is('identified-user');
        results.scopes.authenticated = req.user.is('authenticated-user');
        results.scopes.Viewer = req.user.is('Viewer');
        results.scopes.Admin = req.user.is('Admin');
        return results;
    });

});