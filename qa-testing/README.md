# QA Testing with Selenium

This directory contains automated end-to-end tests for the Fastbreak Events Dashboard using Selenium and pytest.

## Setup

1. Install Python dependencies:
```bash
pip install -r requirements.txt
```

2. Make sure the application is running:
```bash
npm run dev
```

3. The application should be accessible at `http://localhost:3000`

## Running Tests

### Run all tests:
```bash
pytest
```

### Run specific test file:
```bash
pytest test_auth.py
pytest test_dashboard.py
pytest test_integration.py
```

### Run with HTML report:
```bash
pytest --html=report.html
```

### Run with verbose output:
```bash
pytest -v
```

## Test Suites

### test_auth.py
- Login page loads correctly
- Signup page loads correctly
- Navigation between login/signup
- Google OAuth button presence

### test_dashboard.py
- Dashboard redirects when not authenticated
- Dashboard elements are present
- Search functionality
- Filter by sport
- Event CRUD operations
- Form validation
- Venue multi-input

### test_integration.py
- Complete event lifecycle
- Search and filter workflow
- Responsive design testing

## Notes

- Tests run in headless mode by default
- Some tests require authentication - you may need to set up test credentials
- Tests use implicit waits and explicit waits for better reliability
- ChromeDriver is automatically managed by webdriver-manager

## Configuration

To modify test settings, edit the fixtures in each test file:
- `base_url`: Change the application URL
- `driver`: Modify browser options (remove headless for debugging)
- `authenticated_session`: Add authentication logic for protected routes

## Debugging

To see the browser during test execution, modify the driver fixture:
```python
options = webdriver.ChromeOptions()
# Remove or comment out: options.add_argument("--headless")
```

