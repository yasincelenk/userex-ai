(function () {
  // Find the current script tag to extract configuration
  const currentScript = document.currentScript;
  const scriptSrc = currentScript.src;
  const baseUrl = new URL(scriptSrc).origin; // Dynamically get base URL

  const attrColor = currentScript.getAttribute('data-color');
  const chatbotId = currentScript.getAttribute('data-chatbot-id') || 'default';

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
    launcherIcon: 'message'
  };

  // Function to initialize widget
  function initWidget() {
    // Determine position styles
    const isLeft = settings.position === 'bottom-left';
    const horizontalStyle = isLeft ? { left: '20px', right: 'auto' } : { right: '20px', left: 'auto' };

    // Create Launcher Button
    const launcher = document.createElement('div');
    launcher.id = 'userex-chatbot-launcher';

    const isTextStyle = settings.launcherStyle === 'text' || settings.launcherStyle === 'icon_text';

    Object.assign(launcher.style, {
      position: 'fixed',
      bottom: '20px',
      width: isTextStyle ? 'auto' : `${settings.launcherWidth}px`,
      height: `${settings.launcherHeight}px`,
      minWidth: isTextStyle ? '100px' : 'auto',
      borderRadius: `${settings.launcherRadius}px`,
      backgroundColor: settings.primaryColor,
      boxShadow: '0 6px 16px rgba(0,0,0,0.2)',
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: '2147483647',
      transition: 'all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1)',
      color: 'white',
      fontFamily: 'system-ui, -apple-system, sans-serif',
      fontWeight: '600',
      fontSize: '14px',
      gap: '8px',
      padding: isTextStyle ? '0 20px' : '0',
      ...horizontalStyle
    });

    // Render Content based on Style
    let iconSvg;
    if (settings.launcherIcon === 'custom' && settings.launcherIconUrl) {
      iconSvg = `<img src="${settings.launcherIconUrl}" style="width: 24px; height: 24px; object-fit: contain;" />`;
    } else if (settings.launcherIcon === 'sparkles') {
      iconSvg = `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
         <path d="M12 2L14.4 9.6L22 12L14.4 14.4L12 22L9.6 14.4L2 12L9.6 9.6L12 2Z" fill="white" stroke="white" stroke-width="2" stroke-linejoin="round"/>
       </svg>`;
    } else {
      iconSvg = `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 13.5997 2.37562 15.1116 3.04346 16.4525C3.22094 16.8088 3.28001 17.2161 3.17712 17.6006L2.58151 19.8267C2.32295 20.793 3.20701 21.677 4.17335 21.4185L6.39939 20.8229C6.78393 20.72 7.19121 20.7791 7.54753 20.9565C8.88837 21.6244 10.4003 22 12 22Z" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>`;
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
        launcher.innerHTML = `${iconSvg}<span>${settings.launcherText}</span>`;
      } else {
        // Circle or Square (Icon only)
        launcher.innerHTML = iconSvg;
      }
    };

    renderLauncherContent(false);

    // Hover effect
    launcher.onmouseenter = () => launcher.style.transform = 'scale(1.05)';
    launcher.onmouseleave = () => launcher.style.transform = 'scale(1)';

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
      Object.assign(iframeContainer.style, {
        bottom: '90px',
        width: '350px',
        height: '500px',
        ...horizontalStyle
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
  fetch(`${baseUrl}/api/widget-settings?chatbotId=${chatbotId}`)
    .then(res => res.json())
    .then(data => {
      if (!data.error) {
        settings = {
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
          launcherIconUrl: data.launcherIconUrl || ''
        };
      }
      initWidget();
    })
    .catch(err => {
      console.error('Failed to load widget settings:', err);
      initWidget(); // Fallback to defaults
    });

})();
