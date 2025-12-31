"""
Dashboard Tests for Fastbreak Events Dashboard
Tests dashboard functionality, search, filter, and CRUD operations
"""

import pytest
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.common.keys import Keys
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.support.ui import Select
from selenium.webdriver.chrome.service import Service
from webdriver_manager.chrome import ChromeDriverManager
import time


@pytest.fixture(scope="function")
def driver():
    """Setup and teardown driver for each test"""
    options = webdriver.ChromeOptions()
    options.add_argument("--headless")
    options.add_argument("--no-sandbox")
    options.add_argument("--disable-dev-shm-usage")
    driver = webdriver.Chrome(
        service=Service(ChromeDriverManager().install()), options=options
    )
    driver.implicitly_wait(10)
    yield driver
    driver.quit()


@pytest.fixture
def base_url():
    """Base URL for the application"""
    return "http://localhost:3000"


@pytest.fixture
def authenticated_session(driver, base_url):
    """
    Create an authenticated session
    Note: This requires valid credentials in environment variables
    or test user setup
    """
    # This is a placeholder - in real tests, you'd need to:
    # 1. Sign up a test user
    # 2. Or use existing test credentials
    # 3. Or use session cookies/tokens
    
    driver.get(f"{base_url}/login")
    # Add authentication logic here
    # For now, we'll skip authenticated tests if not logged in
    yield driver


class TestDashboard:
    """Test suite for dashboard functionality"""

    def test_dashboard_redirects_when_not_authenticated(self, driver, base_url):
        """Test that unauthenticated users are redirected to login"""
        driver.get(f"{base_url}/dashboard")
        
        # Should redirect to login
        WebDriverWait(driver, 10).until(
            EC.url_contains("/login")
        )

    def test_dashboard_elements_present(self, driver, base_url, authenticated_session):
        """Test that dashboard elements are present when authenticated"""
        if not authenticated_session:
            pytest.skip("Authentication required")
        
        driver.get(f"{base_url}/dashboard")
        
        # Check for key elements
        WebDriverWait(driver, 10).until(
            EC.presence_of_element_located((By.XPATH, "//h1[contains(text(), 'Events Dashboard')]"))
        )
        
        # Check for search input
        search_input = driver.find_element(By.CSS_SELECTOR, "input[placeholder*='Search events']")
        assert search_input.is_displayed()
        
        # Check for filter dropdown
        filter_select = driver.find_element(By.CSS_SELECTOR, "button[role='combobox']")
        assert filter_select.is_displayed()
        
        # Check for New Event button
        new_event_button = driver.find_element(By.XPATH, "//button[contains(text(), 'New Event')]")
        assert new_event_button.is_displayed()

    def test_search_functionality(self, driver, base_url, authenticated_session):
        """Test search functionality on dashboard"""
        if not authenticated_session:
            pytest.skip("Authentication required")
        
        driver.get(f"{base_url}/dashboard")
        
        # Wait for search input
        search_input = WebDriverWait(driver, 10).until(
            EC.presence_of_element_located((By.CSS_SELECTOR, "input[placeholder*='Search events']"))
        )
        
        # Enter search query
        search_input.clear()
        search_input.send_keys("test event")
        search_input.send_keys(Keys.RETURN)
        
        # Wait for URL to update (search should trigger navigation)
        time.sleep(2)  # Wait for debounce/navigation
        
        # Verify URL contains search parameter
        assert "search=" in driver.current_url.lower()

    def test_filter_by_sport(self, driver, base_url, authenticated_session):
        """Test filtering events by sport"""
        if not authenticated_session:
            pytest.skip("Authentication required")
        
        driver.get(f"{base_url}/dashboard")
        
        # Find and click the sport filter
        filter_button = WebDriverWait(driver, 10).until(
            EC.element_to_be_clickable((By.CSS_SELECTOR, "button[role='combobox']"))
        )
        filter_button.click()
        
        # Select a sport option
        time.sleep(1)  # Wait for dropdown to open
        sport_option = WebDriverWait(driver, 10).until(
            EC.element_to_be_clickable((By.XPATH, "//div[contains(text(), 'Basketball')]"))
        )
        sport_option.click()
        
        # Wait for URL to update
        time.sleep(2)
        
        # Verify URL contains sport filter
        assert "sport=" in driver.current_url.lower()


class TestEventCRUD:
    """Test suite for Event CRUD operations"""

    def test_create_event_page_loads(self, driver, base_url, authenticated_session):
        """Test that create event page loads correctly"""
        if not authenticated_session:
            pytest.skip("Authentication required")
        
        driver.get(f"{base_url}/events/new")
        
        # Check for key elements
        WebDriverWait(driver, 10).until(
            EC.presence_of_element_located((By.XPATH, "//h1[contains(text(), 'Create New Event')]"))
        )
        
        # Check for form fields
        assert driver.find_element(By.NAME, "name")
        assert driver.find_element(By.CSS_SELECTOR, "input[type='datetime-local']")
        assert driver.find_element(By.XPATH, "//button[contains(text(), 'Create Event')]")

    def test_event_form_validation(self, driver, base_url, authenticated_session):
        """Test event form validation"""
        if not authenticated_session:
            pytest.skip("Authentication required")
        
        driver.get(f"{base_url}/events/new")
        
        # Try to submit empty form
        submit_button = WebDriverWait(driver, 10).until(
            EC.element_to_be_clickable((By.XPATH, "//button[@type='submit']"))
        )
        submit_button.click()
        
        # Should show validation errors
        time.sleep(1)
        # Check for error messages (implementation depends on form library)
        error_elements = driver.find_elements(By.CSS_SELECTOR, "[class*='error'], [class*='destructive']")
        assert len(error_elements) > 0 or "required" in driver.page_source.lower()

    def test_venue_multi_input(self, driver, base_url, authenticated_session):
        """Test venue multi-input functionality"""
        if not authenticated_session:
            pytest.skip("Authentication required")
        
        driver.get(f"{base_url}/events/new")
        
        # Find venue input (this might need adjustment based on actual implementation)
        venue_input = WebDriverWait(driver, 10).until(
            EC.presence_of_element_located((By.CSS_SELECTOR, "input[placeholder*='venue']"))
        )
        
        # Add a venue
        venue_input.clear()
        venue_input.send_keys("Test Venue")
        venue_input.send_keys(Keys.RETURN)
        
        # Wait for venue to be added
        time.sleep(1)
        
        # Check that venue badge appears
        venue_badges = driver.find_elements(By.XPATH, "//div[contains(text(), 'Test Venue')]")
        assert len(venue_badges) > 0


if __name__ == "__main__":
    pytest.main([__file__, "-v", "--html=report_dashboard.html"])

