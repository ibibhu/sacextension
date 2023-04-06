
var debug = require('debug');
const cds = require('@sap/cds');

class SACTenant extends cds.RemoteService {
    async init() {

        this.reject(['CREATE', 'UPDATE', 'DELETE'], '*');

        this.on('READ', '*', async (req, next) => {
            try {
            const response = await next(req);
            return response.Items;
            } catch (err){
                console.error(err); 
            }
        });
    
        this.before('READ', 'Stories', (req) => {
            try {
                req.query = 'GET /stories?include=models';
            } catch (err) {
                console.error(err);
            }
        });
        
        this.before('READ', 'Users', async (req) => {
            try {
                req.query = 'GET /scim/Users';
            } catch (err) { 
                console.error(err); 
            }
        });

       

        super.init();
    }
}

module.exports = SACTenant;