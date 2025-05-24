interface Review {
    _id: string;
    transactionId: string;
    reviewerId: string; // who left the review
    revieweeId: string; // who is being reviewed
    rating: number; // 1-5
    comment?: string;
    createdAt: Date;
    type: 'buyer' | 'seller';
  }