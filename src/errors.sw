library;

/// Errors related to the campaign.
pub enum BookingError {
    /// The campaign has already ended.
    PropertyBooked: (),

    BookingNotFound: (),

    PropertyNotAvailable: (),

    AlreadyCancelled: (),

    PropertyNotFound: (),
}

/// Errors related to the campaign's creation.
pub enum CreationError {
    /// The campaign's deadline must be in the future.
    BookingDateMustBeInFuture: (),
}

/// Errors related to user actions.
pub enum UserError {

    InvalidID: (),
    /// The user is not authorized to perform this action.
    UnauthorizedUser: (),

    PropertyNotAvailable: (),

}
