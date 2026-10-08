# BankLite - Frontend (Smart Loan Origination System)

## Overview
BankLite is a modern Smart Loan Origination System frontend built with React. It handles the consumer funding lifecycle with features for customers to apply for loans and credit officers to review and make underwriting decisions.

## Features

### Customer Features
- **Login/Authentication**: Secure credential-based authentication with session token management
- **Dashboard**: View all submitted loan applications with status tracking
- **Loan Application Form**: Submit new loan applications with amount, purpose, and income details
- **Application Tracking**: Monitor application status (Pending, Approved, Rejected)

### Credit Officer Features
- **Officer Dashboard**: View all pending loan applications with real-time statistics
- **Risk Analysis**: PieChart visualization of loan risk distribution (Safe/Medium/High Risk)
- **Underwriting Console**: Detailed review of individual applications with:
  - Application metadata (borrower details, loan amount, income)
  - Auto-calculated risk score and assessment
  - Debt-to-income ratio calculation
  - Comment field for underwriting analysis
  - Approve/Reject action buttons with audit logging

## Project Structure

```
Frontend/
├── src/
│   ├── pages/
│   │   ├── LoginPage.jsx              # Authentication page
│   │   ├── CustomerDashboard.jsx      # Customer's loan applications view
│   │   ├── LoanApplicationForm.jsx    # New loan application form
│   │   ├── OfficerDashboard.jsx       # Officer's pending applications view
│   │   └── UnderwritingConsole.jsx    # Detailed loan review interface
│   ├── components/
│   │   ├── Navbar.jsx                 # Navigation bar with logout
│   │   └── PrivateRoute.jsx           # Route protection wrapper
│   ├── utils/
│   │   ├── api.js                     # API calls to backend
│   │   └── auth.js                    # Authentication helpers
│   ├── styles/
│   │   ├── global.css                 # Global styles
│   │   ├── LoginPage.module.css
│   │   ├── Navbar.module.css
│   │   ├── CustomerDashboard.module.css
│   │   ├── LoanApplicationForm.module.css
│   │   ├── OfficerDashboard.module.css
│   │   └── UnderwritingConsole.module.css
│   ├── App.jsx                        # Main app with routing
│   └── index.jsx                      # Entry point
├── public/
│   └── index.html                     # HTML template
└── package.json                       # Dependencies & scripts

```

## Installation

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn package manager

### Setup Steps

1. **Navigate to Frontend directory**:
   ```bash
   cd Frontend
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```
   or
   ```bash
   yarn install
   ```

3. **Configure API endpoint** (optional):
   Create a `.env` file in the `Frontend` directory:
   ```
   REACT_APP_API_URL=http://localhost:5000/api/v1
   ```
   Default uses `http://localhost:5000/api/v1`

4. **Start the development server**:
   ```bash
   npm start
   ```
   or
   ```bash
   yarn start
   ```

   The application will open at `http://localhost:3000`

## Usage

### Login
1. Navigate to the login page
2. Use test credentials:
   - **Customer**: `customer@bank.com` / `pass123`
   - **Officer**: `officer@bank.com` / `pass123`

### Customer Workflow
1. Login with customer credentials
2. View dashboard showing all previous applications
3. Click "Apply for New Loan" to submit application
4. Fill in loan details:
   - Loan Amount
   - Monthly Income
   - Loan Purpose (select from dropdown)
5. Submit and view confirmation

### Officer Workflow
1. Login with credit officer credentials
2. View pending applications dashboard with:
   - Total pending count
   - Total loan amount
   - Average credit score
   - Risk distribution PieChart
3. Click "Review Underwriting" on any application
4. Review detailed application data:
   - Borrower information
   - Credit score and risk category
   - Calculated debt-to-income ratio
5. Enter underwriting analysis in comments field
6. Click "Approve" or "Reject" to make decision
7. Return to dashboard

## Available Scripts

### Development
```bash
npm start
```
Runs the app in development mode with hot reload.

### Production Build
```bash
npm run build
```
Builds the app for production to the `build` folder.

### Testing
```bash
npm test
```
Launches the test runner in interactive watch mode.

## Key Technologies

- **React 18**: UI framework
- **React Router v6**: Client-side routing with protected routes
- **Recharts**: PieChart data visualization
- **CSS Modules**: Scoped component styling
- **Fetch API**: HTTP requests to backend

## API Integration

The frontend communicates with the backend using these endpoints:

### Authentication
- `POST /api/v1/auth/login` - User login

### Customer Endpoints
- `POST /api/v1/loans/apply` - Submit new loan application
- `GET /api/v1/loans/my-applications` - Get user's applications

### Officer Endpoints
- `GET /api/v1/loans/pending` - Get all pending applications
- `PUT /api/v1/loans/<id>/action` - Submit approval/rejection decision

## State Management

The application uses:
- **React Hooks**: `useState`, `useEffect` for local component state
- **React Router**: `useNavigate` for programmatic navigation
- **LocalStorage**: Storing token, role, and user name for persistent sessions

## Security Features

- **Token-based Authentication**: Session tokens stored in localStorage
- **Role-based Access Control**: Routes protected by user role
- **Protected Routes**: PrivateRoute component validates authentication and authorization
- **Automatic Redirects**: Unauthorized access redirects to login

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Performance Optimizations

- CSS Modules for preventing style conflicts
- Lazy loading via React Router
- Conditional rendering to minimize DOM elements
- Responsive grid layouts for different screen sizes

## Environment Variables

Create a `.env` file in the Frontend directory:

```env
REACT_APP_API_URL=http://localhost:5000/api/v1
```

## Troubleshooting

### API Connection Issues
- Verify backend server is running on the configured URL
- Check CORS settings on backend
- Verify API endpoint in browser dev console Network tab

### Login Not Working
- Clear localStorage and try again
- Check backend authentication endpoint
- Verify credentials are correct

### Styling Issues
- Clear browser cache (Ctrl+Shift+Delete)
- Rebuild the project: `npm run build`

## Development Notes

- Uses modern React functional components with Hooks
- CSS Modules for component-scoped styling
- Responsive design with CSS Grid and Flexbox
- RESTful API integration with error handling
- Session management via localStorage

## License
© 2024 BankLite - Smart Loan Origination System

## Support
For issues or questions, contact the development team.
