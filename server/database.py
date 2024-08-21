from sqlalchemy import create_engine, MetaData
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker

# URL de conexão com o banco de dados SQLite.
# "sqlite:///./test.db" significa que o banco de dados será criado no mesmo diretório onde o script é executado.
DATABASE_URL = "sqlite:///./test.db"

# Cria a engine do SQLAlchemy que será responsável por se conectar ao banco de dados.
# "connect_args={"check_same_thread": False}" é necessário no SQLite para permitir que a mesma conexão seja utilizada por diferentes threads.
engine = create_engine(DATABASE_URL, connect_args={"check_same_thread": False})

# Cria uma classe de fábrica para as sessões do banco de dados.
# "autocommit=False" e "autoflush=False" indicam que as transações não serão automaticamente comitadas ou "flushadas" (escritas no banco) até que seja explicitamente solicitado.
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Cria uma classe base para as classes ORM (Object-Relational Mapping) que serão definidas posteriormente.
# Esta base será utilizada para definir as tabelas do banco de dados.
Base = declarative_base()

# Função para obter uma sessão de banco de dados.
# A função é um gerador que cria uma nova sessão e a encerra automaticamente após o uso.
def get_db():
    db = SessionLocal()  # Cria uma nova sessão de banco de dados.
    try:
        yield db  # Retorna a sessão para uso no contexto de uma requisição, por exemplo.
    finally:
        db.close()  # Fecha a sessão após o uso para liberar os recursos.
