import sqlite3
from server.models.response_models import UserResponse
from server.enums.user_roles import UserRole
from server.enums.user_identities import UserIdentity
from server.models.user import User

class DBConnection:
    def __init__(self) -> None:
        self._db_name = "server/db/physioTrack.db"
        self.db_connection = sqlite3.connect(
            self._db_name,
            check_same_thread=False,
            timeout=5,
        )
        self._create_db()

    def _create_db(self) -> None:
        cursor = self.db_connection.cursor()
        print("Creating database...")

        if not self._check_table_exists(cursor, "Users"):
            print("Users table does not exist. Creating...")
            self._create_table(cursor, "Users", self._users_table_schema())

            self.db_connection.commit()
        else:
            print("Users table already exists.")
        
        cursor.close()
    
    def _check_table_exists(self, cursor, table_name: str) -> bool:
        cursor.execute(
            f"SELECT name FROM sqlite_master WHERE type='table' AND name='{table_name}';"
        )
        exists = cursor.fetchone() is not None
        print(f"Table exists: {exists}")
        return exists
    
    def _create_table(self, cursor, table_name: str, schema: str) -> None:
        cursor.execute(f"CREATE TABLE IF NOT EXISTS {table_name} ({schema});")
        print(f"Table {table_name} created with schema: {schema}")

    def _users_table_schema(self) -> str:
        return """
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            email TEXT NOT NULL UNIQUE,
            hashed_password TEXT NOT NULL,
            active BOOLEAN NOT NULL DEFAULT 1,
            role INTEGER NOT NULL CHECK(role IN (0, 1)),
            identity INTEGER NOT NULL CHECK(identity IN (0, 1)),
            CONSTRAINT users_email_unique UNIQUE (email)
        """
    
    def insert_user(self, name: str, email: str, hashed_password: str, role: UserRole, identity: UserIdentity) -> UserResponse:
        cursor = self.db_connection.cursor()
        try:
            print(f"Inserting user: {email}")
            cursor.execute(
                """
                INSERT INTO Users(name, email, hashed_password, role, identity)
                VALUES(?, ?, ?, ?, ?)
                """,
                (name, email, hashed_password, role.value, identity.value)
            )
            self.db_connection.commit()
            user_id = cursor.lastrowid
            print(f"User inserted with ID: {user_id}")

            return UserResponse(
                id=user_id,
                name=name,
                email=email,
                active=True,
                role=UserRole(role),
                identity=UserIdentity(identity)
            )
        except sqlite3.IntegrityError:
            raise ValueError("Email already registered")
        except sqlite3.Error as e:
            print(f"An error occurred: {e}")
            raise ValueError("An error occurred while inserting the user")
        finally:
            cursor.close()

    def get_all_users(self):
        cursor = self.db_connection.cursor()
        try:
            print("Fetching all users...")
            cursor.execute(
                """
                SELECT id, name, email, active, role, identity
                FROM Users
                """
            )
            rows = cursor.fetchall()

            print(f"Users fetched: {rows}")
            return rows
        except Exception as e:
            print(f"An error occurred: {e}")
            raise ValueError("An error occurred while fetching users.")
        finally:
            cursor.close()
    
    def get_user_by_email(self, email: str) -> User:
        cursor = self.db_connection.cursor()
        try:
            cursor.execute(
                """
                SELECT id, name, email, hashed_password, active, role, identity
                FROM Users
                WHERE email = ?
                """,
                (email,)
            )
            user_data = cursor.fetchone()

            if user_data:
                return User(
                    id=user_data[0],
                    name=user_data[1],
                    email=user_data[2],
                    hashed_password=user_data[3],
                    active=bool(user_data[4]),
                    role=UserRole(user_data[5]),
                    identity=UserIdentity(user_data[6])
                )
            else:
                raise ValueError("User not found")
        except sqlite3.Error as e:
            print(f"Database error occurred: {e}")
            raise ValueError("An error occurred while retrieving the user")
        finally:
            cursor.close()
        
    def update_password(self, email: str, new_password: str) -> None:
        hashed_password = User.hash_password(new_password)
        cursor = self.db_connection.cursor()
        try:
            cursor.execute(
                """
                UPDATE Users
                SET hashed_password = ?
                WHERE email = ?
                """,
                (hashed_password, email)
            )
            self.db_connection.commit()
        except sqlite3.Error as e:
            print(f"An error occurred: {e}")
            raise ValueError("An error occurred while updating the password")
        finally:
            cursor.close()