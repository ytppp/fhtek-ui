import { translate } from '../i18n/index'

export const DefaultVal = '-'
export const customers = {
  demo: 'demo',
  fhtek: 'fhtek',
  totalplay: 'totalplay',
}
export enum WifiVersion {
  v6 = 'v6',
  v7 = 'v7',
}
export enum RouterMode {
  router = '0',
  bridge = '3',
}
export enum Role {
  super = 'root',
  admin = 'admin',
}
export const FileType = {
  config: '1',
  firmware: '4',
}
export const UploadAccept = {
  cfg: '.cfg',
  bin: '.bin',
}
export const IP = {
  IPv4: 'IPv4',
  IPv6: 'IPv6',
  mix: 'mix',
}

export const VlanMode = {
  Tag: 'TAG',
  Untag: 'UNTAG',
  Transparent: 'TRANSPARENT',
}

export const ProtocolType = {
  TCP: 'tcp',
  UDP: 'udp',
  ICMP: 'icmp',
  IGMP: 'igmp',
  ALL: 'all',
}

export enum EnableStatus {
  yes = '1',
  no = '0',
}

export const ModalType = {
  add: 'add',
  edit: 'edit',
}

export const WanMode = {
  bridge: 'bridge',
  route: 'route',
}

export enum StartAndStop {
  start = 'start',
  stop = 'stop',
}

export enum Encrypts {
  none = 'none',
  wpa2PskCcmp = 'psk2+ccmp',
  wpa2PskTkipCcmp = 'psk2+tkip+ccmp',
  wpa3SaeCcmp = 'sae',
  wpaWpa2PskCcmp = 'psk-mixed+ccmp',
  wpaWpa2PskTkipCcmp = 'psk-mixed+tkip+ccmp',
  wpa2PskWpa3SaeCcmp = 'sae-mixed',
  wpaPskCcmp = 'psk+ccmp',
  wpaPskTkipCcmp = 'psk+tkip+ccmp',
}

export enum WpsStatus {
  idle = 'idle',
  inProgress = 'In progress',
  configured = 'configured',
  unknown = 'unknown', // 当上述WpsStatus都不存在时，取此状态
}

export enum FilteringModes {
  blackList = '0',
  whiteList = '1',
}
export const lan = 'lan'
export const Lan1 = `${lan}1`
export const Lan2 = `${lan}2`
export const Lan3 = `${lan}3`
export const Lan4 = `${lan}4`
export const Lan5 = `${lan}5`
export const Ssid1 = 'ssid1'
export const Ssid2 = 'ssid2'
export const Ssid3 = 'ssid3'
export const Ssid4 = 'ssid4'
export const Ssidac1 = 'ssidac1'
export const Ssidac2 = 'ssidac2'
export const Ssidac3 = 'ssidac3'
export const Ssidac4 = 'ssidac4'

export const SsidText = {
  [Lan1]: 'LAN1',
  [Lan2]: 'LAN2',
  [Lan3]: 'LAN3',
  [Lan4]: 'LAN4',
  [Lan5]: '10GE',
  [Ssid1]: 'SSID1',
  [Ssid2]: 'SSID2',
  [Ssid3]: 'SSID3',
  [Ssid4]: 'SSID4',
  [Ssidac1]: 'SSIDAC1',
  [Ssidac2]: 'SSIDAC2',
  [Ssidac3]: 'SSIDAC3',
  [Ssidac4]: 'SSIDAC4',
}

export enum MeshRole {
  auto = '0',
  controller = '1',
  agent = '2',
}

export const encryptsText = {
  [Encrypts.none]: translate('trans0033'),
  [Encrypts.wpa2PskCcmp]: 'WPA2-PSK(CCMP)',
  [Encrypts.wpa2PskTkipCcmp]: 'WPA2-PSK(TKIP+CCMP)',
  [Encrypts.wpa3SaeCcmp]: 'WPA3-SAE(CCMP)',
  [Encrypts.wpaWpa2PskCcmp]: 'WPA/WPA2-PSK(CCMP)',
  [Encrypts.wpaWpa2PskTkipCcmp]: 'WPA/WPA2-PSK(TKIP+CCMP)',
  [Encrypts.wpa2PskWpa3SaeCcmp]: 'WPA2-PSK/WPA3-SAE(CCMP)',
  [Encrypts.wpaPskCcmp]: 'WPA-PSK(CCMP)',
  [Encrypts.wpaPskTkipCcmp]: 'WPA-PSK(TKIP+CCMP)',
}

