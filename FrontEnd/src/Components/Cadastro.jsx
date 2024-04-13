function CadastroUsuario() {

  const handleSubmit = (event) => {
    event.preventDefault();
  
    const formData = {
      nome: document.getElementById('nome').value,
      email: document.getElementById('email').value,
      senha: document.getElementById('senha').value
    };
  
    fetch('http://localhost:3000/usuarios/adicionarUsuario', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(formData),
    })
      .then(response => response.json())
      .then(data => {
        console.log('Usuário cadastrado:', data);
        // Faça algo após o sucesso, como redirecionar ou exibir uma mensagem
      })
      .catch((error) => {
        console.error('Erro:', error);
      });
  };

  return (
    <form onSubmit={handleSubmit}>
      <label htmlFor="nome">Nome:</label>
      <input type="text" id="nome"  required /><br />
      <label htmlFor="email">Email:</label>
      <input type="email" id="email"  required /><br />
      <label htmlFor="senha">Senha:</label>
      <input type="password" id="senha" required /><br />
      <button type="submit">Cadastrar</button>
    </form>
  );
}

export default CadastroUsuario;
