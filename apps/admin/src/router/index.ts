import type { App } from 'vue'
import { createWebHashHistory, createRouter } from 'vue-router'
import { http } from '@/http'

import login from '../pages/login/index.vue'
import home from '../pages/home/index.vue'
import deviceStatus from '../pages/status/device.vue'
import wanStatus from '../pages/status/wan.vue'
import wlanInfo from '../pages/status/wlan-info.vue'
import wlanDevices from '../pages/status/wlan-devices.vue'
import lanInfo from '../pages/status/lan-info.vue'
import lanDevices from '../pages/status/lan-devices.vue'
import optical from '../pages/status/optical.vue'
import voip from '../pages/status/voip.vue'
import cwmpStatus from '../pages/status/cwmp.vue'
import sta from '../pages/status/sta.vue'
import usb from '../pages/status/usb.vue'
import vpnInfo from '../pages/status/vpn.vue'
import wanNetwork from '../pages/network/wan.vue'
import wanBinding from '../pages/network/wan-binding.vue'
import lan from '../pages/network/lan.vue'
import lanipv6 from '../pages/network/lan-ipv6.vue'
import lanipv6New from '../pages/network/lan-ipv6-old.vue'
import mlo from '../pages/network/mlo.vue'
import basicB24g from '../pages/network/wlan-b24g-basic.vue'
import advancedB24g from '../pages/network/wlan-b24g-advanced.vue'
import basicB5g from '../pages/network/wlan-b5g-basic.vue'
import advancedB5g from '../pages/network/wlan-b5g-advanced.vue'
import portSetting from '../pages/network/port-setting.vue'
import staticRoute from '../pages/network/static-route.vue'
import defaultRoute from '../pages/network/default-route.vue'
import mesh from '../pages/network/mesh.vue'
import vpn from '../pages/network/vpn.vue'
import basicVoip from '../pages/network/voip-basic.vue'
import advancedVoip from '../pages/network/voip-advanced.vue'
import firewall from '../pages/security/firewall.vue'
import urlFilter from '../pages/security/url-filter.vue'
import macFilter from '../pages/security/mac-filter.vue'
import wifiMacFilter from '../pages/security/wifi-mac-filter.vue'
import ipv4Filter from '../pages/security/ipv4-filter.vue'
import acl from '../pages/security/acl.vue'
import dos from '../pages/security/dos.vue'
import portMapping from '../pages/app/port-mapping.vue'
import portTrigger from '../pages/app/port-trigger.vue'
import dmz from '../pages/app/dmz.vue'
import staticDns from '../pages/app/static-dns.vue'
import staticArp from '../pages/app/static-arp.vue'
import ddns from '../pages/app/ddns.vue'
import upnp from '../pages/app/upnp.vue'
import cwmp from '../pages/app/cwmp.vue'
import time from '../pages/app/time.vue'
import igmpMld from '../pages/app/igmp-mld.vue'
import dhcpStaticIp from '../pages/app/dhcp-static-ip.vue'
import dhcpv6StaticIp from '../pages/app/dhcpv6-static-ip.vue'
import storage from '../pages/app/storage.vue'
import mediaSharing from '../pages/app/media-sharing.vue'
import samba from '../pages/app/samba.vue'
import upgrade from '../pages/management/upgrade.vue'
import user from '../pages/management/user.vue'
import device from '../pages/management/device.vue'
import log from '../pages/management/log.vue'
import terminal from '../pages/management/terminal.vue'
import ontAuth from '../pages/management/ont-auth.vue'
import internetDiagnose from '../pages/management/diagnose-internet.vue'
import remoteDiagnose from '../pages/management/diagnose-remote.vue'
import help from '../pages/help/index.vue'

export const loginPath = '/login'

