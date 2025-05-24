interface Transaction {
    _id: string;
    listingId: string;
    buyerId: string;
    sellerId: string;
    price: number;
    status: 'pending' | 'completed' | 'cancelled' | 'disputed';
    meetupDetails?: {
      location: {
        name: string;
        coordinates: [number, number];
      };
      time: Date;
      completed: boolean;
    };
    paymentDetails?: {
      method: 'cash' | 'online';
      transactionId?: string;
      status?: string;
    };
    createdAt: Date;
    updatedAt: Date;
  }