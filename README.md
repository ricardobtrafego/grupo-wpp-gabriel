# Grupo do Perfume

Landing page HTML/CSS/JavaScript para grupodoperfume.com.br.
Versão visual aprovada em 03/11/2026, exportada em 04/11/2026.

## Publicação na Hostinger

- Repositório: https://github.com/ricardobtrafego/grupo-wpp-gabriel
- Branch planejada: main.
- Tipo: site personalizado HTML/PHP; não requer Node.js ou build.
- Arquivos na raiz: index.html, CSS, JavaScript, assets/ e vendor/.
- Diretório de destino na hospedagem: public_html (ou o diretório dedicado ao domínio).

No hPanel: Sites → Gerenciar site → Avançado → Git → Conectar com GitHub.
Selecione este repositório e a branch main. Confira o destino e publique.
Se a tela oferecer Importar site → Implantar do GitHub, pode usar esse fluxo.
A integração pode atualizar o site automaticamente após novos pushes.
Verifique o destino antes de implantar: uma implantação pode sobrescrever arquivos existentes.

Guia oficial:
https://www.hostinger.com/support/1583302-how-to-deploy-a-git-repository-in-hostinger/

## Domínio

Domínio comprado no Registro.br: grupodoperfume.com.br.
Crie/adicione o site na Hostinger, conecte esse domínio e siga os dados de DNS
exibidos no hPanel. Não use IP ou servidores DNS de outro site.
Se o domínio já tiver e-mail, preserve os registros de e-mail ao mudar o DNS.
Depois do apontamento, confirme o certificado HTTPS e o acesso pelo domínio.

## Cadastro: ainda em prévia

config.js contém mode: 'preview' e endpoint vazio. O formulário valida os
campos, mas não envia leads. A mensagem de prévia e noindex estão preservados.

O usuário informou ter testado a gravação manual na planilha. Isso não comprova
a integração do formulário publicado. Para ativá-la faltam configurar no site
a URL /exec do Apps Script, confirmar o convite real do WhatsApp no receptor
e testar um cadastro do começo ao fim no domínio final.

A ativação é feita em config.js com mode: 'live' e endpoint real. Nunca coloque
senhas, tokens, arquivos de leads ou credenciais do Google neste repositório.
O código do receptor permanece no projeto de integração separado.

## Desenvolvimento

Não há dependências para instalar nem etapa de compilação.
Sirva esta pasta com um servidor HTTP estático para pré-visualizar.
Os vídeos são locais. As fontes usam Google Fonts, com alternativas locais.
GSAP mantém seu aviso de licença em vendor/NOTICE.txt.

## Origem

Exportação dos arquivos usados pela versão 23 aprovada do site.
Commit de origem: 03cee695b9ae9739ba43b6c5141ad59c57154de1.
A cópia da Hostinger é independente do repositório da prévia em chatgpt.site.
