"""
Authentication Tests for Fastbreak Events Dashboard
Tests login, signup, and OAuth flows
"""

import pytest
from selenium import webdriver
from selenium.webdriver.common.by import By
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


class TestAuthentication:
    """Test suite for authentication flows"""

    def test_login_page_loads(self, driver, base_url):
        """Test that login page loads correctly"""
        driver.get(f"{base_url}/login")
        
        # Check for key elements
        assert "Welcome back" in driver.page_source
        assert driver.find_element(By.NAME, "email")
        assert driver.find_element(By.NAME, "password")
        assert driver.find_element(By.XPATH, "//button[contains(text(), 'Sign In')]")

    def test_signup_page_loads(self, driver, base_url):
        """Test that signup page loads correctly"""
        driver.get(f"{base_url}/signup")
        
        # Check for key elements
        assert "Create an account" in driver.page_source
        assert driver.find_element(By.NAME, "email")
        assert driver.find_element(By.NAME, "password")
        assert driver.find_element(By.XPATH, "//button[contains(text(), 'Sign Up')]")

    def test_navigation_between_login_signup(self, driver, base_url):
        """Test navigation between login and signup pages"""
        driver.get(f"{base_url}/login")
        
        # Click signup link
        signup_link = WebDriverWait(driver, 10).until(
            EC.element_to_be_clickable((By.LINK_TEXT, "Sign up"))
        )
        signup_link.click()
        
        # Verify we're on signup page
        WebDriverWait(driver, 10).until(
            EC.presence_of_element_located((By.XPATH, "//h1[contains(text(), 'Create an account')]"))
        )
        
        # Click login link
        login_link = WebDriverWait(driver, 10).until(
            EC.element_to_be_clickable((By.LINK_TEXT, "Sign in"))
        )
        login_link.click()
        
        # Verify we're back on login page
        WebDriverWait(driver, 10).until(
            EC.presence_of_element_located((By.XPATH, "//h1[contains(text(), 'Welcome back')]"))
        )

    def test_google_oauth_button_present(self, driver, base_url):
        """Test that Google OAuth button is present"""
        driver.get(f"{base_url}/login")
        
        google_button = WebDriverWait(driver, 10).until(
            EC.presence_of_element_located((By.XPATH, "//button[contains(text(), 'Google')]"))
        )
        assert google_button.is_displayed()


if __name__ == "__main__":
    pytest.main([__file__, "-v", "--html=report_auth.html"])

