export async function completeBooking({ id }) {
  const { Booking } = this.model;
  const statusTimestamp = new Date(this.timestamp).toISOString();
  const viewer = this.viewer;

  const currentBooking = await Booking.node(id).get();
  if (currentBooking.status !== 'BOOKED') {
    throw new Error('NOT_ALLOWED');
  }

  const booking = await currentBooking.update({
    status: 'CANCELLED',
    statusTimestamp,
  });

  return { booking, viewer };
}
