contract;

mod data_structures;
mod errors;
mod events;
mod interface;

use ::data_structures::{
    property::Property,
    property_info::PropertyInfo,
    booking_state::BookingState,
    booking_info::BookingInfo,
    property_state::PropertyState,
    booking::Booking,
};
use ::errors::{BookingError, CreationError, UserError};
use ::events::{
    CancelledCampaignEvent,
    SucessfulCampaignEvent,
    PropertyListed,
    PropertyUnlisted,
    BookingSuccessful,
    BookingChanged,
    BookingCancelled,
};
use std::{
    auth::msg_sender,
    block::height,
    context::msg_amount,
    hash::Hash,
};
use ::interface::{HotelBooking, Info};

storage {
    ///Owner

    booking_history: StorageMap<(Identity, BookingInfo), Booking> = StorageMap {},

    property_availability: StorageMap<(u64, u64, u64), bool> = StorageMap {},


    property_info: StorageMap<u64, PropertyInfo> = StorageMap {},

    booking_info: StorageMap<u64, BookingInfo> = StorageMap {},


    total_property_listed: u64 = 0,

    total_booking: u64 = 0,
}

impl HotelBooking for Contract {

    #[storage(read, write)]
    fn list_property(pincode: u8) {
        let owner = msg_sender().unwrap();

        // Create an internal representation of a campaign
        let property_info = PropertyInfo::new(owner, pincode);

        // We've just created a new campaign so increment the number of created campaigns across all
        // users and store the new campaign
        storage.total_property_listed.write(storage.total_property_listed.read() + 1);
        storage.property_info.insert(storage.total_property_listed.read(), property_info);

        // We have changed the state by adding a new data structure therefore we log it
        log(PropertyListed {
            owner,
            property_info,
            property_id: storage.total_property_listed.read(),
        });
    }

    #[storage(read, write)]
    fn unlist_property(property_id: u64) {

        // Retrieve the campaign in order to check its data / update it
        let mut property_info = storage.property_info.get(property_id).try_read().unwrap();

        // Only the creator (author) of the campaign can cancel it
        require(property_info.owner == msg_sender().unwrap(), UserError::UnauthorizedUser);

        // Mark the campaign as cancelled
        property_info.listed = PropertyState::Unlisted;

        // Overwrite the previous campaign (which has not been cancelled) with the updated version
        storage.property_info.insert(property_id, property_info);

        // We have updated the state of a campaign therefore we must log it
        log(PropertyUnlisted { property_id });
    }

    #[storage(read, write)]
    fn book(property_id: u64, bookingFrom: u64, bookingTo: u64) {
        //Booking date check
        require(bookingFrom > height().as_u64() || bookingTo > height().as_u64(), CreationError::BookingDateMustBeInFuture );
        // Retrieve the campaign in order to check its data / update it
        let mut property_info = storage.property_info.get(property_id).try_read().unwrap();
        let mut bookedBy = msg_sender().unwrap();


        //check if the property is listed or not
        require(property_info.listed != PropertyState::Listed, BookingError::PropertyNotFound);
        //check if the property is booked or available
        require(property_info.available != BookingState::Booked, UserError::PropertyNotAvailable);
        
        //Create the booking info
        let booking_info = BookingInfo::new(bookedBy, bookingFrom, bookingTo, property_id);

        storage.total_booking.write(storage.total_booking.read() + 1);
        storage.booking_info.insert(storage.total_booking.read(), booking_info);
        storage.booking_history.insert((bookedBy, booking_info), Booking::new(storage.total_booking.read()));
        storage.property_availability.insert((property_id, bookingFrom, bookingTo), false);

        //Mark property as booked
        property_info.available = BookingState::Booked;

        storage.property_info.insert(property_id, property_info);

        // We have updated the state of a campaign therefore we must log it
        log(BookingSuccessful { 
            booking_id: storage.total_booking.read(), 
            bookedBy, 
            bookingFrom, 
            bookingTo });
    }

    #[storage(read, write)]
    fn change_date(booking_id: u64, newBookingFrom: u64, newBookingTo: u64) {

        // Retrieve the campaign in order to check its data / update it
        let mut booking_info = storage.booking_info.get(booking_id).try_read().unwrap();

        // Use the user's pledges as an ID / way to index this new sign
        let bookedBy = msg_sender().unwrap();
        let booking_history = storage.booking_history.get((bookedBy, booking_info)).try_read().unwrap_or(0);
        let property_available = storage.property_availability.get((booking_info.property_id, newBookingFrom, newBookingTo)).try_read().unwrap_or(true);

        require(booking_history != 0, BookingError::BookingNotFound);
        require(booking_info.status != BookingState::Cancelled, BookingError::AlreadyCancelled);
        require(property_available != false, BookingError::PropertyNotAvailable);

        booking_info.bookingFrom = newBookingFrom;
        booking_info.bookingTo =  newBookingTo;

        storage.booking_info.insert(booking_id, booking_info);

        // We have updated the state of a campaign therefore we must log it
        log(BookingChanged {
            booking_id,
            newBookingFrom,
            newBookingTo,
        });
    }

    #[storage(read, write)]
    fn cancel_booking(booking_id: u64) {

        // Retrieve the campaign in order to check its data / update it
        let mut booking_info = storage.booking_info.get(booking_id).try_read().unwrap();

        // Check if the user has pledged to the campaign they are attempting to unsign from
        let cancelBy = msg_sender().unwrap();

        require(booking_info.status != BookingState::Cancelled, BookingError::AlreadyCancelled);

        booking_info.status = BookingState::Cancelled;

        storage.booking_info.insert(booking_id, booking_info);
        storage.property_availability.insert((booking_info.property_id, booking_info.bookingFrom, booking_info.bookingTo), true);

        log(BookingCancelled {
            booking_id,
            cancelBy,
        });
    }
}

impl Info for Contract {

    #[storage(read)]
    fn booking_info(booking_id: u64) -> Option<BookingInfo> {
        storage.booking_info.get(booking_id).try_read()
    }

    #[storage(read)]

    fn property_info(property_id: u64) -> Option<PropertyInfo> {
        storage.property_info.get(property_id).try_read()
    }

    #[storage(read)]
    fn total_property_listed() -> u64 {
        storage.total_property_listed.read()
    }

    #[storage(read)]
    fn total_booking() -> u64 {
        storage.total_booking.read()
    }
}
