# Webservices Explorer
 Report deployed webservices in a network.

 ## Why
 
Imagine that multiple clients make use of a specific service, clients written in various programming languages, or worse, clients whose source code you cannot modify.

One day change the address where the service is published, and in order not to recompile all the clients that use it, referring to a key, the name of the service, or its alias, on the client side it will not be necessary to update anything. .

&nbsp;

## Install
First, install it from npm repository:

    npm i -g @vidaniello/webservices-explorer

then launch the setup script:

    vidaniello.webservices-explorer.install

will be asked respectively:

- The http port used by express, default `3010`.
- The Mongo server hostname/ip, default `localhost`.
- The Mongo port, default `27017`.
- The Mongo username, empty if authentication is not enabled.
- The Mongo username password, empty if authentication is not enabled.

after setup has finished, a `.env` file will be written in the `$HOME\vidaniello_webservices-explorer` folder, and if some environment will be change in the future, simply, stop the service recall the install script, response to the ansewers and the `.env` will be overriden, then restart the service.

&nbsp;

## Run

Launch for the standalone start the follow stript:

    vidaniello.webservices-explorer.run

or, same with the previus command, use a process manager, like [PM2](https://pm2.keymetrics.io/) for autostart and more advanced life cycle control.

&nbsp;

## How use it.

For now, there is not a front-end view, and all ***CRUD*** operation are delegated to a database explorer like *MongoDBCompass*.

All response, also the errors, are written with `Content-Type: application/json` http header tag, then all outputs are *json* objects.

&nbsp;

- Homepage, simply query the service.
  - Command: `hostname:PORT/`
  - Method: `GET`
  - Response: 

        {
            appStatus: "Ok!...."
        }

&nbsp;

- MongoDb connection status. 
  - Command: `hostname:PORT/getDbConnectionState`
  - Method: `GET`
  - Response: 

        {
            mongDbConnectionStatus: [THE STATUS OF THE CONNECTION]
        }

&nbsp;

- Cache reset, when an antity was update manually in the DB.
  - Command: `hostname:PORT/resetServiceCache`
  - Method: `GET`
  - Response: 

        {
            cacheStatus: "Cache cleared!"
        }

&nbsp;

- For shutdown the service (ATTENTION! THE COMMAND IS DISABLED).
  - Command: `hostname:PORT/closeApp`
  - Method: `GET`
  - Response: 

        {
            appStatus: "Closing app!"
        }

&nbsp;

- For shutdown the service (ATTENTION! THE COMMAND IS DISABLED, then launch an error json).
  - Command: `hostname:PORT/closeApp`
  - Method: `GET`
  - Response: 

        {
            appStatus: "Closing app!"
        }

&nbsp;

- Insert new Service.
   - Command: `hostname:PORT/newService`
   - Method: `POST`
   - Body Request:

         {
            "serviceName": [THE NAME OF THE SERVICE, THAT IS ALSO THE _ID OF THE ENTITY, AND NOT IS ADMITTED DUPLICATE OF THE ALIAS NAME],
            "endpointsDeployed": 
            [ //THE ARRAY OF ENDPOINTS DEPLOYED
                {
                    "url": [THE URL],
                    "enabled": [BOOLEAN, IF IS ENABLED OR NOT],
                    "environment": [NOT REQUIRED, STRING FREE, LIKE 'TEST', 'DEVELOP' FOR SPECIFY EVENTUALLY THE ENVIRONMENT OF THE ENDPOINT OPERATION]
                },
               ...[OTHER ENDPOINTS]...
            ],
            "description": [LONG DESCRIPTION OF THE SERVICE],
            "functions":
            [ //THE ARRAY OF THE FUNCTION/HTTP REQUEST OF THE SERVICE
                {
                    "path": [PATH OF THE FUNCTION, WITH EVENTUALLY PATH PARAMS CHAIN],
                    "method": [TYPE OF HTTP METHOD, GET, POST, PUT, ECC..],
                    "description": [LONG DESCRIPTION OF THE FUNCTION],
                    "pathParams": { //MAP <string, object>
                        [THE NAME OF PATH PARM]: {
                            "description": [DESCRIPTION OF THE PATH],
                            "format": [ANY TYPE AND FORMAT OF THE PARAMETER],
                            "required": [BOOLEAN, IF IT IS REQUIRED OR NOT],
                            "defaultValue": [DEFAULT VALUE IF NOT SPECIFIED]
                            }
                    ...[OTHER PATH PARMS]...
                    },  
                    "queryParams": {
                        [MAP <string, object>, LIKE PATH PARAMS]
                    },
                    "bodyContent": [TYPE SENDED IN THE BODY OF REQUEST, AND IF JSON OBJECT, ALSO SPECIFY WHERE TO FIND THE DEFINITION OF THE OBJECT],
                    "return": [ANY REPLY IN THE BODY, AND IF JSON OBJECT, ALSO SPECIFY WHERE TO FIND THE DEFINITION OF THE OBJECT],
                    "throws": 
                    [//ARRAY OF POSSIBLE THROWNED EXCEPTIONS
                        {
                            "exceptionType": [THE NAME OF THE EXCEPTION], 
                            "code": [CODE OF THE EXCEPTION], 
                            "description": [DESCRIPTION OF THE EXCEPTION]
                        },
                    ...[OTHER EXCEPTIONS]...
                    ],
                    "other": [OTHER INFO, WARNING, ECC.. ABOUT THE FUNCTION]
                },
                ...[OTHER FUNCTIONS]...
            ],
            "other": [OTHER INFO, WARNING, ECC.. ABOUT THE SERVICE],
            "openAPIReferences": [
                [ARRAY OF STRING, URL IF EXIST AN OPEN API REFERENCE]
            ]   
         }
   - Response: The new inserted service.

&nbsp;

- Get the Service JSON object, if exist, error if not exist.
    - Command: `hostname:PORT/getService/:serviceName`
    - Method: `GET`
    - Path params:
        - `:serviceName`: the service name.
    - Response: The JSON object Service described above, plus, the associated alias.

&nbsp;

- Add new Alias entity.
    - Command: `hostname:PORT/newAlias`
    - Method: `POST`
    - Body Request:

            {
                "aliasName": [THE ALIAS NAME, THAT IS ALSO THE _ID OF THE ENTITY, AND NOT IS ADMITTED DUPLICATE OF THE SERVICE NAME],
                "descrizione": [LONG DESCRIPTION],
                "abilitato": [BOOLEAN, ENABLED OR NOT]
            }
    - Response: The JSON object Alias described above.

&nbsp;

- Add new Alias entity and associate it with given service name, if exsist.
    - Command: `hostname:PORT/newAlias/associate_to/:serviceName`
    - Method: `POST`
    - Path params:
        - `:serviceName`: the service name to associate at new Alias created.
    - Body Request: The JSON object Alias described above.
    - Response: The JSON object Alias described above, plus, the associated Service json object.

&nbsp;

- Get the Alias JSON object, if exist, error if not exist.
    - Command: `hostname:PORT/getAlias/:aliasName`
    - Method: `GET`
    - Path params:
        - `:aliasName`: the alias name.
    - Response: The JSON object Service described above, plus, the associated Service json object.

&nbsp;

- Add new Type entity.
    - Command: `hostname:PORT/newType`
    - Method: `POST`
    - Body Request:

            {
                "name": [UNIQUE NAME OF THE TYPE, THAT IS ALSO THE _ID OF THE ENTITY],
                "description": [LONG DESCRIPTION OF THE TYPE],
                "fields": { //MAP <string, object>
                    [THE NAME OF THE FIELD]: {
                        "filedType": [THE TYPE OF THE FIELD], 
                        "description": [LONG DESCRIPTION OF THE FIELD, ALSO IF THERE ARE REGEX], 
                        "required": [BOOLEAN, REQUIRED OR NOT]
                },
                ...[OTHER FIELDS]...
            }
    - Response: The JSON object Type described above.

&nbsp;

- Get the Type JSON object, if exist, error if not exist.
    - Command: `hostname:PORT/getType/:objectTypeName`
    - Method: `GET`
    - Path params:
        - `:objectTypeName`: the type name.
    - Response: The JSON object Type described above.

&nbsp;

- Get the list of pubblished endpoints.
    - Command: `hostname:PORT/getEndpointsURL/:serviceName/env/:environment?`
    - Method: `GET`
    - Path params:
        - `:serviceName`: The Service name, or his alias.
        - `:environment`: Optional, the String free filed to query certanly endpoint ambients. If not specified, return only endpoints with unspecified environment, see `endpointsDeployed` fiels of Service object described above.
    - Response: Array of string

            {
                [
                    [URL ENDPOINTS], 
                    ...
                ]

            }
