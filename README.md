[![Build Status](https://travis-ci.org/Arcada-DevOps-MMMLS/Products.svg?branch=master)](https://travis-ci.org/Arcada-DevOps-MMMLS/Products)
# Products
API for Products

### GET Products
Method: GET

Path: /api/products

Response:
 ```json
[{
    "id": 1,
    "name": "Airmax",
    "brand": "Nike",
    "size": 42,
    "color": "blue",
    "description": "Very nice shoes",
    "price": 1000.00,
    "gender": "male"
}]
```

### GET a specific product
Method: GET

Path: /api/product/ID

Response:
 ```json
[{
    "id": 1,
    "name": "Airmax",
    "brand": "Nike",
    "size": 42,
    "color": "blue",
    "description": "Very nice shoes",
    "price": 1000.00,
    "gender": "male"
}]
```

 ### POST Products
 Method: POST
 
Path: /api/products/new

Request:
 ```json
[{
    "name": "Airmax",
    "brand": "Nike",
    "size": 42,
    "color": "blue",
    "description": "Very nice shoes",
    "price": 1000.00,
    "gender": "male"
}]
```

 ### DELETE Product
 Method: DELETE
 
 Path: /api/products/delete/ID to delete

 ### UPDATE Product
 Method: PUT
 
 Path: /api/products/update/ID to update
 
Request:
 ```json
[{
    "name": "Airmax",
    "brand": "Nike",
    "size": 42,
    "color": "blue",
    "description": "Very nice shoes",
    "price": 1000.00,
    "gender": "male"
}]
```



