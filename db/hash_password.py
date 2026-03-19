#!/usr/bin/env python3
"""Generate a bcrypt password hash for use in initial_user.sql."""

import getpass
import sys

try:
    import bcrypt
except ImportError:
    sys.exit("Missing dependency. Run: pip install bcrypt")


def main():
    password = getpass.getpass("Enter password: ")
    confirm = getpass.getpass("Confirm password: ")

    if password != confirm:
        sys.exit("Passwords do not match.")

    hashed = bcrypt.hashpw(password.encode("utf-8"), bcrypt.gensalt(rounds=10))
    print("\nBcrypt hash (paste into initial_user.sql):")
    print(hashed.decode("utf-8"))


if __name__ == "__main__":
    main()
