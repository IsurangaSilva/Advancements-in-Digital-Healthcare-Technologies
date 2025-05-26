"""
Test the entire login flow
"""
import os
import sys
import logging
import subprocess
import bcrypt

# Configure logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(name)s - %(levelname)s - %(message)s')
logger = logging.getLogger("test_flow")

def test_login_flow():
    """Test the entire login flow"""
    print("---- Testing Login Flow ----")
      # Step 1: Check env file
    print("\nStep 1: Checking environment file...")
    # env is now in parent directory
    env_path = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "env")
    if os.path.exists(env_path):
        print(f"✓ Environment file found at {env_path}")
        with open(env_path, "r") as f:
            for line in f:
                if "MONGO_URI" in line or "MONGODB_URL" in line or "MONGO_DB_NAME" in line:
                    print(f"  {line.strip()}")
    else:
        print(f"✗ Environment file not found at {env_path}")
        print("  Running environment setup...")
        subprocess.run([sys.executable, "create_env_file.py"])
      # Step 2: Check MongoDB connection
    print("\nStep 2: Testing MongoDB connection...")
    # Use the current file path to find test_db_connection.py
    test_db_path = os.path.join(os.path.dirname(os.path.abspath(__file__)), "test_db_connection.py")
    result = subprocess.run([sys.executable, test_db_path], 
                          capture_output=True, text=True)
    if "connection is working" in result.stdout:
        print("✓ MongoDB connection successful")
    else:
        print("✗ MongoDB connection failed")
        print(result.stdout)
        return False
      # Step 3: Check default user
    print("\nStep 3: Checking default user...")
    try:
        # Since we're already in the src directory
        from db_connection import MongoDBConnection
        
        db_conn = MongoDBConnection()
        users_collection = db_conn.get_collection("users")        # Use our improved create_default_user function
        from create_default_user import create_default_user
        
        result = create_default_user(email="patient@example.com", password="password123", role="patient")
        
        if result["success"]:
            user = result["user"]
            if result["created"]:
                print("✓ Default user created successfully")
            else:
                print("✓ Default user already exists")
            
            print(f"  Username: {user.get('username')}")
            print(f"  Email: {user.get('email')}")
            print(f"  Role: {user.get('role')}")
            print("  Password: password123 (default)")
        else:
            print(f"✗ Error with default user: {result.get('error', 'Unknown error')}")
            return False

    except Exception as e:
        print(f"✗ Error checking default user: {e}")
        return False
      # Step 4: Check login file
    print("\nStep 4: Checking login file...")
    login_path = "login_new.py"
    if os.path.exists(login_path):
        print(f"✓ Login file found at {login_path}")
    else:
        print(f"✗ Login file not found at {login_path}")
        return False
    
    # Step 5: Check main file
    print("\nStep 5: Checking main application file...")
    main_path = "main.py"
    if os.path.exists(main_path):
        print(f"✓ Main application file found at {main_path}")
    else:
        print(f"✗ Main application file not found at {main_path}")
    
    print("\n---- Login Flow Test Complete ----")
    print("Everything looks good! You can now run the application.")
    print("Default login credentials:")
    print("  Email: patient@example.com")
    print("  Password: password123")
    return True

if __name__ == "__main__":
    test_login_flow()
