
export function permissions() {
  return {
    // users can only view their own profile
    async User() {
      const { User } = this.model;
      const viewer = this.viewer;

      if (viewer) {
        return User.filter({ id: { eq: viewer.id } });
      }
    },

    // logged in users can see all barbershops
    async Barbershop() {
      if (this.viewer) {
        return this.model.Barbershop.filter({ });
      }
    },

    // logged in users can see all barbers
    async Barber() {
      if (this.viewer) {
        return this.model.Barber.filter({ });
      }
    },

    // logged in users can see all barber services
    async Service() {
      if (this.viewer) {
        return this.model.Service.filter({ });
      }
    },

    // users can only see their own bookings, barbers can see bookings they have
    async Booking() {
      const { Booking, Barber } = this.model;
      const viewer = await this.viewer.get();

      if (viewer.barber) {
        const barberId = viewer.barber;
        const bookingIds = await Barber.node(barberId).bookings.nodeIds();
        return Booking.filter({ id: { eq: bookingIds } });
      }

      const bookingIds = await viewer.bookings.nodeIds();
      return Booking.filter({ id: { eq: bookingIds } });
    },

    // mutation permissions return true if viewer is allowed to execute mutation
    addBooking: userIsLoggedIn,
    cancelBooking: userOwnsBooking,
    completeBooking: barberOwnsBooking,
  };
}

async function userIsLoggedIn() {
  const viewer = this.viewer;
  if (viewer) {
    return true;
  }
}

async function userOwnsBooking({ id }) {
  const viewer = this.viewer;
  if (viewer) {
    return viewer.bookings.edge(id).exists();
  }
}

async function barberOwnsBooking({ id }) {
  const { Barber } = this.model;
  const viewer = await this.viewer.get();

  if (viewer && viewer.barber) {
    const barberId = viewer.barber;
    return Barber.node(barberId).bookings.edge(id).exists();
  }
}
