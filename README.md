<div align='center'>
	<a href="https://github.com/Vinicius-CS/API-Doc-Template"><img src="https://github.com/Vinicius-CS/API-Documentation-Template/blob/main/images/logo.svg" alt="Template de Documentação para APIs" /></a>
	<h1>Template de Documentação para APIs - <a href="https://github.com/Vinicius-CS/API-Documentation-Template/wiki/Changelog">Versão 1.0.0</a></h1>
	<h3>Um template HTML simples, moderno e totalmente personalizável para a documentação de APIs.</h3>
</div>

<br>

<div align='center'>
	<a href="https://github.com/Vinicius-CS/API-Doc-Template"><img src="https://img.shields.io/badge/HTML-034c8f?style=flat&logo=html5&logoColor=ffffff" alt="HTML5" /></a>
	<a href="https://github.com/Vinicius-CS/API-Doc-Template"><img src="https://img.shields.io/badge/CSS-034c8f?style=flat&logo=css3&logoColor=ffffff" alt="CSS" /></a>
	<a href="https://github.com/Vinicius-CS/API-Doc-Template"><img src="https://img.shields.io/badge/JavaScript-034c8f?style=flat&logo=javascript&logoColor=ffffff" alt="JavaScript" /></a>
</div>

<br>

<div align='center'>
	<a href="https://github.com/Vinicius-CS/API-Doc-Template"><img src="https://github.com/Vinicius-CS/API-Doc-Template/blob/main/images/screenshot.png" alt="Template de Documentação para APIs" /></a>
</div>

- Este template é baseado em [API-Documentation-HTML-Template-V2](https://github.com/VDHSoft-com/API-Documentation-HTML-Template-V2), versão 2.0.0 de VDHSoft-com.
- Este template é personalizável através do uso de um arquivo de definição XML (`api-definition.xml`).
	<br><br>Estrutura/exemplo do arquivo XML:
```xml
<APIDefinition>
	<MainTitle>API Documentation</MainTitle>
	<TabTitle>API Documentation</TabTitle>
	<Version>1.0.0</Version>
	<LastUpdate>2024-12-07</LastUpdate>
	<Language>en</Language>
	<Logo>images/logo.svg</Logo>
	<HLTheme>dracula.css</HLTheme>
	<Servers>
		<Server>
			<i18n>production</i18n>
			<name>Production</name>
			<url>http://api.example.com</url>
		</Server>
		<Server>
			<i18n>local</i18n>
			<name>Local</name>
			<url>http://api.example.local</url>
		</Server>
	</Servers>
	<APIfunction id="1">
		<i18n>authentication</i18n>
		<title>AUTHENTICATION</title>
		<source>content-auth</source>
		<visible>true</visible>
		<type>html</type>
	</APIfunction>
	<APIfunction id="2">
		<title>GET CHARACTERS</title>
		<source>content-getcharacters</source>
		<visible>true</visible>
		<type>html</type>
	</APIfunction>
	<APIfunction id="3">
		<i18n>errors</i18n>
		<title>ERRORS</title>
		<source>content-errors</source>
		<visible>true</visible>
		<type>html</type>
	</APIfunction>
</APIDefinition>
```

- Este template possui um sistema de tradução que permite a internacionalização (i18n) do conteúdo, as traduções são carregadas a partir de um arquivo JSON (`translations.json`) e são aplicadas tanto no HTML quanto no JavaScript.
<br><br>Estrutura/exemplo do arquivo JSON:
```json
{
	"en": {
		"main_title": "API Documentation",
		"tab_title": "API Documentation",
		"version": "Version",
		"last_update": "Last Update",
		"server": "Server",
		"copy": "Copy",
		"copied": "Copied",
		"field": "Field",
		"type": "Type",
		"description": "Description",
		"error_code": "Error Code",
		"meaning": "Meaning",
		"production": "Production",
		"local": "Local",
		"authentication": "Authentication",
		"errors": "Errors"
	}
}
```

- O projeto utiliza **tags** e **i18n**; essas tags vêm da seção `<APIDefinition>` do arquivo XML, enquanto o i18n vêm do arquivo `translations.json`, ambos são substituídos automaticamente no HTML pós-gerados;
- O conteúdo é colocado em um subdiretório `content` referenciado no arquivo XML.
- O conteúdo pode ser traduzido utilizando o atributo `data-i18n` seguido da chave do valor que será utilizada no arquivo de tradução. Se uma chave não for configurada, será utilizado o valor padrão que é o valor inserido dentro das tags HTML.

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