export const encrypts = [
  {
    value: Encrypts.none,
    text: encryptsText[Encrypts.none],
  },
  {
    value: Encrypts.wpa2PskCcmp,
    text: encryptsText[Encrypts.wpa2PskCcmp],
  },
  {
    value: Encrypts.wpa2PskTkipCcmp,
    text: encryptsText[Encrypts.wpa2PskTkipCcmp],
  },
  {
    value: Encrypts.wpa3SaeCcmp,
    text: encryptsText[Encrypts.wpa3SaeCcmp],
  },
  {
    value: Encrypts.wpaWpa2PskCcmp,
    text: encryptsText[Encrypts.wpaWpa2PskCcmp],
  },
  {
    value: Encrypts.wpaWpa2PskTkipCcmp,
    text: encryptsText[Encrypts.wpaWpa2PskTkipCcmp],
  },
  {
    value: Encrypts.wpa2PskWpa3SaeCcmp,
    text: encryptsText[Encrypts.wpa2PskWpa3SaeCcmp],
  },
  {
    value: Encrypts.wpaPskCcmp,
    text: encryptsText[Encrypts.wpaPskCcmp],
  },
  {
    value: Encrypts.wpaPskTkipCcmp,
    text: encryptsText[Encrypts.wpaPskTkipCcmp],
  },
]

// TR069 和 VOICE 都只能创建一条
export enum ServiceType {
  TR069 = 'TR069',
  INTERNET = 'INTERNET',
  TR069_INTERNET = 'TR069_INTERNET',
  IPTV = 'IPTV',
  VOICE = 'VOICE',
  VOICE_INTERNET = 'VOICE_INTERNET',
}

export enum NetType {
  dhcp = 'dhcp',
  static = 'static',
  pppoe = 'pppoe',
  dhcpv6 = 'dhcpv6',
  auto = 'auto',
  slaac = 'slaac',
  hybrid = 'hybrid',
  bridge = 'bridge',
  none = 'none',
  all = 'all',
  b24g = '0',
  b5g = '1',
  ethernet = '2',
}

export const netTypeText = {
  [NetType.hybrid]: 'Hybrid',
  [NetType.none]: translate('trans0357'),
  [NetType.slaac]: translate('trans0471'),
  [NetType.dhcpv6]: translate('trans0408'),
  [NetType.b24g]: translate('trans0049'),
  [NetType.b5g]: translate('trans0050'),
  [NetType.ethernet]: translate('trans0494'),
  [NetType.dhcp]: translate('trans0082'),
  [NetType.static]: translate('trans0084'),
  [NetType.pppoe]: translate('trans0081'),
  [NetType.bridge]: translate('trans0083'),
  [NetType.auto]: translate('trans0487'),
}

export const Weeks = {
  mon: '1',
  tue: '2',
  wed: '3',
  thu: '4',
  fri: '5',
  sat: '6',
  sun: '7',
}

export const VpnType = {
  l2tp: 'l2tp',
  pptp: 'pptp',
}
export const VpnTypeText = {
  [VpnType.l2tp]: 'l2tp',
  [VpnType.pptp]: 'pptp',
}

export enum Mode {
  auto = 'auto',
  h10 = '10half',
  f10 = '10full',
  h100 = '100half',
  f100 = '100full',
  f1000 = '1000full',
  f10000 = '10000full',
  f5000 = '5000full',
  f2500 = '2500full',
}

export const ModeText = {
  [Mode.auto]: translate('trans0487'),
  [Mode.h10]: '10M/Half Duplex',
  [Mode.f10]: '10M/Full Duplex',
  [Mode.h100]: '100M/Half Duplex',
  [Mode.f100]: '100M/Full Duplex',
  [Mode.f1000]: '1G/Full Duplex',
  [Mode.f10000]: '10G/Full Duplex',
  [Mode.f5000]: '5G/Full Duplex',
  [Mode.f2500]: '2.5G/Full Duplex',
}

export enum WanStatus {
  UP = 'UP',
  DOWN = 'DOWN',
  DISCONNECTED = 'DISCONNECTED',
}

export enum VoipConnetStatus {
  idle = 'Idle',
  ringing = 'Ringing',
  ringback = 'Ringback',
  connecting = 'Connect',
}

export enum CwmpStatus {
  ReportedSuccessfully = '0',
  ReportedFail = '1',
  Tring = '2',
}
