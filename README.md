# Pickout-backend

Database Models

> `User`

- Id (primary key)
- username (required, unique)
- password (required)
- first_name (optional)
- last_name (optional)
- email (required) `very important to email market for future products`
- timestamp (when the user was created)

> `Address`

- user_id (PK/FK)
- street_address
- address_number
- city
- state
- zip_code
- country

> `Signature Meal` *(Data inserted when creating database as default)*

- Id (primary_key)
- price 

> `Pair Meal` *(signature meal paired with wine)*

- Id (primary_key) *(Data inserted when creating database as default)*
- price 


> `Purchases`

- Id (primary key)
- product_id (required, API)
- user_id (ForeignKey required)
- purchased_on date/time

# Usage
> <b>Endpoints for users:</b>

- GET `/users/{id}` - get user by ID
- POST `/auth/register` - register a new user
- POST `/auth/login` - login existing user
- PATCH `/users/{id}` - update a user
- DELETE `/users/{id}` - delete a user

> <b>Endpoints for users address:</b>
- GET `/address/{id}` - get users address by user ID
- PATCH `/address/{id}` - update a users address by users ID

> <b>Endpoints for purchases:</b>
- POST `/meals/signature/{:mealId}/purchase/{:userId}/` - posts a signature-meal purchase based on mealID *(pre-existing)* and user id
- POST `/meals/pair-meal/:mealId/:pairId/purchase/:userId'/` -  posts a paired meal purchase based on mealID and pairID *(both pre-existing)* and user id
