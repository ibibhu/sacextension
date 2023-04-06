










using { SACTenant } from './external/SACTenant.csn';





service CatalogService @(path : '/catalog')
@(requires: 'authenticated-user')
{











    @readonly
    entity Stories
      @(restrict: [{ to: 'Viewer' }])
      as projection on SACTenant.Stories;





    type userScopes { identified: Boolean; authenticated: Boolean; Viewer: Boolean; Admin: Boolean; };
    type userType { user: String; locale: String; scopes: userScopes; };
    function userInfo() returns userType;


};