#!/usr/bin/env python3
"""
Prebuild Guard - Checks for dummy/placeholder content in TypeScript files
Prevents builds with unauthorized placeholder content
"""

import os
import sys
import re
from pathlib import Path

# Patterns that indicate dummy/placeholder content (excluding legitimate HTML placeholders)
FORBIDDEN_PATTERNS = [
    r'lorem ipsum',
    r'dummy data',
    r'fake data',
    r'sample data',
    r'test data',
    r'mock data',
    r'sample question',
    r'fake question',
    r'test question',
    r'dummy question',
    r'example@email\.com',
    r'test@test\.com',
    r'fake@fake\.com',
    r'john\.doe@',
    r'jane\.doe@',
    r'sample blog',
    r'fake blog',
    r'test blog',
    r'dummy blog',
    r'sample course',
    r'fake course',
    r'test course',
    r'dummy course',
    r'sample user',
    r'test user',
    r'fake user',
    r'dummy user',
    r'john doe',
    r'jane doe',
    r'sample text content',
    r'dummy text content',
    r'fake text content',
    r'test text content',
    r'placeholder content',
    r'sample dashboard',
    r'fake dashboard',
    r'test dashboard',
    r'dummy dashboard',
    r'example\.com',
    r'sample\.com',
    r'test\.com',
    r'fake\.com',
    r'placeholder\.png',
    r'sample\.jpg',
    r'test\.png',
    r'fake\.jpg',
    r'fake stats',
    r'dummy stats',
    r'sample stats',
    r'test stats'
]

def check_file_for_dummy_content(file_path):
    """Check a single file for forbidden patterns"""
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            content = f.read().lower()
            
        violations = []
        for pattern in FORBIDDEN_PATTERNS:
            matches = re.finditer(pattern, content, re.IGNORECASE)
            for match in matches:
                line_num = content[:match.start()].count('\n') + 1
                violations.append({
                    'pattern': pattern,
                    'line': line_num,
                    'match': match.group()
                })
        
        return violations
    except Exception as e:
        print(f"Error reading {file_path}: {e}")
        return []

def scan_typescript_files():
    """Scan all TypeScript files for dummy content"""
    violations = []
    
    # Directories to scan
    scan_dirs = ['client', 'server', 'shared']
    
    for scan_dir in scan_dirs:
        if os.path.exists(scan_dir):
            for root, dirs, files in os.walk(scan_dir):
                for file in files:
                    if file.endswith(('.ts', '.tsx', '.js', '.jsx')):
                        file_path = os.path.join(root, file)
                        file_violations = check_file_for_dummy_content(file_path)
                        if file_violations:
                            violations.append({
                                'file': file_path,
                                'violations': file_violations
                            })
    
    return violations

def main():
    """Main function to run the prebuild guard"""
    print("🔍 Running Prebuild Guard - Checking for dummy content...")
    
    violations = scan_typescript_files()
    
    if violations:
        print("❌ Build failed: Dummy content detected. Please clean your code.")
        print("\nViolations found:")
        
        for file_violation in violations:
            print(f"\n📁 File: {file_violation['file']}")
            for violation in file_violation['violations']:
                print(f"   Line {violation['line']}: '{violation['match']}' (pattern: {violation['pattern']})")
        
        print("\n🚫 All dummy content must be removed before building.")
        print("💡 Replace with 'AWAITING USER CONTENT' or remove entirely.")
        sys.exit(1)
    
    print("✅ Prebuild Guard passed - No dummy content detected.")
    return 0

if __name__ == "__main__":
    main()