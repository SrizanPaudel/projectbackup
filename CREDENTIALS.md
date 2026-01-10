# Login Credentials

## Default Accounts (Frontend-Based)

All default accounts are stored in browser localStorage and are automatically created on first load. No backend setup required!

### Admin Account
- **Email:** `admin@rental.com`
- **Password:** `admin123`
- **Role:** Admin
- **Access:** Full admin dashboard access to manage properties

### Test User Accounts

#### Test User 1
- **Email:** `john.doe@test.com`
- **Password:** `test123`
- **Role:** User

#### Test User 2
- **Email:** `jane.smith@test.com`
- **Password:** `test123`
- **Role:** User

#### Test User 3
- **Email:** `bob.wilson@test.com`
- **Password:** `test123`
- **Role:** User

---

## Notes

- All default accounts are automatically initialized in localStorage when the app first loads
- You can also register new accounts through the registration form
- Admin accounts have access to the `/admin` route to manage property listings
- Regular users can browse properties and use the chat feature
- Authentication works completely frontend-based using localStorage
- If backend is available, it will be used as a fallback for new registrations

