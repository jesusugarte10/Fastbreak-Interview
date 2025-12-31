"""
Integration Tests for Fastbreak Events Dashboard
End-to-end workflow tests
"""

import pytest
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.common.keys import Keys
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
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


class TestEndToEndWorkflows:
    """End-to-end workflow tests"""

    def test_complete_event_lifecycle(self, driver, base_url):
        """
        Test complete event lifecycle:
        1. Navigate to dashboard (should redirect if not authenticated)
        2. Create event
        3. View event in dashboard
        4. Edit event
        5. Delete event
        """
        # This is a template - requires authentication setup
        driver.get(f"{base_url}/dashboard")
        
        # Check if redirected to login
        if "/login" in driver.current_url:
            pytest.skip("Authentication required for full E2E test")
        
        # Continue with authenticated flow...
        # This would require setting up test user authentication first

    def test_search_and_filter_workflow(self, driver, base_url):
        """Test search and filter workflow"""
        driver.get(f"{base_url}/dashboard")
        
        if "/login" in driver.current_url:
            pytest.skip("Authentication required")
        
        # Test search
        search_input = WebDriverWait(driver, 10).until(
            EC.presence_of_element_located((By.CSS_SELECTOR, "input[placeholder*='Search']"))
        )
        search_input.send_keys("test")
        time.sleep(2)
        
        # Test filter
        filter_button = driver.find_element(By.CSS_SELECTOR, "button[role='combobox']")
        filter_button.click()
        time.sleep(1)
        
        # Verify URL parameters are set
        assert "search=" in driver.current_url or "sport=" in driver.current_url

    def test_responsive_design(self, driver, base_url):
        """Test responsive design at different viewport sizes"""
        viewports = [
            (375, 667),   # Mobile
            (768, 1024), # Tablet
            (1920, 1080) # Desktop
        ]
        
        for width, height in viewports:
            driver.set_window_size(width, height)
            driver.get(f"{base_url}/login")
            
            # Check that page loads without horizontal scroll
            body_width = driver.execute_script("return document.body.scrollWidth")
            viewport_width = driver.execute_script("return window.innerWidth")
            assert body_width <= viewport_width + 10  # Small tolerance


if __name__ == "__main__":
    pytest.main([__file__, "-v", "--html=report_integration.html"])

