export async function addBooking({
  barberId,
  serviceId,
  startTimestamp,
  tip,
}) {
  const { Booking, Barber, Service } = this.model;
  const statusTimestamp = new Date(this.timestamp).toISOString();
  const viewer = this.viewer;

  const service = await Service.node(serviceId).get();
  if (!service) {
    throw new Error('SERVICE_ID_INVALID');
  }
  if (!await Barber.node(barberId).services.edge(serviceId).exists()) {
    throw new Error('BARBER_DOES_NOT_HAVE_SERVICE_ID');
  }

  const durationInMilis = service.duration * 60.0 * 1000.0;
  const startInMilis = new Date(startTimestamp).getTime();
  const endTimestamp = new Date(startInMilis + durationInMilis).toISOString();

  const booking = await Booking.addNode({
    startTimestamp,
    endTimestamp,
    service: serviceId,
    tip,
    status: 'BOOKED',
    statusTimestamp
  });
  await booking.barber.addEdge(barberId);
  const bookingEdge = await viewer.bookings.addEdge(booking);

  return { bookingEdge, viewer };
}
