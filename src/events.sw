library;

use ::data_structures::property_info::PropertyInfo;

/// Event for when a campaign is cancelled.
pub struct CancelledCampaignEvent {
    /// The unique identifier for the campaign.
    campaign_id: u64,
}

/// Event for when the proceeds of a campaign are claimed.
pub struct SucessfulCampaignEvent {
    /// The unique identifier for the campaign.
    campaign_id: u64,
    total_signs: u64,
}

/// Event for when a campaign is created.
pub struct PropertyListed {
    /// The user who has created the campaign.
    owner: Identity,
    /// Information about the entire campaign.
    property_info: PropertyInfo,
    /// The unique identifier for the campaign.
    property_id: u64,
}
pub struct PropertyUnlisted {
    property_id: u64,
}
/// Event for when a person signs a campaign.
pub struct BookingSuccessful {
    /// The unique identifier for the campaign.
    booking_id: u64,
    /// The user who has pledged.
    bookedBy: Identity,
    bookingFrom: u64,
    bookingTo: u64,
}

/// Event for when a signature is withdrawn from a campaign.
pub struct BookingChanged {
    /// The unique identifier for the campaign.
    booking_id: u64,
    /// The user who has unpledged.
    newBookingFrom: u64,
    newBookingTo: u64,
}

pub struct BookingCancelled {
    /// The unique identifier for the campaign.
    booking_id: u64,
    /// The user who has unpledged.
    cancelBy: Identity,
}
