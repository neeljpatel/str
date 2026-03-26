# Hospitable API V2 Reference

This document summarizes the available endpoints in the Hospitable V2 API based on the OpenAPI specification. It is intended to be used as a reference before accessing Hospitable to ensure the proper endpoints are used.

*Note: Parameters marked with `*` are required.*

## Enrichable Shortcodes

### `GET` /reservations/{uuid}/enrichment
**List Enrichable Shortcodes**
- **Description**: Returns the enrichable shortcodes scoped to the client along with the values that have been provided.
- **Parameters**: `Content-Type`

### `GET` /reservations/{uuid}/enrichment/{key}
**Get an Enrichable Shortcode by Key**
- **Description**: Returns the value that has been provided for the key.
- **Parameters**: `Content-Type`

### `PUT` /reservations/{uuid}/enrichment/{key}
**Set an Enrichable Shortcode**
- **Description**: <!-- theme: warning -->
- **Parameters**: `Content-Type`

## Inquiries

### `GET` /inquiries
**Get Inquries**
- **Description**: **Available includes:**
- **Parameters**: `page`, `per_page`, `Content-Type`, `properties[]*`, `include`, `last_message_at`

### `GET` /inquiries/{uuid}
**Get Inquiry by UUID**
- **Description**: **Available includes:**
- **Parameters**: `Content-Type`, `include`

## Messaging

### `GET` /reservations/{uuid}/messages
**Get Reservation Messages**
- **Description**: <!-- theme: warning -->
- **Parameters**: `uuid*`, `Content-Type`

### `POST` /reservations/{uuid}/messages
**Send Message for Reservation**
- **Description**: > **Rate Limits**:
- **Parameters**: `uuid*`, `Content-Type`

### `POST` /inquiries/{uuid}/messages
**Send Message for Inquiry**
- **Description**: > **Rate Limits**:
- **Parameters**: `uuid*`, `uuid*`, `Content-Type`

## Properties

### `GET` /properties
**Get Properties**
- **Description**: **Available includes:**
- **Parameters**: `include`, `Content-Type`, `page`, `per_page`

### `GET` /properties/search
**Search Properties**
- **Description**: This endpoint allows you to search up to **3 years** in the future and for a max period of **90 days**.
- **Parameters**: `include`, `Content-Type`, `start_date*`, `end_date*`, `adults*`, `children`, `infants`, `pets`, `location`

### `GET` /properties/{uuid}
**Get Property by UUID**
- **Description**: **Available includes:**
- **Parameters**: `uuid*`, `include`, `Content-Type`

### `GET` /properties/{uuid}/images
**Get Property Images**
- **Description**: <!-- theme: warning -->
- **Parameters**: `uuid*`, `Content-Type`

### `GET` /properties/{uuid}/calendar
**Get Property Calendar**
- **Description**: <!-- theme: warning -->
- **Parameters**: `uuid*`, `Content-Type`, `start_date`, `end_date`

### `PUT` /properties/{uuid}/calendar
**Update Property Calendar**
- **Description**: Allows updating a property’s calendar data for up to 1,095 days (3 years) into the future.
- **Parameters**: `uuid*`, `Content-Type`

### `POST` /properties/{uuid}/ical-imports
**Create iCal Import**
- **Description**: <!-- theme: warning -->
- **Parameters**: `Content-Type`

### `PUT` /properties/{uuid}/ical-imports/{icalUuid}
**Update iCal Import**
- **Description**: <!-- theme: warning -->
- **Parameters**: `Content-Type`

### `POST` /properties/{uuid}/quote
**Generate a quote**
- **Description**: <!-- theme: warning -->
- **Parameters**: `uuid*`, `Content-Type`

### `POST` /properties/{uuid}/tags
**Tag a property**
- **Description**: <!-- theme: warning -->
- **Parameters**: `Content-Type`

## Reservations

### `GET` /reservations
**Get Reservations**
- **Description**: **Available includes:**
- **Parameters**: `page`, `per_page`, `Content-Type`, `properties[]*`, `start_date`, `end_date`, `include`, `date_query`, `platform_id`, `last_message_at`, `status[]`

### `POST` /reservations
**Create Manual Reservation**
- **Description**: <!-- theme: warning -->
- **Parameters**: `Content-Type`, `include`

### `GET` /reservations/{identifier}
**Get Reservation**
- **Description**: **Available includes**:
- **Parameters**: `identifier*`, `Content-Type`, `include`

### `PUT` /reservations/{identifier}
**Update Manual Reservation**
- **Description**: Update an existing manual reservation. Only manual reservations can be updated.
- **Parameters**: `uuid*`, `Content-Type`, `include`

### `POST` /reservations/{uuid}/cancel
**Cancel Manual Reservation**
- **Description**: Cancel a manual reservation. Only manual reservations can be cancelled through this endpoint.
- **Parameters**: `uuid*`, `include`

## Reviews

### `GET` /properties/{uuid}/reviews
**Get Property Reviews**
- **Description**: Returns a paginated list of reviews that guests have left for a specific property. Currently, we source review data from Airbnb and our own direct bookings.
- **Parameters**: `uuid*`, `page`, `per_page`, `include`

### `POST` /reviews/{uuid}/respond
**Respond to a review**
- **Description**: Response to a review received for a reservation.

## Transactions

### `GET` /payouts
**All Payouts**
- **Parameters**: `page`, `per_page`, `include`

### `GET` /payouts/{payout}
**Retrieve a Payout**
- **Description**: <!-- theme: warning -->
- **Parameters**: `payout*`, `include`, `Content-Type`

### `GET` /transactions
**All Transactions**
- **Description**: <!-- theme: warning -->
- **Parameters**: `Content-Type`, `page`, `per_page`, `include`

### `GET` /transactions/{transaction}
**Retrieve a Transaction**
- **Description**: <!-- theme: warning -->
- **Parameters**: `Content-Type`, `include`, `transaction*`

## User

### `GET` /user
**Get User & Billing**
- **Parameters**: `Content-Type`

