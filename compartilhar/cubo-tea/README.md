# Cubo TEA interativo

Pacote independente do cubo 3D nas cores azul, verde, amarelo e vermelho.

## Arquivos

- `demo.html`: demonstração pronta.
- `cubo-tea.css`: aparência, responsividade e fallback 3D.
- `cubo-tea.js`: carregamento e personalização da cena.
- `rubik-tea.splinecode`: arquivo da cena 3D.

## Testar rapidamente

Abrir `demo.html` com duplo clique exibe o fallback 3D em CSS.

Para carregar a cena Spline interativa, abra um terminal nesta pasta e execute:

```bash
python -m http.server 8000
```

Depois acesse:

```text
http://localhost:8000/demo.html
```

O runtime do Spline é carregado pelo CDN da `unpkg.com`, portanto a versão interativa precisa de conexão com a internet.

## Usar em outro projeto

Copie estes três arquivos para a mesma pasta no projeto:

```text
cubo-tea.css
cubo-tea.js
rubik-tea.splinecode
```

Adicione o CSS no `<head>`:

```html
<link rel="stylesheet" href="caminho/cubo-tea.css">
```

Adicione o componente onde deseja exibir o cubo:

```html
<div
  class="tea-cube-widget"
  data-tea-cube
  data-colors="#2F6FB0,#4F9D69,#F2C94C,#D95D5D"
  role="img"
  aria-label="Cubo interativo colorido"
>
  <div class="tea-cube-widget__fallback" aria-hidden="true">
    <div class="tea-cube-widget__css-cube">
      <span class="tea-cube-widget__face tea-cube-widget__front"></span>
      <span class="tea-cube-widget__face tea-cube-widget__back"></span>
      <span class="tea-cube-widget__face tea-cube-widget__right"></span>
      <span class="tea-cube-widget__face tea-cube-widget__left"></span>
      <span class="tea-cube-widget__face tea-cube-widget__top"></span>
      <span class="tea-cube-widget__face tea-cube-widget__bottom"></span>
    </div>
  </div>
  <canvas class="tea-cube-widget__canvas" aria-hidden="true"></canvas>
  <div class="tea-cube-widget__status" role="status">
    Carregando cubo interativo…
  </div>
</div>
```

Antes de fechar o `<body>`, carregue o JavaScript:

```html
<script src="caminho/cubo-tea.js"></script>
```

## Trocar as cores

Edite o atributo `data-colors`. As cores devem ser separadas por vírgulas:

```html
data-colors="#0057B8,#43A047,#FBC02D,#E53935"
```

As cores também podem ser nomes CSS, `rgb()` ou `hsl()`.

## Ajustar tamanho

O componente ocupa toda a largura disponível. Para limitar:

```css
.meu-cubo {
  width: min(100%, 520px);
  margin-inline: auto;
}
```

```html
<div class="tea-cube-widget meu-cubo" data-tea-cube>
  <!-- conteúdo do componente -->
</div>
```

Para alterar a altura:

```css
.tea-cube-widget,
.tea-cube-widget__canvas {
  height: 500px;
  min-height: 500px;
}
```

## Comportamento do fallback

- Em servidor HTTP, a cena Spline interativa é carregada.
- Em `file://`, aparece automaticamente o cubo 3D em CSS.
- Se a rede ou o CDN falhar, o fallback continua visível.
- O componente não inclui iframe nem a etiqueta “Built with Spline”.

## Evento de carregamento

É possível executar código quando a cena interativa estiver pronta:

```js
document
  .querySelector('[data-tea-cube]')
  .addEventListener('tea-cube:ready', (event) => {
    console.log('Cubo pronto', event.detail.application);
  });
```

## Observação

A cena foi derivada da referência pública:

<https://my.spline.design/rubik39scube-V5wJIA6B7IWVz4LIqjeqrFNt/>

Confirme que você possui autorização para distribuir e utilizar a cena em projetos de terceiros.
