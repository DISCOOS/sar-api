# SAR-Status-API

REST-API created in Loopback/Express. Run on node-server 

![alt text](http://stianmorsund.no/dev/SAR-api.png)


- Integrates with KOVA-API and UMS
- Authenticate with KOVA user
- Uses KOVA access-tokens to authenticate requests
- Connects to a PostgreSQL database
	- Only SAR-related models are saved; users are fetched from KOVA

## Run
```
npm install
node .
```


## Automigration
- Run this script: server/bin/automigration.js to migrate all models to database


## TODO
- UMS integration (SOAP-connector)
- Specifiy different access control for SAR-users