<div align='center'>
	<a href="https://github.com/Vinicius-CS/API-Doc-Template"><img src="https://github.com/Vinicius-CS/API-Documentation-Template/blob/main/images/logo.svg" alt="Template de Documentação para APIs" /></a>
	<h1>Template de Documentação para APIs - Versão 1.0.0</h1>
	<h3>Um template HTML simples, moderno e totalmente personalizável para a documentação de APIs.</h3>
</div>

<br>

<div align='center'>
	<a href="https://github.com/Vinicius-CS/API-Doc-Template"><img src="https://img.shields.io/badge/HTML-034c8f?style=flat&logo=html5&logoColor=ffffff" alt="HTML5" /></a>
	<a href="https://github.com/Vinicius-CS/API-Doc-Template"><img src="https://img.shields.io/badge/CSS-034c8f?style=flat&logo=css3&logoColor=ffffff" alt="CSS" /></a>
	<a href="https://github.com/Vinicius-CS/API-Doc-Template"><img src="https://img.shields.io/badge/JavaScript-034c8f?style=flat&logo=javascript&logoColor=ffffff" alt="JavaScript" /></a>
	<a href="https://github.com/Vinicius-CS/API-Doc-Template"><img src="https://img.shields.io/badge/PHP-034c8f?style=flat&logo=php&logoColor=ffffff" alt="PHP" /></a>
	<a href="https://github.com/Vinicius-CS/API-Doc-Template"><img src="https://img.shields.io/badge/XML-034c8f?style=flat&logoColor=ffffff" alt="XML" /></a>
	<a href="https://github.com/Vinicius-CS/API-Doc-Template"><img src="https://img.shields.io/badge/SVG-034c8f?style=flat&logoColor=034c8f&link=https://github.com/Vinicius-CS/API-Doc-Template" alt="SVG" /></a>
	<a href="https://github.com/Vinicius-CS/API-Doc-Template"><img src="https://img.shields.io/badge/ICO-034c8f?style=flat&logoColor=034c8f&link=https://github.com/Vinicius-CS/API-Doc-Template" alt="ICO" /></a>
</div>

<br>

<div align='center'>
	<a href="https://github.com/Vinicius-CS/API-Doc-Template"><img src="https://github.com/Vinicius-CS/API-Doc-Template/blob/main/images/screenshot.png" alt="Template de Documentação para APIs" /></a>
</div>

- Este template é baseado em [API-Documentation-HTML-Template-V2](https://github.com/VDHSoft-com/API-Documentation-HTML-Template-V2), versão 2.0.0 de VDHSoft-com.
- Este template é personalizável através do uso de um arquivo de definição xml (`api-definition.xml`).
	<br><br>Estrutura/exemplo do arquivo xml:
```xml
<APIDefinition>
	<MainTitle>API Documentation</MainTitle>
	<TabTitle>API Documentation</TabTitle>
	<Version>1.0.0</Version>
	<LastUpdate>06/12/2024</LastUpdate>
	<Logo>images/logo.svg</Logo>
	<HLTheme>dracula.css</HLTheme>
	<EMail></EMail>
	<Servers>
		<Server>
			<name>Production</name>
			<url>http://api.example.com</url>
		</Server>
		<Server>
			<name>Local</name>
			<url>http://api.example.local</url>
		</Server>
	</Servers>
	<APIfunction id="1">
		<title>AUTHENTICATION</title>
		<source>content-auth</source>
		<visible>true</visible>
		<type>html</type>
	</APIfunction>
	<APIfunction id="2">
		<title>Get Characters</title>
		<source>content-getcharacters</source>
		<visible>true</visible>
		<type>html</type>
	</APIfunction>
	<APIfunction id="3">
		<title>ERRORS</title>
		<source>content-errors</source>
		<visible>true</visible>
		<type>html</type>
	</APIfunction>
</APIDefinition>
```

- O projeto utiliza **tags**; essas tags vêm da seção `<APIDefinition>` do arquivo xml e são substituídas pelo texto nos arquivos html pós-gerados;
- O `conteúdo` é colocado em um subdiretório `content` referenciado no arquivo xml.
- O projeto é dividido em 4 partes: `index.php` (principal), `header.php`, `start-1.php`, `end-1.php`; o contexto é colocado entre start-1 e end-1;
	cada uma das partes pode conter as tags.

## Informações Adicionais

### Classes CSS
- Se você tiver um elemento na coluna central que transborda na terceira coluna, você pode adicionar a classe css `central-overflow-x` para evitar isso.
<br><br>Exemplo:
```html
<table class="central-overflow-x">...<table>
```

- Se você não quiser uma barra de rolagem, pode usar a classe css `break-word` para evitar isso.
<br><br>Exemplo:
```html
<code class="higlighted break-word">http://api.example.com/with-a-very-very-very-very-very-long-end-point-url/get<table>
```

### Versionamento
Para alterar a versão, recomenda-se a utilização no formato `MAJOR.MINOR.PATCH`, onde:

- **MAJOR (Versão Principal)**
  - Mudanças *incompatíveis com versões anteriores*.
  - Há alterações significativas na API, como a remoção ou modificação de funcionalidades existentes, que podem quebrar a compatibilidade com versões anteriores.
  - **Exemplo:** Ao atualizar de *1.0.0* para *2.0.0*, exige ajustes nos sistemas que utilizam a API.

- **MINOR (Versão Menor)**
  - Adiciona *novos recursos* de maneira *compatível com versões anteriores*.
  - Ganha novas funcionalidades, mas os recursos existentes não mudam de forma que quebre a compatibilidade.
  - **Exemplo:** Atualizar de *1.1.0* para *1.2.0* indica novos recursos sem afetar o funcionamento já existente.

- **PATCH (Correção)**
  - Indica *correções de bugs* ou *melhorias menores*, sem adicionar novos recursos ou alterar o comportamento atual.
  - A atualização é focada em resolver problemas ou melhorar a estabilidade.
  - **Exemplo:** Atualizar de *1.0.1* para *1.0.2* significa correções pequenas sem impactar funcionalidades.

- **Regras**
  - Os números sempre aumentam *sequencialmente*.
  - O MAJOR nunca deve ser incrementado junto com MINOR ou PATCH; cada mudança ocorre isoladamente.
