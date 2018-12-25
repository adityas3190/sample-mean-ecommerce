Prerequisites : 
This app is made on MEAN stack so you need to clone this repo and run an npm install along with running the server using the command `node app.js`. You also need a Mongo instance running on port 27017

There are two ways to test this project
1) Use the sample data(ecommerce folder) and place an order using the provided curl request
2) The database used is MongoDB and is you can restore it using the following command . 
    mongorestore --port 27017 <path to the backup>
3) Once you have the db setup you can use the following CURL request
    curl -X POST \
    http://localhost:3000/api/order \
    -H 'cache-control: no-cache' \
    -H 'content-type: application/json' \
    -d '{"accountId" : "5c21d74457c955ac9b0b4fa0", "items" :
    [
        {
                "id" : "5c21d5b0d13380a6f888b676" , "quantity" : 2

        }
    ]

    }'


 In case you need to test the whole app, do the following steps :
 1) Post running the app , kindly hit the following API
    `http://localhost:3000/api/prefill?number=200`
    Note the number parameter whuich represents the number of inventory items you want to add.
2) Now use the accountIds and inventory ids to change the above mentioned curl request and fire it .

In case of any doubts feel free to open an issue.