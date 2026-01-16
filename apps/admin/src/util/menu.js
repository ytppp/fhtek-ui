import { RouterMode, Role, customers, MeshRole, WifiVersion } from './constant'
import { format } from './tool'
import { translate } from '@/i18n/index'
// menu default config
const config = {
  show: true,
  auth: [Role.super, Role.admin], // 所有客户都可见
  mode: [RouterMode.router, RouterMode.bridge],
  meshRole: [MeshRole.controller, MeshRole.agent],
  wifiVersion: [WifiVersion.v6, WifiVersion.v7],
}
const strategyA = {
  show: true,
  auth: [Role.super], // 仅有super权限的客户可见
  mode: [RouterMode.router, RouterMode.bridge],
  meshRole: [MeshRole.controller, MeshRole.agent],
  wifiVersion: [WifiVersion.v6, WifiVersion.v7],
}
const strategyB = {
  show: true,
  auth: [Role.admin], // 仅有admin权限的客户可见
  mode: [RouterMode.router, RouterMode.bridge],
  meshRole: [MeshRole.controller, MeshRole.agent],
  wifiVersion: [WifiVersion.v6, WifiVersion.v7],
}
const menusInitial = [
  // {
  //   url: '/home',
  //   text: 'trans0006',
  //   icon: 'icon-home',
  //   config: {
  //     ...config,
  //     show: false,
  //   }, 只需要给最下层节点配置
  //   // customers: {
  //   //   [customers.demo]: {
  //   //     show: false,
  //   //   },
  //   // },
  // }, // config demo
  {
    url: '/status',
    text: 'trans0166',
    icon: 'icon-xitongzhuangtai',
    children: [
      {
        url: '/status/device',
        text: 'trans0899',
        config,
      },
      {
        url: '/status/wan',
        text: 'trans0155',
        config,
      },
      {
        url: '/status/wlan',
        text: 'trans0017',
        config,
        children: [
          {
            url: '/status/wlan/info',
            text: 'trans0931',
            config,
          },
          {
            url: '/status/wlan/devices',
            text: 'trans0932',
            config,
          },
        ],
      },
      {
        url: '/status/lan',
        text: 'trans0156',
        config,
        children: [
          {
            url: '/status/lan/info',
            text: 'trans0936',
            config,
          },
          {
            url: '/status/lan/devices',
            text: 'trans0628',
            config,
          },
        ],
      },
      {
        url: '/status/optical',
        text: 'trans0718',
        config,
      },
      {
        url: '/status/voip',
        text: 'trans0732',
        config,
      },
      {
        url: '/status/cwmp',
        text: 'trans0249',
        customers: {
          [customers.demo]: config,
          [customers.fhtek]: config,
          [customers.totalplay]: strategyA,
        },
      },
      {
        url: '/status/sta',
        text: 'trans0082',
        config,
      },
      {
        url: '/status/usb',
        text: 'trans0813',
        config,
      },
      {
        url: '/status/vpn',
        text: 'trans0647',
        config,
      },
    ],
  },
  {
    url: '/network',
    text: 'trans0014',
    icon: 'icon-earth',
    children: [
      {
        url: '/network/wan',
        text: 'trans0155',
        config,
      },
      {
        url: '/network/wan-binding',
        text: 'trans0751',
        customers: {
          [customers.demo]: config,
          [customers.fhtek]: config,
          [customers.totalplay]: strategyA,
        },
      },
      {
        url: '/network/lan',
        text: 'trans0156',
        config,
        children: [
          {
            url: '/network/lan/ipv4',
            text: 'trans0456',
            config,
          },
          {
            url: '/network/lan/ipv6',
            text: 'trans0457',
            config,
          },
          // {
          //   url: '/network/lan/ipv6-new',
          //   text: 'trans0457',
          //   config
          // },
        ],
      },
      {
        url: '/network/port-setting',
        text: 'trans0757',
        config,
      },
      {
        url: '/network/wlan',
        text: 'trans0017',
        config,
        children: [
          {
            url: '/network/wlan/mlo',
            text: 'trans0954',
            config: {
              ...config,
              wifiVersion: [WifiVersion.v7],
            },
          },
          {
            url: '/network/wlan/basic-24g',
            text: format(translate('trans0544'), [translate('trans0049')]),
            config,
          },
          {
            url: '/network/wlan/advanced-24g',
            text: format(translate('trans0611'), [translate('trans0049')]),
            customers: {
              [customers.demo]: config,
              [customers.fhtek]: config,
              [customers.totalplay]: strategyA,
            },
          },
          {
            url: '/network/wlan/basic-5g',
            text: format(translate('trans0544'), [translate('trans0050')]),
            config,
          },
          {
            url: '/network/wlan/advanced-5g',
            text: format(translate('trans0611'), [translate('trans0050')]),
            customers: {
              [customers.demo]: config,
              [customers.fhtek]: config,
              [customers.totalplay]: strategyA,
            },
          },
        ],
      },
      {
        url: '/network/static-route',
        text: 'trans0793',
        customers: {
          [customers.demo]: config,
          [customers.fhtek]: config,
          [customers.totalplay]: strategyA,
        },
      },
      // {
      //   url: '/network/default-route',
      //   text: 'trans0795',
      //   config
      // },
      {
        url: '/network/mesh',
        text: 'trans0568',
        config,
      },
      {
        url: '/network/vpn',
        text: 'trans0647',
        config,
      },
    ],
  },
  {
    url: '/security',
    text: 'trans0031',
    icon: 'icon-anquan',
    children: [
      {
        url: '/security/firewall',
        text: 'trans0060',
        config,
      },
      {
        url: '/security/url-filter',
        text: 'trans0832',
        customers: {
          [customers.demo]: config,
          [customers.fhtek]: config,
          [customers.totalplay]: strategyA,
        },
      },
      {
        url: '/security/mac-filter',
        text: 'trans0833',
        config,
      },
      {
        url: '/security/wifi-mac-filter',
        text: 'trans0827',
        config,
      },
      {
        url: '/security/ipv4-filter',
        text: 'trans0131',
        config,
      },
      {
        url: '/security/acl',
        text: 'trans0059',
        config,
      },
      {
        url: '/security/dos',
        text: 'trans0055',
        customers: {
          [customers.demo]: config,
          [customers.fhtek]: config,
          [customers.totalplay]: strategyA,
        },
      },
    ],
  },
  {
    url: '/app',
    text: 'trans0244',
    icon: 'icon-yingyong',
    children: [
      {
        url: '/app/port-mapping',
        text: 'trans0422',
        config,
      },
      // {
      //   url: '/app/port-trigger',
      //   text: 'trans0427',
      //   config
      // },
      {
        url: '/app/dmz',
        text: 'trans0254',
        config,
      },
      {
        url: '/app/ddns',
        text: 'trans0245',
        config,
      },
      {
        url: '/app/upnp',
        text: 'trans0246',
        config,
      },
      {
        url: '/app/cwmp',
        text: 'trans0271',
        customers: {
          [customers.demo]: config,
          [customers.fhtek]: config,
          [customers.totalplay]: strategyA,
        },
      },
      {
        url: '/app/time',
        text: 'trans0247',
        customers: {
          [customers.demo]: config,
          [customers.fhtek]: config,
          [customers.totalplay]: strategyA,
        },
      },
      // {
      //   url: '/app/igmp-mld',
      //   text: 'trans0248',
      //   config
      // },
      // {
      //   url: '/app/static-arp',
      //   text: 'trans0805',
      //   config
      // },
      {
        url: '/app/static-dns',
        text: 'trans0099',
        config,
      },
      {
        url: '/app/dhcp-static-ip',
        text: 'trans0250',
        config,
      },
      {
        url: '/app/dhcpv6-static-ip',
        text: 'trans0251',
        config,
      },
      {
        url: '/app/storage',
        text: 'trans0810',
        config,
      },
      {
        url: '/app/samba',
        text: 'trans0822',
        customers: {
          [customers.demo]: config,
          [customers.fhtek]: config,
          [customers.totalplay]: strategyA,
        },
      },
      {
        url: '/app/media-sharing',
        text: 'trans0823',
        config,
      },
      {
        url: '/network/voip',
        text: 'trans0732',
        children: [
          {
            url: '/network/wlan/basic-voip',
            text: 'trans0546',
            customers: {
              [customers.demo]: config,
              [customers.fhtek]: config,
              [customers.totalplay]: strategyA,
            },
          },
          {
            url: '/network/wlan/advanced-voip',
            text: 'trans0579',
            customers: {
              [customers.demo]: config,
              [customers.fhtek]: config,
              [customers.totalplay]: strategyA,
            },
          },
        ],
      },
    ],
  },
  {
    url: '/management',
    text: 'trans0183',
    icon: 'icon-setting',
    children: [
      {
        url: '/management/user',
        text: 'trans0184',
        config,
      },
      {
        url: '/management/device',
        text: 'trans0227',
        config,
      },
      {
        url: '/management/upgrade',
        text: 'trans0187',
        customers: {
          [customers.demo]: config,
          [customers.fhtek]: config,
          [customers.totalplay]: strategyA,
        },
      },
      {
        url: '/management/log',
        text: 'trans0188',
        config,
      },
      {
        url: '/management/terminal',
        text: 'trans0401',
        customers: {
          [customers.demo]: config,
          [customers.fhtek]: config,
          [customers.totalplay]: strategyA,
        },
      },
      {
        url: '/management/ont-auth',
        text: 'trans0780',
        config,
      },
      {
        url: '/management/diagnose',
        text: 'trans0802',
        children: [
          {
            url: '/management/diagnose/internet',
            text: 'trans0553',
            config,
          },
          {
            url: '/management/diagnose/remote',
            text: 'trans0803',
            customers: {
              [customers.demo]: config,
              [customers.fhtek]: config,
              [customers.totalplay]: strategyA,
            },
          },
        ],
      },
    ],
  },
]
export function getMenu(name, role, mode, meshRole, wifiVersion) {
  console.log('Init menus...')
  console.log(`customer is: ${name}`)
  if (!role || !mode || !meshRole || !wifiVersion) {
    return menusInitial
  }
  console.log(`role is: ${role}`)
  console.log(`mode is: ${mode}`)
  console.log(`meshRole is: ${meshRole}`)
  console.log(`wifiVersion is: ${wifiVersion}`)
  const generateMenu = (menus, name) => {
    menus.forEach((menu) => {
      if (menu.children) {
        return generateMenu(menu.children, name)
      } else {
        menu.config = menu.config || config
        const customers = menu.customers || {}
        const customerConfig = customers[name] || {}
        menu.config = Object.assign({}, menu.config, customerConfig)
      }
    })
    return menus
  }
  const filterMenu = (menus, role, mode, meshRole, wifiVersion) => {
    const parents = []
    menus.forEach((menu) => {
      if (menu.children) {
        const filteredChildren = filterMenu(menu.children, role, mode, meshRole, wifiVersion)
        if (filteredChildren.length) {
          parents.push({
            ...menu,
            children: filteredChildren,
          })
        }
      } else {
        if (
          menu.config.show &&
          menu.config.auth.includes(role) &&
          menu.config.mode.includes(mode) &&
          menu.config.meshRole.includes(meshRole) &&
          menu.config.wifiVersion.includes(wifiVersion)
        ) {
          parents.push(menu)
        }
      }
    })
    return parents
  }
  const menuGenerated = generateMenu(menusInitial, name)
  const menuFilterd = filterMenu(menuGenerated, role, mode, meshRole, wifiVersion)
  return menuFilterd
}
