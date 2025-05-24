interface Notification {
    _id: string;
    userId: string;
    type: 'message' | 'bid' | 'listing-approval' | 'review' | 'transaction';
    message: string;
    relatedId?: string; // ID of related entity
    read: boolean;
    createdAt: Date;
  }