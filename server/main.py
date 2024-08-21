from fastapi import FastAPI, Depends, HTTPException 
from sqlalchemy.orm import Session
from passlib.context import CryptContext
from .database import engine, Base, get_db
from .models import User

# Cria uma instância da aplicação FastAPI.
app = FastAPI()

# Cria as tabelas do banco de dados conforme os modelos definidos.
Base.metadata.create_all(bind=engine)

# Configura o contexto para hashing de senhas, usando o algoritmo bcrypt.
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# Função para gerar o hash de uma senha.
def get_password_hash(password):
    return pwd_context.hash(password)

# Função para verificar se uma senha fornecida corresponde ao hash armazenado.
def verify_password(plain_password, hashed_password):
    return pwd_context.verify(plain_password, hashed_password)

# Endpoint para registrar um novo usuário.
@app.post("/register/")
def register_user(email: str, password: str, db: Session = Depends(get_db)):
    # Gera o hash da senha fornecida.
    hashed_password = get_password_hash(password)
    
    # Cria uma nova instância do usuário com o email e a senha hasheada.
    db_user = User(email=email, hashed_password=hashed_password)
    
    # Adiciona o usuário ao banco de dados e confirma a transação.
    db.add(db_user)
    db.commit()
    
    # Atualiza o objeto do usuário com qualquer dado gerado no banco (como um ID).
    db.refresh(db_user)
    
    # Retorna uma mensagem de sucesso.
    return {"msg": "User registered successfully"}

# Endpoint para realizar login de um usuário.
@app.post("/login/")
def login_user(email: str, password: str, db: Session = Depends(get_db)):
    # Busca o usuário no banco de dados pelo email fornecido.
    user = db.query(User).filter(User.email == email).first()
    
    # Verifica se o usuário existe e se a senha fornecida está correta.
    if not user or not verify_password(password, user.hashed_password):
        # Se as credenciais forem inválidas, levanta uma exceção HTTP 400.
        raise HTTPException(status_code=400, detail="Invalid credentials")
    
    # Retorna uma mensagem de sucesso no login.
    return {"msg": "Login successful"}

# Endpoint para recuperação de senha.
@app.post("/recover-password/")
def recover_password(email: str, db: Session = Depends(get_db)):
    # Busca o usuário no banco de dados pelo email fornecido.
    user = db.query(User).filter(User.email == email).first()
    
    # Verifica se o usuário existe.
    if not user:
        # Se o usuário não for encontrado, levanta uma exceção HTTP 404.
        raise HTTPException(status_code=404, detail="User not found")
    
    # Aqui, um email de recuperação de senha seria enviado ao usuário.
    return {"msg": "Recovery email sent"}
