# **<div align="center">Chronnos</div>**  
  

O Chronnos é um software que serve como uma carteira de cursos na forma de um Web app, capaz de registrar o seu histórico acadêmico e o compartilhar com o mundo. Com isso, ele possui a capacidade de armazenar seus certificados e outras informações de cursos, como custo, tempo de estudo, datas e até mesmo notas se necessário.

Além dessa mecânica fundamental para estudantes modernos, Chronnos detém um recurso único – A TimeLine. Essa propriedade, como o nome já diz, é uma linha do tempo, que se constitui em um histórico acadêmico completo, que pode ser observado e compartilhado graficamente, para uso pessoal, ou para complementar seu perfil profissional, de maneira acessível, e segura.

O Chronnos, em sua arquitetura de Back-End, utiliza o MYSQL para a definição do banco de dados, que não só armazena todas as informações fornecidas, mas também compõe parte do sistema de verificação de dados. Para o Front-End, o React foi utilizado como o framework que estabelece a interface, a entrada e passagem de valores para o banco e parte do sistema lógico, usando JAVASCRIPT.  

<br/>  

## Pré-requisitos  
**Node.JS** - O Node foi utilizado para gerenciar as dependências e rodar os servidores locais. Ele precisa ser instalado para rodar o projeto e pode ser baixado gratuitamente pelo seu site oficial: https://nodejs.org/en/download/package-manager

**Editor de código (IDE)** - É recomendado utilizar algum editor para ajustar as rotas de banco necessárias e executar comandos no terminal de maneira integrada. Você pode utilizar o da sua preferência, e existem diversas opções gratuitas como o Visual Studio Code (https://code.visualstudio.com/download), que é o ambiente utilizado e recomendado pelos desenvolvedores deste projeto. 

**MySQL** - O MySQL foi utilizado como sistema de gerenciamento de banco de dados, sendo essencial para armazenar e manipular os dados do projeto. Ele pode ser baixado gratuitamente através do seu site oficial: https://dev.mysql.com/downloads/mysql/. Além disso, é necessário rodar o backup do banco de dados que está incluído no projeto para que todas as tabelas e dados necessários sejam configurados corretamente. Após isso, é necessário ajustar o arquivo "`connection.js`" contido na pasta do Back-End com o nome do banco de dados configurado, o usuário e a senha.  


<br/>  


## Iniciando a Aplicação  
Para iniciar a aplicação é necessário usar dois terminais, um para iniciar o servidor na parte de Front-End e outro para o Back-End. Sendo neles necessário realizar as seguintes ações

**Front-End** - Acesse a pasta do frontend pelo terminal e execute o comando "`npm install`" para fazer a instalação de dependências do projeto, após a conclusão desta etapa, execute o comando "`npm start`" para iniciar o servidor local. O endereço respectivo do localhost e o IP local da máquina serão apresentados no terminal. Como o Front-End necessita do direcionamento de rotas para acessar o banco, abra o arquivo "`App.jsx`" e mude a variável global "`RotaBanco`" para o IP local, junto com sufixo "`:3000`" para definir a porta de acesso usada pelo banco.

**Back-End** - Acesse a pasta do Back-End no terminal e execute o comando "`npm install`", em seguida, execute o comando "`npm start`". Se toda a instalação ocorrer como esperado, uma mensagem de conexão estabelecida com sucesso sera exibida.

Por ultimo acesse o endereço do localhost em um navegador e o projeto será renderizado na página web de forma totalmente funcional para realizar todos os testes. O servidor local também estará aberto e disponível na mesma rede assim que o projeto for iniciado, e caso for necessário testar em outros dispositivos, copie e acesse no navegador destes outros locais o endereço completo indicado pelo IP local da máquina na etapa do Front-End.

<br />
