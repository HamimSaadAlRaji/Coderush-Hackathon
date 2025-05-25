# Admin Panel Testing Checklist

## ✅ COMPLETED - Admin Panel Setup
- [x] Admin panel UI created at `/admin`
- [x] Admin authentication middleware implemented
- [x] Admin API routes for listing management created
- [x] Listing model updated with approval fields
- [x] Test listings created with pending status
- [x] Navbar updated with admin panel link for admin users

## 🧪 TESTING INSTRUCTIONS

### Prerequisites
1. **Admin Access Required**: You mentioned you already have admin access and can see the admin panel button
2. **Test Data**: 5 test listings have been created with "pending" status
3. **Server Running**: Development server should be running at http://localhost:3000

### Test Cases to Verify

#### 1. **Admin Panel Access** ✅
- Navigate to http://localhost:3000/admin
- Verify you can access the admin panel as an admin user
- Non-admin users should be redirected or see access denied

#### 2. **Listing Display**
- [ ] Verify 5 test listings are displayed with "PENDING" status
- [ ] Check that all listing information is properly displayed:
  - Title, description, category, price
  - Seller information (name, email, university)
  - Posted date
  - Status badge

#### 3. **Status Breakdown Dashboard**
- [ ] Verify status breakdown shows correct counts:
  - Pending: 5 listings
  - Approved: 0 listings (initially)
  - Rejected: 0 listings (initially)

#### 4. **Filtering Functionality**
- [ ] Test "All Statuses" filter (should show all listings)
- [ ] Test "Pending" filter (should show 5 listings)
- [ ] Test "Approved" filter (should show 0 listings initially)
- [ ] Test "Rejected" filter (should show 0 listings initially)

#### 5. **Approval Workflow**
- [ ] Click "Approve" on a listing
- [ ] Verify the listing status changes to "APPROVED"
- [ ] Check that approved listings show "✓ Approved" instead of action buttons
- [ ] Verify status breakdown updates (Pending: 4, Approved: 1)

#### 6. **Rejection Workflow**
- [ ] Click "Reject" on a listing
- [ ] Verify rejection reason prompt appears
- [ ] Enter a rejection reason (e.g., "Inappropriate content")
- [ ] Verify the listing status changes to "REJECTED"
- [ ] Check that rejection reason is displayed
- [ ] Verify status breakdown updates

#### 7. **Pagination** (if more than 10 listings)
- [ ] Test pagination if you have more than 10 listings
- [ ] Verify "Previous" and "Next" buttons work correctly

#### 8. **Data Persistence**
- [ ] Refresh the page and verify status changes persist
- [ ] Check that filtering still works after page refresh

#### 9. **Error Handling**
- [ ] Test with network errors (disconnect internet briefly)
- [ ] Verify appropriate error messages are displayed

#### 10. **Integration with Public Listings**
- [ ] Navigate to http://localhost:3000/all-listings
- [ ] Verify only approved listings are visible to regular users
- [ ] Pending and rejected listings should not appear

### Expected Behavior

1. **Pending Listings**: Show approve/reject buttons
2. **Approved Listings**: Show green "✓ Approved" indicator
3. **Rejected Listings**: Show red "✗ Rejected" indicator + rejection reason
4. **Status Filters**: Properly filter listings by approval status
5. **Real-time Updates**: Status changes reflect immediately in the UI

### Testing the Complete Workflow

1. **Start with 5 pending listings**
2. **Approve 2 listings** → Status breakdown should show: Pending(3), Approved(2), Rejected(0)
3. **Reject 1 listing with reason** → Status breakdown should show: Pending(2), Approved(2), Rejected(1)
4. **Filter by "Approved"** → Should show only the 2 approved listings
5. **Check public listings page** → Should only show the 2 approved listings

## 🔧 TROUBLESHOOTING

If you encounter issues:

1. **Can't access admin panel**: Check your user role in the database
2. **No listings showing**: Run the test listing script again
3. **Approval/rejection not working**: Check browser console for errors
4. **Status not updating**: Check network tab for API call responses

## 🎯 SUCCESS CRITERIA

The admin panel is working correctly if:
- ✅ Admin users can access the panel
- ✅ All pending listings are displayed with proper information
- ✅ Approve/reject actions work and update status immediately
- ✅ Filtering by status works correctly
- ✅ Status breakdown shows accurate counts
- ✅ Only approved listings appear on public pages
- ✅ Rejected listings show rejection reasons
- ✅ Changes persist after page refresh

## 📝 NEXT STEPS

After successful testing:
1. Consider adding bulk actions (approve/reject multiple listings)
2. Add email notifications to sellers when listings are approved/rejected
3. Add audit logging for admin actions
4. Consider adding appeal process for rejected listings
