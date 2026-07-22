import React, { useEffect } from 'react';

export const LibrasWidget: React.FC = () => {
  useEffect(() => {
    const scriptId = 'vlibras-script';
    let script = document.getElementById(scriptId) as HTMLScriptElement;

    if (!script) {
      script = document.createElement('script');
      script.id = scriptId;
      script.src = 'https://vlibras.gov.br/app/vlibras-plugin.js';
      script.async = true;
      script.onload = () => {
        if ((window as any).VLibras) {
          new (window as any).VLibras.Widget('https://vlibras.gov.br/app');
        }
      };
      document.body.appendChild(script);
    } else if ((window as any).VLibras) {
      new (window as any).VLibras.Widget('https://vlibras.gov.br/app');
    }
  }, []);

  return (
    <div {...({ vw: 'true' } as any)} className="enabled">
      <div {...({ 'vw-access-button': 'true' } as any)} className="active"></div>
      <div {...({ 'vw-plugin-wrapper': 'true' } as any)}>
        <div className="vw-plugin-top-wrapper"></div>
      </div>
    </div>
  );
};
