# Reservations Module
This component is part of a web app for arranging and offering homestays. It allows reservation bookings for the chosen home, showing availability and the price of stay. 

## Setup
Instaling Dependencies
- `npm install` from within root directory

## Endpoints
Get availability/prices/general info for specific home
`GET api/reservations/:id`

**House Response Object** 
--

Create reservation
`POST api/reservations/:id`

Update reservation
`UPDATE api/reservations/:id`

Delete reservation
`DELETE api/reservations/:id`

