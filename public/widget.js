(function () {
  // Find the current script tag to extract configuration
  const currentScript = document.currentScript;
  const scriptSrc = currentScript.src;
  const baseUrl = new URL(scriptSrc).origin; // Dynamically get base URL

  const attrColor = currentScript.getAttribute('data-color');
  const chatbotId = currentScript.getAttribute('data-chatbot-id') || 'default';

  console.log('Userex Widget Initializing...');
  console.log('Chatbot ID:', chatbotId);

  // Default Settings
  let settings = {
    primaryColor: attrColor || '#000000',
    position: 'bottom-right',
    viewMode: 'classic',
    launcherStyle: 'circle',
    launcherWidth: 60,
    launcherHeight: 60,
    launcherRadius: 50,
    launcherText: 'Chat',
    launcherRadius: 50,
    launcherText: 'Chat',
    launcherIcon: 'message',
    launcherIconColor: '#FFFFFF',
    launcherBackgroundColor: ''
  };

  // Function to initialize widget
  function initWidget() {
    // Check if widget already exists
    if (document.getElementById('userex-chatbot-launcher')) {
      return;
    }

    // Determine position styles
    const position = settings.position || 'bottom-right';
    const isLeft = position.includes('left');
    const isRight = position.includes('right');
    const isCenter = position.includes('center'); // Horizontal center
    const isTop = position.includes('top');
    const isBottom = position.includes('bottom');
    const isMiddle = position.includes('middle'); // Vertical middle

    // Adjust spacing for mobile
    const isMobile = window.innerWidth < 768;
    if (isMobile) {
      settings.bottomSpacing = Math.max(settings.bottomSpacing, 20); // Ensure at least 20px
      settings.sideSpacing = Math.max(settings.sideSpacing, 20); // Ensure at least 20px
    }

    const verticalSpacing = settings.bottomSpacing !== undefined ? settings.bottomSpacing : 20;
    const sideSpacing = settings.sideSpacing !== undefined ? settings.sideSpacing : 20;

    // Mobile Styles Injection
    const addMobileStyles = () => {
      if (document.getElementById('userex-mobile-styles')) return;
      const style = document.createElement('style');
      style.id = 'userex-mobile-styles';
      style.innerHTML = `
        @media (max-width: 768px) {
          #userex-chatbot-container {
            width: 100% !important;
            height: 100% !important;
            max-width: 100% !important;
            max-height: 100% !important;
            top: 0 !important;
            left: 0 !important;
            right: 0 !important;
            bottom: 0 !important;
            border-radius: 0 !important;
            transform: none !important;
          }
          #userex-chatbot-launcher {
             max-width: calc(100vw - 40px) !important;
          }
        }
      `;
      document.head.appendChild(style);
    };
    addMobileStyles();

    // Horizontal Style
    let horizontalStyle = {};
    if (isLeft) {
      horizontalStyle = { left: `${sideSpacing}px`, right: 'auto' };
    } else if (isRight) {
      horizontalStyle = { right: `${sideSpacing}px`, left: 'auto' };
    } else if (isCenter) {
      horizontalStyle = { left: '50%', transform: 'translateX(-50%)', right: 'auto' };
    }

    // Vertical Style for Launcher
    let verticalStyle = {};
    if (isTop) {
      verticalStyle = { top: `${verticalSpacing}px`, bottom: 'auto' };
    } else if (isBottom) {
      verticalStyle = { bottom: `${verticalSpacing}px`, top: 'auto' };
    } else if (isMiddle) {
      verticalStyle = { top: '50%', transform: 'translateY(-50%)', bottom: 'auto' };
    }

    // Combined Transform for Middle Center
    if (isMiddle && isCenter) {
      verticalStyle = { top: '50%', left: '50%', transform: 'translate(-50%, -50%)', bottom: 'auto', right: 'auto' };
      horizontalStyle = {}; // Clear horizontal style as it's handled in verticalStyle
    }

    // Shadow Styles
    const shadows = {
      'none': 'none',
      'light': '0 2px 8px rgba(0,0,0,0.1)',
      'medium': '0 6px 16px rgba(0,0,0,0.2)',
      'heavy': '0 10px 24px rgba(0,0,0,0.3)'
    };
    const shadowStyle = shadows[settings.launcherShadow] || shadows['medium'];

    // Animation Styles
    const addAnimationStyles = () => {
      if (document.getElementById('userex-animation-styles')) return;
      const style = document.createElement('style');
      style.id = 'userex-animation-styles';
      style.innerHTML = `
            @keyframes userex-pulse {
                0% { box-shadow: 0 0 0 0 rgba(0, 0, 0, 0.7); }
                70% { box-shadow: 0 0 0 10px rgba(0, 0, 0, 0); }
                100% { box-shadow: 0 0 0 0 rgba(0, 0, 0, 0); }
            }
            @keyframes userex-bounce {
                0%, 20%, 50%, 80%, 100% { transform: translateY(0); }
                40% { transform: translateY(-10px); }
                60% { transform: translateY(-5px); }
            }
            @keyframes userex-wiggle {
                0%, 100% { transform: rotate(-3deg); }
                50% { transform: rotate(3deg); }
            }
            @keyframes userex-float {
                0% { transform: translateY(0px); }
                50% { transform: translateY(-10px); }
                100% { transform: translateY(0px); }
            }
            @keyframes userex-spin {
                from { transform: rotate(0deg); }
                to { transform: rotate(360deg); }
            }
            .userex-anim-pulse {
                animation: userex-pulse 2s infinite;
            }
            .userex-anim-bounce {
                animation: userex-bounce 2s infinite;
            }
            .userex-anim-wiggle {
                animation: userex-wiggle 1s ease-in-out infinite;
            }
            .userex-anim-float {
                animation: userex-float 3s ease-in-out infinite;
            }
            .userex-anim-spin {
                animation: userex-spin 4s linear infinite;
            }
        `;
      document.head.appendChild(style);
    };

    if (settings.launcherAnimation !== 'none') {
      addAnimationStyles();
    }

    // Create Launcher Button
    const launcher = document.createElement('div');
    launcher.id = 'userex-chatbot-launcher';

    const isTextStyle = settings.launcherStyle === 'text' || settings.launcherStyle === 'icon_text';

    // Icon rendering
    let iconHtml = '';
    if (settings.launcherIcon === 'custom' && settings.launcherIconUrl) {
      // Custom uploaded icon
      iconHtml = `<img src="${settings.launcherIconUrl}" style="width: 24px; height: 24px; object-fit: contain;" alt="Icon" />`;
    } else if (settings.launcherIconUrl && settings.launcherIconUrl.trim() !== '') {
      // Legacy: Custom icon URL (for backward compatibility)
      iconHtml = `<img src="${settings.launcherIconUrl}" style="width: 24px; height: 24px; object-fit: contain;" alt="Icon" />`;
    } else if (settings.launcherIcon === 'sparkles') {
      iconHtml = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m12 3-1.912 5.813a2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 0 0 1-1.275-1.275L12 3Z"/></svg>`;
    } else if (settings.launcherIcon === 'library' && settings.launcherLibraryIcon) {
      // Fetch icon SVG from lucide (we'll use a simple mapping or fetch for now, or just embed a few common ones.
      // For a full library in vanilla JS without a bundler, we might need a CDN or a large mapping.
      // To keep it simple and robust, we will use a CDN for Lucide icons if 'library' is selected.
      // We strip '-icon' suffix and 'Lucide' prefix to ensure correct icon name generation.
      // e.g. 'LucideMessageCircle' -> 'MessageCircle' -> 'message-circle'
      // e.g. 'ActivityIcon' -> 'Activity' -> 'activity'
      const iconName = settings.launcherLibraryIcon
        .replace(/^Lucide/, '')
        .replace(/([a-z0-9])([A-Z])/g, '$1-$2')
        .toLowerCase()
        .replace(/-icon$/, '');
      iconHtml = `<i data-lucide="${iconName}" style="width: 24px; height: 24px; color: ${settings.launcherIconColor || '#FFFFFF'};"></i>`;

      // Inject Lucide Script if not already present
      if (!document.getElementById('userex-lucide-script')) {
        const script = document.createElement('script');
        script.id = 'userex-lucide-script';
        script.src = 'https://unpkg.com/lucide@latest';
        script.onload = () => {
          if (window.lucide) {
            window.lucide.createIcons();
          }
        };
        document.head.appendChild(script);
      } else if (window.lucide) {
        // If script exists, try to render icons immediately (or after a short delay to ensure DOM is ready)
        setTimeout(() => window.lucide.createIcons(), 100);
      }
    } else {
      // Default Message Icon
      iconHtml = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15a2 0 0 1-2 2H7l-4 4V5a2 0 0 1 2-2h14a2 0 0 1 2 2z"/></svg>`;
    }

    Object.assign(launcher.style, {
      position: 'fixed',
      width: isTextStyle ? 'auto' : `${settings.launcherWidth}px`,
      height: `${settings.launcherHeight}px`,
      minWidth: isTextStyle ? '100px' : 'auto',
      borderRadius: `${settings.launcherRadius}px`,
      backgroundColor: settings.launcherBackgroundColor || settings.brandColor || settings.primaryColor,
      boxShadow: shadowStyle,
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: '2147483647',
      transition: 'all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1)',
      color: 'white',
      fontFamily: 'system-ui, -apple-system, sans-serif',
      fontWeight: '600',
      padding: isTextStyle ? '0 20px' : '0',
      gap: '8px',
      ...horizontalStyle,
      ...verticalStyle
    });

    if (settings.launcherAnimation === 'pulse') {
      launcher.classList.add('userex-anim-pulse');
    } else if (settings.launcherAnimation === 'bounce') {
      launcher.classList.add('userex-anim-bounce');
    } else if (settings.launcherAnimation === 'wiggle') {
      launcher.classList.add('userex-anim-wiggle');
    } else if (settings.launcherAnimation === 'float') {
      launcher.classList.add('userex-anim-float');
    } else if (settings.launcherAnimation === 'spin') {
      launcher.classList.add('userex-anim-spin');
    }

    const closeSvg = `
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M18 6L6 18M6 6L18 18" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>
    `;

    const renderLauncherContent = (isOpen) => {
      if (isOpen) {
        launcher.innerHTML = closeSvg;
        return;
      }

      if (settings.launcherStyle === 'text') {
        launcher.innerHTML = `<span>${settings.launcherText}</span>`;
      } else if (settings.launcherStyle === 'icon_text') {
        launcher.innerHTML = `${iconHtml}<span>${settings.launcherText}</span>`;
      } else {
        // Circle or Square (Icon only)
        launcher.innerHTML = iconHtml;
      }

      if (window.lucide) {
        window.lucide.createIcons();
      }
    };

    renderLauncherContent(false);

    // Hover effect
    launcher.onmouseenter = () => {
      let transform = 'scale(1.05)';
      if (isMiddle && isCenter) transform = 'translate(-50%, -50%) scale(1.05)';
      else if (isMiddle) transform = 'translateY(-50%) scale(1.05)';
      else if (isCenter) transform = 'translateX(-50%) scale(1.05)';
      launcher.style.transform = transform;
    };
    launcher.onmouseleave = () => {
      let transform = 'scale(1)';
      if (isMiddle && isCenter) transform = 'translate(-50%, -50%) scale(1)';
      else if (isMiddle) transform = 'translateY(-50%) scale(1)';
      else if (isCenter) transform = 'translateX(-50%) scale(1)';
      launcher.style.transform = transform;
    };

    // Create Iframe Container
    const iframeContainer = document.createElement('div');
    iframeContainer.id = 'userex-chatbot-container';

    // Base styles
    Object.assign(iframeContainer.style, {
      position: 'fixed',
      boxShadow: '0 8px 24px rgba(0,0,0,0.15)',
      borderRadius: '12px',
      overflow: 'hidden',
      zIndex: '2147483647',
      display: 'none',
      backgroundColor: '#fff',
      transition: 'all 0.3s ease'
    });

    // Apply View Mode Styles
    if (settings.viewMode === 'wide') {
      if (settings.modalSize === 'full') {
        // Full Screen Modal Styles
        Object.assign(iframeContainer.style, {
          top: '0',
          left: '0',
          width: '100%',
          height: '100%',
          maxWidth: '100%',
          maxHeight: '100%',
          borderRadius: '0',
          bottom: 'auto',
          right: 'auto'
        });
      } else {
        // Half/Wide Modal Styles (Default)
        Object.assign(iframeContainer.style, {
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: '1000px', // Increased
          maxWidth: '95%',
          height: '700px', // Increased
          maxHeight: '90vh',
          bottom: 'auto',
          right: 'auto'
        });
      }
    } else {
      // Classic Styles
      let classicVerticalStyle = {};
      if (isTop) {
        classicVerticalStyle = { top: `${verticalSpacing + settings.launcherHeight + 10}px`, bottom: 'auto' };
      } else if (isBottom) {
        classicVerticalStyle = { bottom: `${verticalSpacing + settings.launcherHeight + 10}px`, top: 'auto' };
      } else if (isMiddle) {
        // For middle, we place it next to the launcher
        classicVerticalStyle = { top: '50%', transform: 'translateY(-50%)' };
        // Adjust horizontal to be next to launcher
        if (isLeft) {
          Object.assign(horizontalStyle, { left: `${sideSpacing + settings.launcherWidth + 10}px`, right: 'auto' });
        } else if (isRight) {
          Object.assign(horizontalStyle, { right: `${sideSpacing + settings.launcherWidth + 10}px`, left: 'auto' });
        } else if (isCenter) {
          // Middle Center - place it below (or above if not enough space, but let's default to below for now)
          classicVerticalStyle = { top: '50%', transform: 'translate(-50%, -50%)' }; // Centered on screen
          // Actually for classic view in middle center, maybe just center it?
          // Let's offset it slightly so it doesn't cover the launcher if possible, or just center it over.
          // Let's center it completely.
          horizontalStyle = { left: '50%', transform: 'translate(-50%, -50%)', right: 'auto' };
          classicVerticalStyle = { top: '50%', bottom: 'auto' };
        }
      }

      Object.assign(iframeContainer.style, {
        width: '350px',
        height: '500px',
        ...horizontalStyle,
        ...classicVerticalStyle
      });
    }

    // Create Iframe
    const iframe = document.createElement('iframe');
    iframe.src = `${baseUrl}/chatbot-view?id=${chatbotId}`;
    iframe.style.width = '100%';
    iframe.style.height = '100%';
    iframe.style.border = 'none';

    iframeContainer.appendChild(iframe);

    // Toggle Logic
    let isOpen = false;
    const toggleWidget = (forceState) => {
      isOpen = forceState !== undefined ? forceState : !isOpen;
      iframeContainer.style.display = isOpen ? 'block' : 'none';

      // Update icon based on state
      renderLauncherContent(isOpen);
    };

    launcher.onclick = () => toggleWidget();

    // Listen for messages from iframe
    window.addEventListener('message', (event) => {
      if (event.data.type === 'USEREX_CLOSE_WIDGET') {
        toggleWidget(false);
      }
      if (event.data.type === 'USEREX_TOGGLE_SIZE') {
        if (settings.viewMode === 'wide') {
          const isExpanded = event.data.isExpanded;
          if (isExpanded) {
            // Full Screen
            Object.assign(iframeContainer.style, {
              top: '0',
              left: '0',
              width: '100%',
              height: '100%',
              maxWidth: '100%',
              maxHeight: '100%',
              borderRadius: '0',
              transform: 'none'
            });
          } else {
            // Revert to Half/Wide
            Object.assign(iframeContainer.style, {
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              width: '1000px', // Increased from 800px
              maxWidth: '95%', // Increased from 90%
              height: '700px', // Increased from 600px
              maxHeight: '90vh', // Increased from 80vh
              borderRadius: '12px'
            });
          }
        }
      }
    });

    // Append to body
    document.body.appendChild(launcher);
    document.body.appendChild(iframeContainer);
  }

  // Fetch settings from API
  fetch(`${baseUrl}/api/widget-settings?chatbotId=${chatbotId}&t=${Date.now()}`)
    .then(res => res.json())
    .then(data => {
      console.log('Widget Settings API Response:', data);
      if (!data.error) {
        settings = {
          brandColor: data.brandColor,
          primaryColor: attrColor || data.brandColor || '#000000',
          position: data.position || 'bottom-right',
          viewMode: data.viewMode || 'classic',
          modalSize: data.modalSize || 'half',
          launcherStyle: data.launcherStyle || 'circle',
          launcherText: data.launcherText || 'Chat',
          launcherRadius: data.launcherRadius !== undefined ? data.launcherRadius : 50,
          launcherHeight: data.launcherHeight || 60,
          launcherWidth: data.launcherWidth || 60,
          launcherIcon: data.launcherIcon || 'message',
          launcherIconColor: data.launcherIconColor || '#FFFFFF',
          // Only use launcherBackgroundColor if it's explicitly set (not empty string)
          launcherBackgroundColor: (data.launcherBackgroundColor && data.launcherBackgroundColor.trim()) ? data.launcherBackgroundColor : '',
          launcherIconUrl: data.launcherIconUrl || '',
          launcherLibraryIcon: data.launcherLibraryIcon || 'MessageSquare',
          bottomSpacing: data.bottomSpacing !== undefined ? data.bottomSpacing : 20,
          sideSpacing: data.sideSpacing !== undefined ? data.sideSpacing : 20,
          launcherShadow: data.launcherShadow || 'medium',
          launcherAnimation: data.launcherAnimation || 'none'
        };
        console.log('Final settings object:', settings);
        console.log('Launcher will use color:', settings.launcherBackgroundColor || settings.primaryColor);
      }
      initWidget();
    })
    .catch(err => {
      console.error('Failed to load widget settings:', err);
      initWidget(); // Fallback to defaults
    });

})();
