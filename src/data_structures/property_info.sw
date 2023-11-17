library;

use ::data_structures::property_state::PropertyState;
use ::data_structures::booking_state::BookingState;


pub struct PropertyInfo {
    /// The user who has created the campaign
    owner: Identity,
    ///Pincode of the property
    pincode: u8,
    ///Listed or not
    listed: PropertyState,
    ///Availability
    available: BookingState,
    
}

impl PropertyInfo {

    pub fn new(
        owner: Identity,
        pincode: u8,
    ) -> Self {
        Self {
            owner,
            pincode,
            listed: PropertyState::Listed,
            available: BookingState::Available,
        }
    }
}
