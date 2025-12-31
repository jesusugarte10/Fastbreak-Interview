"""
AI Features Tests for Fastbreak Events Dashboard
Tests AI chatbot, AI suggestions, and AI description generation
"""

import pytest
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
import time


class TestAIFeatures:
    """Test suite for AI features"""

    def test_ai_event_creator_button_present(self, authenticated_driver, base_url):
        """Test that AI Event Creator button is present on dashboard"""
        driver = authenticated_driver
        driver.get(f"{base_url}/dashboard")
        
        # Check for AI Event Creator button
        ai_button = WebDriverWait(driver, 10).until(
            EC.presence_of_element_located((By.XPATH, "//button[contains(text(), 'Create with AI')]"))
        )
        assert ai_button.is_displayed()

    def test_ai_event_creator_dialog_opens(self, authenticated_driver, base_url):
        """Test that AI Event Creator dialog opens when clicked"""
        driver = authenticated_driver
        driver.get(f"{base_url}/dashboard")
        
        # Click AI Event Creator button
        ai_button = WebDriverWait(driver, 10).until(
            EC.element_to_be_clickable((By.XPATH, "//button[contains(text(), 'Create with AI')]"))
        )
        ai_button.click()
        
        # Wait for dialog to open
        dialog = WebDriverWait(driver, 10).until(
            EC.presence_of_element_located((By.XPATH, "//div[contains(text(), 'AI Event Creator')]"))
        )
        assert dialog.is_displayed()
        
        # Check for chat input
        chat_input = WebDriverWait(driver, 10).until(
            EC.presence_of_element_located((By.CSS_SELECTOR, "input[placeholder*='Describe your event']"))
        )
        assert chat_input.is_displayed()

    def test_ai_suggestions_button_in_form(self, authenticated_driver, base_url):
        """Test that AI suggestions button appears in event form"""
        driver = authenticated_driver
        driver.get(f"{base_url}/events/new")
        
        # Select a sport first
        sport_select = WebDriverWait(driver, 10).until(
            EC.element_to_be_clickable((By.CSS_SELECTOR, "button[role='combobox']"))
        )
        sport_select.click()
        time.sleep(0.5)
        
        # Select Basketball
        basketball_option = WebDriverWait(driver, 10).until(
            EC.element_to_be_clickable((By.XPATH, "//div[contains(text(), 'Basketball')]"))
        )
        basketball_option.click()
        
        # Check for AI Suggestions button
        time.sleep(0.5)
        ai_suggestions_button = WebDriverWait(driver, 10).until(
            EC.presence_of_element_located((By.XPATH, "//button[contains(text(), 'AI Suggestions')]"))
        )
        assert ai_suggestions_button.is_displayed()

    def test_ai_generate_button_in_form(self, authenticated_driver, base_url):
        """Test that AI Generate button appears in event form"""
        driver = authenticated_driver
        driver.get(f"{base_url}/events/new")
        
        # Fill in event name
        name_input = WebDriverWait(driver, 10).until(
            EC.presence_of_element_located((By.NAME, "name"))
        )
        name_input.send_keys("Test Basketball Tournament")
        
        # Select a sport
        sport_select = WebDriverWait(driver, 10).until(
            EC.element_to_be_clickable((By.CSS_SELECTOR, "button[role='combobox']"))
        )
        sport_select.click()
        time.sleep(0.5)
        
        basketball_option = WebDriverWait(driver, 10).until(
            EC.element_to_be_clickable((By.XPATH, "//div[contains(text(), 'Basketball')]"))
        )
        basketball_option.click()
        
        # Check for AI Generate button
        time.sleep(0.5)
        ai_generate_button = WebDriverWait(driver, 10).until(
            EC.presence_of_element_located((By.XPATH, "//button[contains(text(), 'AI Generate')]"))
        )
        assert ai_generate_button.is_displayed()


if __name__ == "__main__":
    pytest.main([__file__, "-v", "--html=report_ai.html"])

