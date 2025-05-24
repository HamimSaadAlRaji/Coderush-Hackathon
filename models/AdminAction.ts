interface AdminAction {
    _id: string;
    adminId: string;
    actionType: 'listing-approval' | 'user-ban' | 'review-removal' | 'location-approval';
    targetId: string; // ID of the affected entity
    reason?: string;
    details?: any;
    createdAt: Date;
  }