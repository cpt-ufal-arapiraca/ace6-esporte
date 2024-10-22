import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import './styles.css';

const PasswordRecovery = () => {
  console.log("Página de recuperação de senha carregada");  
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const navigate = useNavigate();
 

  const handleSubmit = () => {
    if (password === confirmPassword && password.length > 0) {
      // Simula a lógica de salvar a nova senha
      alert("Senha alterada com sucesso!");
      navigate("/login"); // Redireciona para a página de login após a alteração
    } else if (password !== confirmPassword) {
      alert("As senhas não coincidem.");
    } else {
      alert("Por favor, insira uma nova senha.");
    }
  };

  return (
    <div className="box">
      <div className="group">
        <h2 className="text-wrapper-2">Redefinir Senha</h2>
        
        <div className="form">
          <div className="input-wrapper">
            <input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Nova senha"
            />
            <span
              className="eye-icon"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <FiEye /> : <FiEyeOff />}
            </span>
          </div>
          <label className="input-label">Insira a nova senha</label>
        </div>

        <div className="form">
          <div className="input-wrapper">
            <input
              type={showConfirmPassword ? "text" : "password"}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Confirme a nova senha"
            />
            <span
              className="eye-icon"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            >
              {showConfirmPassword ? <FiEye /> : <FiEyeOff />}
            </span>
          </div>
          <label className="input-label">Confirme a nova senha</label>
        </div>

        <div className="overlap-group">
          <button className="small-button" onClick={handleSubmit}>
            Salvar Alterações
          </button>
        </div>
      </div>
    </div>
  );
};

export default PasswordRecovery;
