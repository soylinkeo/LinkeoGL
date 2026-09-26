/**
 * LINKEO - Interactive Bio-Link Logic
 * Supports WhatsApp multi-advisor modal, service pill quotes, QR code generation, and native sharing.
 */

document.addEventListener('DOMContentLoaded', () => {
  // Update current year dynamically
  const yearElement = document.getElementById('current-year');
  if (yearElement) {
    yearElement.textContent = new Date().getFullYear();
  }

  // Phone numbers provided by user
  const PHONE_1 = '51937721429'; // 937 721 429
  const PHONE_2 = '51907362779'; // 907 362 779
  
  // Constants
  const LINKEO_URL = 'https://linkeocards.com/';
  const DEFAULT_MESSAGE = '¡Hola LINKEO! Quisiera cotizar soluciones digitales para mi negocio.';

  // DOM Elements
  const waCardTrigger = document.getElementById('whatsapp-card-trigger');
  const waModal = document.getElementById('whatsapp-modal');
  const waCloseBtn = document.getElementById('modal-close-wa');
  const waContact1 = document.getElementById('wa-contact-1');
  const waContact2 = document.getElementById('wa-contact-2');
  const waModalDesc = document.getElementById('wa-modal-desc');

  const qrTriggerBtn = document.getElementById('qr-trigger-btn');
  const qrModal = document.getElementById('qr-modal');
  const qrCloseBtn = document.getElementById('modal-close-qr');
  const qrContainer = document.getElementById('qrcode-container');
  const copyProfileBtn = document.getElementById('copy-profile-btn');
  const copyBtnText = document.getElementById('copy-btn-text');

  const shareTriggerBtn = document.getElementById('share-trigger-btn');
  const toastMessage = document.getElementById('toast-message');
  const toastText = document.getElementById('toast-text');

  const servicePills = document.querySelectorAll('.service-pill');

  let activeMessage = DEFAULT_MESSAGE;

  // Helper: Open Modal
  function openModal(modalElement) {
    if (!modalElement) return;
    modalElement.hidden = false;
    // Allow paint then add class for smooth CSS transition
    requestAnimationFrame(() => {
      modalElement.classList.add('open');
    });
    document.body.style.overflow = 'hidden';
  }

  // Helper: Close Modal
  function closeModal(modalElement) {
    if (!modalElement) return;
    modalElement.classList.remove('open');
    setTimeout(() => {
      modalElement.hidden = true;
      document.body.style.overflow = '';
    }, 240);
  }

  // Update WhatsApp links with current message
  function updateWhatsAppLinks(customMsg) {
    activeMessage = customMsg || DEFAULT_MESSAGE;
    const encoded = encodeURIComponent(activeMessage);
    if (waContact1) {
      waContact1.href = `https://wa.me/${PHONE_1}?text=${encoded}`;
    }
    if (waContact2) {
      waContact2.href = `https://wa.me/${PHONE_2}?text=${encoded}`;
    }
  }

  // Toast Notification
  let toastTimer = null;
  function showToast(message = '¡Enlace copiado al portapapeles!') {
    if (!toastMessage) return;
    if (toastText) toastText.textContent = message;
    
    toastMessage.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => {
      toastMessage.classList.remove('show');
    }, 3000);
  }

  // Copy text to clipboard
  async function copyToClipboard(text) {
    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(text);
      } else {
        // Fallback for older browsers
        const textarea = document.createElement('textarea');
        textarea.value = text;
        textarea.style.position = 'fixed';
        textarea.style.left = '-9999px';
        document.body.appendChild(textarea);
        textarea.focus();
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
      }
      showToast('¡Enlace de linkeocards.com copiado!');
      return true;
    } catch (err) {
      console.error('Error copying to clipboard:', err);
      showToast('Enlace listo para copiar');
      return false;
    }
  }

  // WhatsApp Card Trigger
  if (waCardTrigger) {
    waCardTrigger.addEventListener('click', () => {
      updateWhatsAppLinks(DEFAULT_MESSAGE);
      if (waModalDesc) {
        waModalDesc.textContent = 'Elige a un asesor disponible para cotizar:';
      }
      openModal(waModal);
    });
  }

  if (waCloseBtn) {
    waCloseBtn.addEventListener('click', () => closeModal(waModal));
  }

  // Service Pills Click -> Open WhatsApp Modal with customized inquiry
  servicePills.forEach(pill => {
    pill.addEventListener('click', () => {
      const serviceName = pill.getAttribute('data-service') || pill.textContent.trim();
      const customMsg = `¡Hola LINKEO! Deseo cotizar información sobre el servicio de: ${serviceName}.`;
      updateWhatsAppLinks(customMsg);
      if (waModalDesc) {
        waModalDesc.textContent = `Cotizar ${serviceName} con un asesor:`;
      }
      openModal(waModal);
    });
  });

  // Native Share or Fallback Copy (strictly LINKEO_URL)
  if (shareTriggerBtn) {
    shareTriggerBtn.addEventListener('click', async () => {
      const shareData = {
        title: 'LINKEO | Un toque. Más conexiones.',
        text: 'Conoce LINKEO y sus soluciones digitales en linkeocards.com:',
        url: LINKEO_URL
      };

      if (navigator.share && navigator.canShare && navigator.canShare(shareData)) {
        try {
          await navigator.share(shareData);
          return;
        } catch (err) {
          if (err.name === 'AbortError') return;
        }
      }
      
      // Fallback if Web Share API is not supported or rejected
      await copyToClipboard(LINKEO_URL);
    });
  }

  // QR Code Modal Trigger
  if (qrTriggerBtn) {
    qrTriggerBtn.addEventListener('click', () => {
      openModal(qrModal);
    });
  }

  if (qrCloseBtn) {
    qrCloseBtn.addEventListener('click', () => closeModal(qrModal));
  }

  if (copyProfileBtn) {
    copyProfileBtn.addEventListener('click', async () => {
      const ok = await copyToClipboard(LINKEO_URL);
      if (ok && copyBtnText) {
        copyBtnText.textContent = '¡Copiado!';
        setTimeout(() => {
          copyBtnText.textContent = 'Copiar linkeocards.com';
        }, 2000);
      }
    });
  }

  // Close modals on backdrop click
  [waModal, qrModal].forEach(modal => {
    if (!modal) return;
    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        closeModal(modal);
      }
    });
  });

  // Close modals on ESC key
  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeModal(waModal);
      closeModal(qrModal);
    }
  });
});
