export interface DeviceInfo {
  isIOS: boolean;
  isAndroid: boolean;
  isDesktop: boolean;
  isStandalone: boolean;
  browserName: 'Safari' | 'Chrome' | 'Edge' | 'Firefox' | 'Outro';
}

export const getDeviceInfo = (): DeviceInfo => {
  const ua = navigator.userAgent || '';
  
  const isIOS = /iPad|iPhone|iPod/.test(ua) && !(window as any).MSStream;
  const isAndroid = /Android/.test(ua);
  const isDesktop = !isIOS && !isAndroid;

  const isStandalone =
    window.matchMedia('(display-mode: standalone)').matches ||
    (navigator as any).standalone === true;

  let browserName: DeviceInfo['browserName'] = 'Outro';
  if (/CriOS|Chrome/.test(ua) && !/Edg/.test(ua)) browserName = 'Chrome';
  else if (/Safari/.test(ua) && !/Chrome/.test(ua)) browserName = 'Safari';
  else if (/Edg/.test(ua)) browserName = 'Edge';
  else if (/Firefox/.test(ua)) browserName = 'Firefox';

  return { isIOS, isAndroid, isDesktop, isStandalone, browserName };
};
