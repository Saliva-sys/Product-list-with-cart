# Frontend Mentor - Product list with cart solution

This is my solution to the [Product list with cart challenge on Frontend Mentor](https://www.frontendmentor.io/challenges/product-list-with-cart-5MmqLVAp_d). 

## Table of contents

- [Frontend Mentor - Product list with cart solution](#frontend-mentor---product-list-with-cart-solution)
  - [Table of contents](#table-of-contents)
  - [Overview](#overview)
    - [The challenge](#the-challenge)
    - [Screenshot](#screenshot)
    - [Links](#links)
  - [My process](#my-process)
    - [Built with](#built-with)
    - [What I learned](#what-i-learned)
    - [Continued development](#continued-development)
    - [Useful resources](#useful-resources)
    - [AI Collaboration](#ai-collaboration)
  - [Author](#author)
  - [Acknowledgments](#acknowledgments)

## Overview

### The challenge

Users should be able to:

- Add items to the cart and remove them
- Increase/decrease the number of items in the cart
- See an order confirmation modal when they click "Confirm Order"
- Reset their selections when they click "Start New Order"
- View the optimal layout for the interface depending on their device's screen size
- See hover and focus states for all interactive elements on the page

### Screenshot

![Screenshot](./design/screenshot.png)

### Links

- Solution URL: [Github Repository](https://github.com/Saliva-sys/Product-list-with-cart.git)
- Live Site URL: [Live Site](https://saliva-sys.github.io/Product-list-with-cart/)

## My process

### Built with

- Semantic HTML5 markup
- CSS custom properties (Variables, Flexbox, Grid)
- REM
- Vanilla JavaScript (DOM manipulation, Fetch API)
- Mobile-first workflow
- JSON Data Integration

### What I learned

During this project, I solidified my work with dynamic UI rendering. The most interesting part was connecting the cart state with visual elements:

```javascript
// Ukážka logiky pre zobrazenie modalu a reset scrollovania
confirmBtn.addEventListener('click', () => {
    orderModal.style.display = 'flex';
    window.scrollTo(0, 0);
    document.body.style.overflow = 'hidden';
});
```

### Continued development

In future projects, I plan to focus on the following areas, which are essential for my specialization in e-commerce development and PrestaShop customization:

- **Code Modularization:** I aim to transition from a single monolithic `script.js` to a modular JavaScript approach (ES6 Modules). This will allow for better organization of cart logic, product handling, and modal components, which is crucial when managing complex e-commerce themes.
- **Templating Engines:** I want to integrate similar dynamic logic within Smarty or Twig environments. Mastering these engines is key to creating high-performance frontend modules for PrestaShop.
- **State Persistence:** I plan to explore advanced state management techniques, such as using `LocalStorage` to persist cart data after a page refresh, ensuring a seamless and reliable user shopping experience.
- **Accessibility (A11y):** Moving forward, I want to deepen my knowledge of ARIA attributes and keyboard navigation to ensure that my e-commerce components are fully accessible to all users.

### Useful resources

- [W3Schools](https://www.w3schools.com/) - This was my go-to guide for understanding how to create fluid layouts.
- [Google Fonts](https://fonts.google.com/) - Used for the Red Hat Text font family as per the design requirements.
- [MDN Web Docs - clamp()](https://developer.mozilla.org/en-US/docs/Web/CSS/clamp) - This resource helped me understand how to create fluid design without having to write dozens of Media Queries. It's the key to modern responsiveness.
- [Clamp Generator](https://clampgenerator.com/) - Great for generating responsive clamp() values.

### AI Collaboration

I worked closely with an AI assistant (Gemini) to create this component. The AI ​​helped me:

- Optimize CSS: Together, we simplified the HTML structure by removing unnecessary wrapper elements (divs).
- Debug the details: Using AI, I identified and fixed minor errors in syntax and alignment logic.

This collaboration allowed me to focus on the design logic, while the AI ​​served as an interactive 'mentor' and a tool for rapid debugging.

## Author

- Frontend Mentor - [@Saliva-sys](https://www.frontendmentor.io/profile/Saliva-sys)
- GitHub - [Saliva-sys](https://github.com/Saliva-sys)

## Acknowledgments

I would like to thank the Frontend Mentor community for providing such great challenges to practice real-world web development skills.
