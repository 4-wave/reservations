# Reservations Module
This component is part of a web app for arranging and offering homestays. It allows reservation bookings for the chosen home, showing availability and the price of stay. 

## Setup
Instaling Dependencies
- `npm install` from within root directory

## Endpoints
Create 
`POST api/reservations/:id` Post reservation dates and guest information for specific home

Read
`GET api/reservations/:id` Get availability/prices/general info for specific home

Update
`UPDATE api/reservations/:id` Update reservation dates or guest information for specific home

Delete
`DELETE api/reservations/:id` Delete reservation dates/information for specific home

