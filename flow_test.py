import time
from playwright.sync_api import sync_playwright
import os

def run_test():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page(viewport={"width": 1920, "height": 1080})
        
        print("Navigating to local dev server...")
        try:
            page.goto("http://localhost:8080/dashboard/dashboard.html", timeout=30000)
            time.sleep(2)
        except Exception as e:
            print(f"Failed to load page: {e}")
            return
            
        screenshot_dir = r"C:\Users\Preetham.j\.gemini\antigravity\brain\c95f737b-481b-4921-aabf-dc774f62b939"
        
        # Take home page screenshot
        page.screenshot(path=os.path.join(screenshot_dir, "infinex_dashboard_verified.png"))
        print("Dashboard verified.")
        
        # Open Quantum section
        print("Clicking Quantum Neuromorphic Engine...")
        page.click("text=Quantum Neuromorphic Engine")
        time.sleep(2)
        page.screenshot(path=os.path.join(screenshot_dir, "infinex_quantum_verified.png"))
        print("Quantum verified.")
        
        browser.close()

if __name__ == "__main__":
    run_test()