export const router = createRouter({
  history: createWebHashHistory(),
  routes: [
    {
      path: '/',
      redirect: '/home',
    },
    {
      path: loginPath,
      name: 'login',
      component: login,
    },
    {
      path: '/home',
      // name: 'home',
      // component: home,
      redirect: '/status/device',
    },
    {
      path: '/status',
      redirect: '/status/device',
    },
    {
      path: '/status/device',
      name: 'deviceStatus',
      component: deviceStatus,
    },
    {
      path: '/status/wan',
      name: 'wanStatus',
      component: wanStatus,
    },
    {
      path: '/status/wlan/info',
      name: 'wlanInfo',
      component: wlanInfo,
    },
    {
      path: '/status/wlan/devices',
      name: 'wlanDevices',
      component: wlanDevices,
    },
    {
      path: '/status/lan/info',
      name: 'lanInfo',
      component: lanInfo,
    },
    {
      path: '/status/lan/devices',
      name: 'lanDevices',
      component: lanDevices,
    },
    {
      path: '/status/optical',
      name: 'optical',
      component: optical,
    },
    {
      path: '/status/voip',
      name: 'voip',
      component: voip,
    },
    {
      path: '/status/cwmp',
      name: 'cwmpStatus',
      component: cwmpStatus,
    },
    {
      path: '/status/sta',
      name: 'sta',
      component: sta,
    },
    {
      path: '/status/usb',
      name: 'usb',
      component: usb,
    },
    {
      path: '/status/vpn',
      name: 'vpnInfo',
      component: vpnInfo,
    },
    {
      path: '/network',
      redirect: '/network/wan',
    },
    {
      path: '/network/wan',
      name: 'wanNetwork',
      component: wanNetwork,
    },
    {
      path: '/network/wan-binding',
      name: 'wanBinding',
      component: wanBinding,
    },
    {
      path: '/network/lan/ipv4',
      name: 'lanipv4',
      component: lan,
    },
    {
      path: '/network/lan/ipv6',
      name: 'lanipv6',
      component: lanipv6,
    },
    // {
    //   path: '/network/lan/ipv6-new',
    //   name: 'lanipv6New',
    //   component: lanipv6New,
    // },
    {
      path: '/network/wlan/mlo',
      name: 'mlo',
      component: mlo,
    },
    {
      path: '/network/wlan/basic-24g',
      name: 'basicB24g',
      component: basicB24g,
    },
    {
      path: '/network/wlan/advanced-24g',
      name: 'advancedB24g',
      component: advancedB24g,
    },
    {
      path: '/network/wlan/basic-5g',
      name: 'basicB5g',
      component: basicB5g,
    },
    {
      path: '/network/wlan/advanced-5g',
      name: 'advancedB5g',
      component: advancedB5g,
    },
    {
      path: '/network/port-setting',
      name: 'portSetting',
      component: portSetting,
    },
    {
      path: '/network/static-route',
      name: 'staticRoute',
      component: staticRoute,
    },
    // {
    //   path: '/network/default-route',
    //   name: 'defaultRoute',
    //   component: defaultRoute,
    // },
    {
      path: '/network/mesh',
      name: 'mesh',
      component: mesh,
    },
    {
      path: '/network/vpn',
      name: 'vpn',
      component: vpn,
    },
    {
      path: '/network/wlan/basic-voip',
      name: 'basicVoip',
      component: basicVoip,
    },
    {
      path: '/network/wlan/advanced-voip',
      name: 'advancedVoip',
      component: advancedVoip,
    },
    {
      path: '/security',
      redirect: '/security/firewall',
    },
    {
      path: '/security/firewall',
      name: 'firewall',
      component: firewall,
    },
    {
      path: '/security/url-filter',
      name: 'urlFilter',
      component: urlFilter,
    },
    {
      path: '/security/mac-filter',
      name: 'macFilter',
      component: macFilter,
    },
    {
      path: '/security/wifi-mac-filter',
      name: 'wifiMacFilter',
      component: wifiMacFilter,
    },
    {
      path: '/security/ipv4-filter',
      name: 'ipv4Filter',
      component: ipv4Filter,
    },
    {
      path: '/security/acl',
      name: 'acl',
      component: acl,
    },
    {
      path: '/security/dos',
      name: 'dos',
      component: dos,
    },
    {
      path: '/app',
      redirect: '/app/static-dns',
    },
    {
      path: '/app/static-dns',
      name: 'static-dns',
      component: staticDns,
    },
    {
      path: '/app/ddns',
      name: 'ddns',
      component: ddns,
    },
    {
      path: '/app/port-mapping',
      name: 'port-mapping',
      component: portMapping,
    },
    // {
    //   path: '/app/port-trigger',
    //   name: 'port-trigger',
    //   component: portTrigger,
    // },
    {
      path: '/app/dmz',
      name: 'dmz',
      component: dmz,
    },
    {
      path: '/app/upnp',
      name: 'upnp',
      component: upnp,
    },
    {
      path: '/app/cwmp',
      name: 'cwmp',
      component: cwmp,
    },
    {
      path: '/app/time',
      name: 'time',
      component: time,
    },
    // {
    //   path: '/app/igmp-mld',
    //   name: 'igmp-mld',
    //   component: igmpMld,
    // },
    // {
    //   path: '/app/static-arp',
    //   name: 'static-arp',
    //   component: staticArp,
    // },
    {
      path: '/app/dhcp-static-ip',
      name: 'dhcp-static-ip',
      component: dhcpStaticIp,
    },
    {
      path: '/app/dhcpv6-static-ip',
      name: 'dhcpv6-static-ip',
      component: dhcpv6StaticIp,
    },
    {
      path: '/app/storage',
      name: 'storage',
      component: storage,
    },
    {
      path: '/app/media-sharing',
      name: 'media-sharing',
      component: mediaSharing,
    },
    {
      path: '/app/samba',
      name: 'samba',
      component: samba,
    },
    {
      path: '/management',
      redirect: '/management/upgrade',
    },
    {
      path: '/management/upgrade',
      name: 'upgrade',
      component: upgrade,
    },
    {
      path: '/management/user',
      name: 'user',
      component: user,
    },
    {
      path: '/management/device',
      name: 'device',
      component: device,
    },
    {
      path: '/management/log',
      name: 'log',
      component: log,
    },
    {
      path: '/management/terminal',
      name: 'terminal',
      component: terminal,
    },
    {
      path: '/management/ont-auth',
      name: 'ont-auth',
      component: ontAuth,
    },
    {
      path: '/management/diagnose/internet',
      name: 'internet-diagnose',
      component: internetDiagnose,
    },
    {
      path: '/management/diagnose/remote',
      name: 'oremote-diagnose',
      component: remoteDiagnose,
    },
    {
      path: '/help',
      name: 'help',
      component: help,
    },
    {
      path: '/:pathMatch(.*)*',
      redirect: '/home',
    },
  ],
})

router.beforeEach(async (to, from, next) => {
  if (to.path !== loginPath) {
    if (sessionStorage.getItem('logged_user')) {
      http.cancelAllRequests()
      next()
    } else {
      next(loginPath)
    }
  } else {
    if (sessionStorage.getItem('logged_user')) {
      next('/home')
    } else {
      next()
    }
  }
})

function setupRouter(app: App) {
  app.use(router)
}

export default setupRouter
