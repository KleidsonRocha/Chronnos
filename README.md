# **<div align="center">Chronnos</div>**  
  

O Chronnos é um software que simula uma carteira de cursos, onde nele se armazena suas aventuras acadêmicas, sejam elas já realizadas, em andamento, ou desejadas. Com isso, o software possui uma maneira simples de resguardar seus certificados e outras informações de cursos, como custo, tempo de estudo e até mesmo notas se necessário.

Além dessa mecânica fundamental para estudantes modernos, Chronnos detém um recurso único – A TimeLine. Essa propriedade, como o nome já diz, é uma linha do tempo, que se constitui em um histórico acadêmico completo, que pode ser observado e compartilhado graficamente, para uso pessoal, ou para complementar seu perfil profissional, de maneira acessível, e segura.

O Chronnos, em sua arquitetura de back-end, se perpetua no MYSQL para a definição do banco de dados, que não só armazena todas as informações fornecidas, mas também compõe parte do sistema de verificação de dados. Para o frontend, o REACT foi utilizado como o framework que estabelece a interface, a entrada e passagem de valores para o banco e parte do sistema lógico, usando JAVASCRIPT.  
  

<br/>  


## Pré-requisitos  
**Node** - O node foi utilizado para gerenciar as dependencias e rodar os servidores locais, podendo ser baixado gratuitamente pelo próprio site deles. https://nodejs.org/en/download/package-manager

**Editor de código** - É recomendado possuir algum editor, para ajustar as rotas de banco necessárias, podendo ser usado o da sua preferencia, existindo opções gratuitas como Visual Studio Code. https://code.visualstudio.com/download 

**MySQL** - O MySQL foi utilizado como sistema de gerenciamento de banco de dados, sendo essencial para armazenar e manipular os dados do projeto. Ele pode ser baixado gratuitamente através do site oficial. Além disso, é necessário rodar o backup do banco de dados que está incluído no projeto para que todas as tabelas e dados necessários sejam configurados corretamente. Após isso, é necessário ajustar o arquivo connection.js com o nome do banco de dados configurado, o usuário e a senha. https://dev.mysql.com/downloads/mysql/  
  

<br/>  


## Iniciando a Aplicação  
Para se iniciar a aplicação é necessário usar dois terminais um para iniciar o servidor na parte de frontEnd e outro para o Backend. Sendo neles necessário realizar as seguintes ações

**FrontEnd** - Acesse a pasta do frontend e execute o comando "`npm install`", após isso execute o comando "`npm start`", aparecera o ip do servidor, copie ele e vá até o arquivo `App.jsx` e mude o RotaBanco pelo ip que voce copiou com a porta 3000.

**Backend** - Acessa a pasta do backend e execute o comando "`npm install`", após isso execute o comando "`npm start`", se tudo ocorrer como esperado uma mensagem de conexão estabelecida com sucesso sera exibida.

Por ultimo acesse o link copiado por um navegador e então voce ja estara com o projeto totalmente funcional para realizar todos os testes.  

<br />

----
<div align="center">Generated using <a href="https://profilinator.rishav.dev/" target="_blank">Github Profilinator</a></div>
