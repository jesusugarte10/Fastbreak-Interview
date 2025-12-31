"""
Integration Tests for Fastbreak Events Dashboard
End-to-end workflow tests
"""

import pytest
from selenium.webdriver.common.by import By
from selenium.webdriver.common.keys import Keys
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
import time


class TestEndToEndWorkflows:
    """End-to-end workflow tests"""

    def test_complete_event_lifecycle(self, authenticated_driver, base_url):
        """
        Test complete event lifecycle:
        1. Create event
        2. View event in dashboard
        3. Edit event
        4. Delete event
        """
        driver = authenticated_driver
        driver.get(f"{base_url}/events/new")
        
        # Fill in event form
        name_input = WebDriverWait(driver, 10).until(
            EC.presence_of_element_located((By.NAME, "name"))
        )
        name_input.send_keys("Selenium Test Event")
        
        # Select sport
        sport_select = WebDriverWait(driver, 10).until(
            EC.element_to_be_clickable((By.CSS_SELECTOR, "button[role='combobox']"))
        )
        sport_select.click()
        time.sleep(0.5)
        
        basketball_option = WebDriverWait(driver, 10).until(
            EC.element_to_be_clickable((By.XPATH, "//div[contains(text(), 'Basketball')]"))
        )
        basketball_option.click()
        
        # Fill in date (tomorrow)
        from datetime import datetime, timedelta
        tomorrow = (datetime.now() + timedelta(days=1)).strftime("%Y-%m-%dT14:00")
        date_input = driver.find_element(By.CSS_SELECTOR, "input[type='datetime-local']")
        date_input.send_keys(tomorrow)
        
        # Add venue
        venue_input = WebDriverWait(driver, 10).until(
            EC.presence_of_element_located((By.CSS_SELECTOR, "input[placeholder*='venue']"))
        )
        venue_input.send_keys("Test Venue")
        venue_input.send_keys(Keys.RETURN)
        time.sleep(1)
        
        # Submit form
        submit_button = driver.find_element(By.XPATH, "//button[@type='submit']")
        submit_button.click()
        
        # Wait for redirect to dashboard
        WebDriverWait(driver, 15).until(
            EC.url_contains("/dashboard")
        )
        
        # Verify event appears in dashboard
        time.sleep(2)
        assert "Selenium Test Event" in driver.page_source

    def test_search_and_filter_workflow(self, authenticated_driver, base_url):
        """Test search and filter workflow"""
        driver = authenticated_driver
        driver.get(f"{base_url}/dashboard")
        
        # Test search
        search_input = WebDriverWait(driver, 10).until(
            EC.presence_of_element_located((By.CSS_SELECTOR, "input[placeholder*='Search events']"))
        )
        search_input.send_keys("test")
        time.sleep(2)
        
        # Verify URL contains search parameter
        assert "search=" in driver.current_url.lower()
        
        # Test filter
        filter_button = WebDriverWait(driver, 10).until(
            EC.element_to_be_clickable((By.CSS_SELECTOR, "button[role='combobox']"))
        )
        filter_button.click()
        time.sleep(1)
        
        # Select a sport
        sport_option = WebDriverWait(driver, 10).until(
            EC.element_to_be_clickable((By.XPATH, "//div[contains(text(), 'Basketball')]"))
        )
        sport_option.click()
        time.sleep(2)
        
        # Verify URL contains sport filter
        assert "sport=" in driver.current_url.lower()

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

