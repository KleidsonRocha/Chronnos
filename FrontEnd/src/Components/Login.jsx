import React, { useState } from 'react';

function Login() {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [error, setError] = useState('');
  
  const handleLogin = async () => {
    try {
      const response = await fetch(`http://localhost:3000/usuarios/obterUsuario?usuario_email=${encodeURIComponent(email)}&usuario_senha=${encodeURIComponent(senha)}`);
      if (!response.ok) {
        throw new Error('Erro ao fazer login');
      }
      const userData = await response.json();
      if (userData.error) {
        setError(userData.error);
      } else {
        // Armazene os dados do usuário em um cookie de sessão
        document.cookie = `usuario=${JSON.stringify(userData)}`;
        // Redirecione para a página inicial
        window.location.href = '/';
      }
    } catch (error) {
      console.error('Erro ao fazer login:', error);
      setError('Erro ao fazer login. Por favor, tente novamente.');
    }
  };

  return (
    <div>
      <h1>Login</h1>
      {error && <p>{error}</p>}
      <div>
        <label htmlFor="email">Email:</label>
        <input type="email" id="email" value={email} onChange={(e) => setEmail(e.target.value)} />
      </div>
      <div>
        <label htmlFor="senha">Senha:</label>
        <input type="password" id="senha" value={senha} onChange={(e) => setSenha(e.target.value)} />
      </div>
      <button onClick={handleLogin}>Login</button>
      <div>
        <h1>Não possui conta?</h1>
        <a href="/Cadastro"><button>Cadastrar</button></a>

      </div>
    </div>
  );
}

export default Login;
