# Calcula Piso

Site estático em português brasileiro para estimar porcelanato, argamassa e rejunte. Não há etapa de build nem dependências JavaScript. Abra `index.html` ou sirva esta pasta com um servidor HTTP estático.

## Cálculo

- Área = soma de comprimento × largura dos ambientes.
- Caixas = teto de `área × (1 + margem de recorte) / m² por caixa`.
- Sacos = teto de `área × consumo de argamassa × (1 + margem da argamassa) / peso do saco`.
- Rejunte = teto de `área × consumo de rejunte / peso da embalagem`.

Os consumos iniciais são exemplos editáveis, não especificações de um produto. A dimensão da peça gera um aviso para conferir o método de aplicação em peças acima de 30 × 30 cm; ela não altera sozinha o consumo inserido pelo usuário.

## Publicação

O projeto pode ser importado no Vercel como **Other** com diretório raiz nesta pasta e sem comando de build. `vercel.json` ativa URLs limpas. O plano Hobby do Vercel é restrito a uso pessoal não comercial; um site com AdSense exige um plano compatível ou outro host. Depois de obter o endereço definitivo, adicionar uma URL canônica e um `sitemap.xml` com URLs absolutas. Antes de ativar anúncios ou análise, atualizar `privacidade.html`.

Nenhum identificador de Analytics, Search Console ou AdSense está incluído nesta versão.
