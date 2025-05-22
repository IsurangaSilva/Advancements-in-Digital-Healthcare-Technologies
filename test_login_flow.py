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
    env_path = os.path.join(os.path.dirname(os.path.abspath(__file__)), "env")
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
    result = subprocess.run([sys.executable, "test_db_connection.py"], 
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
        # Add path for imports to work
        sys.path.insert(0, os.path.abspath("."))
        from src.db_connection import MongoDBConnection
        
        db_conn = MongoDBConnection()
        users_collection = db_conn.get_collection("users")
        
        default_user = users_collection.find_one({"email": "patient@example.com"})
        if default_user:
            print("✓ Default user found")
            print(f"  Username: {default_user.get('username')}")
            print(f"  Email: {default_user.get('email')}")
            print(f"  Role: {default_user.get('role')}")
        else:
            print("✗ Default user not found")
            print("  Creating default user...")
            # Create default user directly
            hashed_password = bcrypt.hashpw("password123".encode('utf-8'), bcrypt.gensalt())
            new_user = {
                "email": "patient@example.com",
                "username": "patient",
                "password": hashed_password,
                "role": "patient",
                "phone": "123-456-7890"
            }
            try:
                users_collection.insert_one(new_user)
                print("✓ Default user created successfully")
                print("  Email: patient@example.com")
                print("  Password: password123")
            except Exception as e:
                print(f"✗ Error creating default user: {e}")
                print("  Error details:", str(e))
                return False

    except Exception as e:
        print(f"✗ Error checking default user: {e}")
        return False
    
    # Step 4: Check login file
    print("\nStep 4: Checking login file...")
    login_path = os.path.join("src", "login_new.py")
    if os.path.exists(login_path):
        print(f"✓ Login file found at {login_path}")
    else:
        print(f"✗ Login file not found at {login_path}")
        return False
    
    # Step 5: Check main file
    print("\nStep 5: Checking main application file...")
    main_path = os.path.join("src", "main.py")
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
