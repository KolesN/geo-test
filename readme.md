### Scripts:

1. To create new data:
    ```shell
    'npm run create'
    ```

2. To start the server:
    ```shell
    'npm run start'
    ```
    
### Available requests for server:

#### 1. 
  * method: GET
  * URL: 'http://localhost:8090/areas'
  
  * Description:
  This request returns all areas in 'areas.json' in the root directory
#### 2.
  * method: GET
  * URL: 'http://localhost:8090/areas/:number'
  
  * Description:
  This request returns area by it's number in 'areas.json'
#### 3.
  * method: GET
  * URL: 'http://localhost:8090/users'
    
  * Description:
  This request returns all users in 'users.json'
#### 4.
  * method: GET
  * URL: 'http://localhost:8090/users/:id'
    
  * Description:
  This request returns user by its id in 'users.json'
#### 5.
  * method: POST
  * URL: 'http://localhost:8090/users/:id'
  
  * Body example: 
    ```Body
    {
      "type": "Feature",
      "properties": {},
      "geometry": {
        "type": "Point",
        "coordinates": [
          27.132299200027852,
          38.406134769104604
        ]
      }
    }
    ```
    
  * Description:
  This request changes current area for user using it's new coordinates then rewrites 'users.json'
#### 6.
  * method: GET
  * URL: 'http://localhost:8090/init'
    
  * Description:
  This request is for the new created users to set current areas according to their location
