# 🎠 Slider Layout

A flexible solution for building block sliders in VTEX Store Framework.

O `slider-layout` é um componente robusto e altamente personalizável para criar sliders e carrosséis em lojas VTEX. Com suporte a navegação por setas, paginação, autoplay, modo infinito e muito mais.

## Características

- ✨ Componente totalmente responsivo
- 🎯 Navegação com setas e pontos de paginação
- 🔄 Autoplay configurável
- ♿ Acessibilidade (ARIA labels)
- 🌍 Suporte a múltiplos idiomas (i18n)
- 📱 Compatibilidade com toque e gestos (swipe)
- ⚡ Performance otimizada com lazy loading
- 🎨 Customizável via CSS Handles e Site Editor

## Como Usar

### Instalação

```bash
npm install
```

### Desenvolvimento

```bash
# Lint do código
npm run lint

# Executar testes
npm test

# Formatar código
npm run format
```

### Exemplo de Uso no VTEX Store Framework

```json
{
  "slider-layout": {
    "props": {
      "itemsPerPage": 3,
      "showNavigationArrows": "always",
      "showPaginationDots": "always",
      "autoplay": {
        "stopOnHover": true,
        "interval": 5000
      }
    }
  }
}
```

## Componentes Disponíveis

- **SliderLayout**: Componente principal para criar sliders
- **SliderTrack**: Gerencia o track (trilha) dos slides
- **SliderLayoutGroup**: Agrupa múltiplos sliders
- **Pagination**: Controles de navegação por pontos
- **Navigation Arrows**: Setas para navegação

## CSS Handles

O `slider-layout` fornece diversos CSS Handles para customização de estilo:

- `slider`: Container principal
- `sliderTrackContainer`: Container da trilha
- `slide`: Cada slide individual
- `slide--visible`: Modificador para slide visível
- `paginationDot`: Ponto de paginação
- `paginationDot--isActive`: Modificador para ponto ativo

## Contribuindo

Contribuições são bem-vindas! Para contribuir:

1. Abra uma issue descrevendo o problema ou sugestão
2. Faça um fork do repositório
3. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
4. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
5. Push para a branch (`git push origin feature/AmazingFeature`)
6. Abra um Pull Request

## Licença

UNLICENSED

---

**Mantido por:** [zeluizr](https://github.com/zeluizr)
