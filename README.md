# Meldio Barbershop Listings Example

This example illustrates how easy and fast it is to build a backend for a
local listings app using Meldio.

Meldio is an open source GraphQL backend for building delightful mobile and web
apps. See [our start building guide](https://www.meldio.com/start-building) for
detailed instructions on getting started with Meldio.

Need help?
  * [Join our Slack channel](https://meldio-slack.herokuapp.com)
  * [Ask a question on Stack Overflow](https://stackoverflow.com/questions/ask?tags=meldio)

## Installation and Setup

First, you will need to [install Meldio following these instructions](https://www.meldio.com/start-building#requirements)

Then, clone this example from Github using the following command:

```bash
git clone https://github.com/meldio/barbershop-listings.git
```

Next, you will need to create new Facebook and Google OAuth applications and
obtain App ID and Secret from both Facebook and Google.

To initialize Meldio, run the following command and follow the prompts.
Simply accept defaults and enter Facebook and Google OAuth App ID and Secret
when prompted for those.

```bash
cd barbershop-listings
meldio init
```

## Running the app
Start meldio from the `barbershop-listings` directory with:
```bash
meldio run
```

You can now access Meldio Query IDE at [http://localhost:9000/graphql](http://localhost:9000/graphql).

## Description

The app allows users to see a list of barbershops around you, barbers and book
a service appointment with a barber.

## Mutations

The following mutations are provided:
* [addBooking](https://github.com/meldio/barbershop-listings/blob/master/mutations/addBooking.js) -
  adds a booking and connects it to user's and berber's profiles. Returns
  `bookingEdge` to allow the app to add a booking to the list and `viewer` to
  allow the app to retrieve updated user information.

* [cancelBooking](https://github.com/meldio/barbershop-listings/blob/master/mutations/cancelBooking.js) -
  allows the user to cancel the booking they made previously. This mutation
  does not delete the booking, it just changes the status of the booking to
  CANCELLED. Returns `booking` and `viewer` to allow the app to refresh booking
  and user information.

* [completeBooking](https://github.com/meldio/barbershop-listings/blob/master/mutations/completeBooking.js) -
  allows the barber to denote booking as complete (i.e. service delivered).
  This mutation changes the status of the booking to COMPLETED. Returns
  `booking` and `viewer` to allow the app to refresh booking and user
  information.


## Mutation Usage Examples

#### Add a new booking:
```graphql
mutation MakeBooking {
  addBooking(input: {
    barberId: "-KGD9oSVQVISHW8itbzC-S1I25I",
    serviceId: "-KGDBGMIVsYbaZiszXG1-i5IM935",
    startTimestamp: "2016-04-25T16:30:00.000Z",
    tip: 5.00,
    clientMutationId: "1"
  }) {
    bookingEdge {
      node {
        id
        startTimestamp
        endTimestamp
        status
        statusTimestamp
      }
    }
  }
}
```

Mutations returns:
```json
{
  "data": {
    "addBooking": {
      "bookingEdge": {
        "node": {
          "id": "-KGDGHo-ecaAoRglX1Ny-SFFB9E7",
          "startTimestamp": "2016-04-25T16:30:00.000Z",
          "endTimestamp": "2016-04-25T16:45:00.000Z",
          "status": "BOOKED",
          "statusTimestamp": "2016-04-25T16:33:56.971Z"
        }
      }
    }
  }
}
```

#### Cancel a booking:
```graphql
mutation CancelBooking {
	cancelBooking(input: {
		id: "-KGDGHo-ecaAoRglX1Ny-SFFB9E7",
    clientMutationId: "2"
  }) {
    booking {
      status
      statusTimestamp
    }
  }
}
```

Mutation returns:
```json
{
  "data": {
    "cancelBooking": {
      "booking": {
        "status": "CANCELLED",
        "statusTimestamp": "2016-04-25T16:36:11.634Z"
      }
    }
  }
}
```

## Queries

#### List the barbershops in a certain location:
```graphql
query ListAllBarbershops($location: [String!]) {
  allBarbershops(filterBy: { node: { location: {eq: $location}}}) {
    edges {
      node {
        id
        name
        address {
          street
          streetCont
          city
          state
          zip
        }
        rating
        photoUrls
      }
    }
  }
}
```

This query expects `location` parameter:
```json
{
  "location": "New York, NY"
}
```

#### List all barbers that work for a barbershop

```graphql
query BarberList($barbershopId: [ID!]!) {
  barbershop(id: $barbershopId) {
    id
    name
    address {
      street
      streetCont
      city
      state
      zip
    }
    rating
    photoUrls

    barbers {
      edges {
        node {
          id
          name
          pictureUrl
          twitterHandle
        }
      }
    }
  }
}
```

The query above expects `barbershopId` parameter:

```json
{
  "barbershopId": "-KGD8wE8rBgI5Xnmc9PE-S1I25IJ8FG"
}
```

#### Show services and schedule for the given barber:

```graphql
query BarberView($barberId: [ID!]!) {
  barber(id: $barberId) {
    id
    name
    services {
      edges {
        node {
          id
          name
          duration
          price
        }
      }
    }
    bookings(filterBy: { node: { status: {eq: BOOKED} }}) {
      edges {
        node {
          id
          startTimestamp
          endTimestamp
        }
      }
    }
  }
}
```

The query above expects `barberId` arameter:

```json
{
  "barberId": "-KGD9oSVQVISHW8itbzC-S1I25I"
}
```

#### Fetch upcoming bookings for a user:

```graphql
query UserBookingView {
  viewer {
    id
    firstName
    lastName
    profilePictureUrl
    bookings(filterBy: { node: { status: {eq: BOOKED }}}) {
      edges {
        node {
          id
          barber {
            edges {
              node {
                id
                name
                pictureUrl
              }
            }
          }
          startTimestamp
          endTimestamp
          service {
            id
            name
            duration
            price
          }
          tip
        }
      }
    }
  }
}
```

## License

This code is free software, licensed under the MIT license. See the `LICENSE` file for more details.
