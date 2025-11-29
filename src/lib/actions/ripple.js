/**
 * Ripple effect action for buttons
 * Usage: <button use:ripple>Click me</button>
 */
export function ripple(node) {
    function handleClick(event) {
        const rect = node.getBoundingClientRect();
        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;

        const ripple = document.createElement('span');
        ripple.className = 'ripple-effect';
        ripple.style.left = `${x}px`;
        ripple.style.top = `${y}px`;

        node.appendChild(ripple);

        setTimeout(() => {
            ripple.remove();
        }, 600);
    }

    node.addEventListener('click', handleClick);
    node.style.position = 'relative';
    node.style.overflow = 'hidden';

    // Add styles if not already present
    if (!document.getElementById('ripple-styles')) {
        const style = document.createElement('style');
        style.id = 'ripple-styles';
        style.textContent = `
      .ripple-effect {
        position: absolute;
        border-radius: 50%;
        background-color: rgba(255, 255, 255, 0.6);
        width: 20px;
        height: 20px;
        margin-top: -10px;
        margin-left: -10px;
        animation: ripple-animation 0.6s ease-out;
        pointer-events: none;
      }
      
      @keyframes ripple-animation {
        from {
          transform: scale(0);
          opacity: 1;
        }
        to {
          transform: scale(20);
          opacity: 0;
        }
      }
      
      @media (prefers-reduced-motion: reduce) {
        .ripple-effect {
          animation: none;
          display: none;
        }
      }
    `;
        document.head.appendChild(style);
    }

    return {
        destroy() {
            node.removeEventListener('click', handleClick);
        }
    };
}
