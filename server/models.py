from sqlalchemy import Column, Integer, String, Boolean
from .database import Base

# Define a classe User que será mapeada para a tabela "users" no banco de dados.
class User(Base):
    # Nome da tabela no banco de dados.
    __tablename__ = "users"

    # Coluna 'id' que serve como chave primária (primary key).
    # É um inteiro (Integer) e tem um índice (index) para buscas rápidas.
    id = Column(Integer, primary_key=True, index=True)
    
    # Coluna 'email' que armazena o email do usuário.
    # É uma string (String) e deve ser única (unique) e indexada (index) para buscas rápidas.
    email = Column(String, unique=True, index=True)
    
    # Coluna 'hashed_password' que armazena o hash da senha do usuário.
    # É uma string (String), e não precisa ser única, pois duas senhas iguais podem ter o mesmo hash.
    hashed_password = Column(String)
    
    # Coluna 'is_active' que indica se o usuário está ativo ou não.
    # É um valor booleano (Boolean) e tem o valor padrão True (default=True).
    is_active = Column(Boolean, default=True)
