import { http } from './index'
import type { ApiResponse, TAxiosRequestConfig } from './type'

const api = 'api'
const createData = (data: any) => ({ data })

export const login = (params): Promise<ApiResponse<any>> => {
  return http.post('login', createData(params))
}

export const logout = (): Promise<ApiResponse<any>> => {
  return http.post('logout')
}

export const getDevModel = (): Promise<ApiResponse<any>> => {
  return http.get('getDevmodel', undefined, { toast: false, loading: false, cancel: false })
}

export const getLan = (loading: boolean = true, toast = true): Promise<ApiResponse<any>> => {
  return http.post(
    api,
    {
      method: 'dhcp:get',
    },
    { loading, toast },
  )
}

export const setLan = (params): Promise<ApiResponse<any>> => {
  return http.post(
    api,
    {
      method: 'dhcp:edit',
      data: params,
    },
    { loading: false },
  )
}

export const upload = (params, onprogressCallback): Promise<ApiResponse<any>> => {
  return http.upload('uploadTest', params, onprogressCallback, { loading: false })
}

export const uploadConfig = (params, onprogressCallback): Promise<ApiResponse<any>> => {
  return http.upload('uploadConfig', params, onprogressCallback, { loading: false })
}

export const getUpgradeStatus = (): Promise<ApiResponse<any>> => {
  return http.get('ChkUpgradeStatus', undefined, { loading: false, toast: false })
}

export const getLanSpeed = (): Promise<ApiResponse<any>> => {
  return http.get(`GetLanSpeed`)
}

export const setLanSpeed = (params): Promise<ApiResponse<any>> => {
  return http.post(`SetLanSpeed`, createData(params))
}

export const getWan = (loading: boolean = true): Promise<ApiResponse<any>> => {
  return http.get(`GetWan`, undefined, { timeout: 90000, loading })
}

export const getPortBindInfo = (params): Promise<ApiResponse<any>> => {
  return http.post(`GetPortBindInfo`, createData(params), { loading: false })
}

export const addWan = (params): Promise<ApiResponse<any>> => {
  return http.post(`AddWan`, createData(params), { timeout: 90000 })
}

export const editWan = (params): Promise<ApiResponse<any>> => {
  return http.post('SetWan', createData(params), { timeout: 90000 })
}

export const deleteWan = (params): Promise<ApiResponse<any>> => {
  return http.post('DeleteWan', createData(params), { timeout: 90000 })
}

export const getAcl = (): Promise<ApiResponse<any>> => {
  return http.post(api, {
    method: 'firewall.wan_acl:get',
  })
}

export const addAcl = (params): Promise<ApiResponse<any>> => {
  return http.post(api, {
    method: 'firewall.wan_acl:add',
    data: params,
  })
}

export const editAcl = (params): Promise<ApiResponse<any>> => {
  return http.post(api, {
    method: 'firewall.wan_acl:edit',
    data: params,
  })
}

export const delAcl = (params): Promise<ApiResponse<any>> => {
  return http.post(api, {
    method: 'firewall.wan_acl:delete',
    data: params,
  })
}

export const getIpv4Filter = (): Promise<ApiResponse<any>> => {
  return http.post(api, {
    method: 'firewall.ipv4_filter:get',
  })
}

export const addIpv4Filter = (params): Promise<ApiResponse<any>> => {
  return http.post(api, {
    method: 'firewall.ipv4_filter:add',
    data: params,
  })
}

export const editIpv4Filter = (params): Promise<ApiResponse<any>> => {
  return http.post(api, {
    method: 'firewall.ipv4_filter:edit',
    data: params,
  })
}

export const delIpv4Filter = (params): Promise<ApiResponse<any>> => {
  return http.post(api, {
    method: 'firewall.ipv4_filter:delete',
    data: params,
  })
}

export const getIpv4FilterUp = (): Promise<ApiResponse<any>> => {
  return http.post(api, {
    method: 'firewall.ipv4_filter_up:get',
  })
}

export const addIpv4FilterUp = (params): Promise<ApiResponse<any>> => {
  return http.post(api, {
    method: 'firewall.ipv4_filter_up:add',
    data: params,
  })
}

export const editIpv4FilterUp = (params): Promise<ApiResponse<any>> => {
  return http.post(api, {
    method: 'firewall.ipv4_filter_up:edit',
    data: params,
  })
}

export const delIpv4FilterUp = (params): Promise<ApiResponse<any>> => {
  return http.post(api, {
    method: 'firewall.ipv4_filter_up:delete',
    data: params,
  })
}

export const getWifi2g = (): Promise<ApiResponse<any>> => {
  return http.get('wifi.b24g.basic:get', undefined, { timeout: 90000 })
}

export const setWifi2g = (params): Promise<ApiResponse<any>> => {
  return http.post('wifi.b24g.basic:edit', createData(params), { timeout: 90000 })
}

export const getWifi2gAdv = (): Promise<ApiResponse<any>> => {
  return http.get('wifi.b24g.advanced:get', undefined, { timeout: 90000 })
}

export const setWifi2gAdv = (params): Promise<ApiResponse<any>> => {
  return http.post('wifi.b24g.advanced:edit', createData(params), { timeout: 90000 })
}

export const getWifi5gAdv = (): Promise<ApiResponse<any>> => {
  return http.get('wifi.b5g.advanced:get', undefined, { timeout: 90000 })
}

export const setWifi5gAdv = (params): Promise<ApiResponse<any>> => {
  return http.post('wifi.b5g.advanced:edit', createData(params), { timeout: 90000 })
}

export const getWps = (params): Promise<ApiResponse<any>> => {
  return http.post('wifi.wps:get', createData(params), { loading: false })
}

export const setWps = (params): Promise<ApiResponse<any>> => {
  return http.post('wifi.wps:edit', createData(params))
}

export const getWifi5g = (): Promise<ApiResponse<any>> => {
  return http.get('wifi.b5g.basic:get', undefined, { timeout: 90000 })
}

export const setWifi5g = (params): Promise<ApiResponse<any>> => {
  return http.post('wifi.b5g.basic:edit', createData(params), { timeout: 90000 })
}

export const getIpv6Lan = (): Promise<ApiResponse<any>> => {
  return http.get('GetLan6')
}

export const setIpv6Lan = (params): Promise<ApiResponse<any>> => {
  return http.post('SetLan6', createData(params), { loading: false })
}

export const getPortMapping = (): Promise<ApiResponse<any>> => {
  return http.post(api, {
    method: 'firewall.port_mapping:get',
  })
}

export const setPortMapping = (params): Promise<ApiResponse<any>> => {
  return http.post(api, {
    method: 'firewall.port_mapping:add',
    data: params,
  })
}

export const editPortMapping = (params): Promise<ApiResponse<any>> => {
  return http.post(api, {
    method: 'firewall.port_mapping:edit',
    data: params,
  })
}

export const delPortMapping = (params): Promise<ApiResponse<any>> => {
  return http.post(api, {
    method: 'firewall.port_mapping:delete',
    data: params,
  })
}

export const getDmz = (): Promise<ApiResponse<any>> => {
  return http.post(api, {
    method: 'firewall.dmz:get',
  })
}

export const setDmz = (params): Promise<ApiResponse<any>> => {
  return http.post(api, {
    method: 'firewall.dmz:edit',
    data: params,
  })
}

export const getWanList = (params): Promise<ApiResponse<any>> => {
  return http.post(api, {
    method: 'wan.info:get',
    data: params,
  })
}

export const setFirewall = (params): Promise<ApiResponse<any>> => {
  return http.post(api, {
    method: 'firewall.protection:edit',
    data: params,
  })
}

export const getFirewall = (): Promise<ApiResponse<any>> => {
  return http.post(api, {
    method: 'firewall.protection:get',
  })
}

export const getStaticDnsList = (): Promise<ApiResponse<any>> => {
  return http.post(api, {
    method: 'network.static_dns:get',
  })
}

export const addStaticDns = (params): Promise<ApiResponse<any>> => {
  return http.post(api, {
    method: 'network.static_dns:add',
    data: params,
  })
}

export const editStaticDns = (params): Promise<ApiResponse<any>> => {
  return http.post(api, {
    method: 'network.static_dns:edit',
    data: params,
  })
}

export const delStaticDns = (params): Promise<ApiResponse<any>> => {
  return http.post(api, {
    method: 'network.static_dns:delete',
    data: params,
  })
}

export const getStaticRoute = (): Promise<ApiResponse<any>> => {
  return http.post('network.static_route:get')
}

export const addStaticRoute = (params): Promise<ApiResponse<any>> => {
  return http.post('network.static_route:add', createData(params))
}

export const editStaticRoute = (params): Promise<ApiResponse<any>> => {
  return http.post('network.static_route:edit', createData(params))
}

export const delStaticRoute = (params): Promise<ApiResponse<any>> => {
  return http.post('network.static_route:delete', createData(params))
}

export const getDhcpStaticIp = (): Promise<ApiResponse<any>> => {
  return http.post('getDhcpStaticIp')
}

export const addDhcpStaticIp = (params): Promise<ApiResponse<any>> => {
  return http.post('addDhcpStaticIp', createData(params))
}

export const editDhcpStaticIp = (params): Promise<ApiResponse<any>> => {
  return http.post('editDhcpStaticIp', createData(params))
}

export const delDhcpStaticIp = (params): Promise<ApiResponse<any>> => {
  return http.post('delDhcpStaticIp', createData(params))
}

export const getOntAuth = (): Promise<ApiResponse<any>> => {
  return http.post(api, {
    method: 'management.ont_auth:get',
  })
}

export const editOntAuth = (params): Promise<ApiResponse<any>> => {
  return http.post(api, {
    method: 'management.ont_auth:edit',
    data: params,
  })
}

export const getPortMirr = (params): Promise<ApiResponse<any>> => {
  return http.post('GetPortMirr', createData(params))
}

export const setPortMirr = (params): Promise<ApiResponse<any>> => {
  return http.post('SetPortMirr', createData(params))
}

export const getTerminal = (): Promise<ApiResponse<any>> => {
  return http.post(api, {
    method: 'management.acl_control:get',
  })
}

export const setTerminal = (params): Promise<ApiResponse<any>> => {
  return http.post(api, {
    method: 'management.acl_control:edit',
    data: params,
  })
}

export const getDefaultRoute = (): Promise<ApiResponse<any>> => {
  return http.post(api, {
    method: 'network.default_route:get',
  })
}

export const setDefaultRoute = (params): Promise<ApiResponse<any>> => {
  return http.post(api, {
    method: 'network.default_route:edit',
    data: params,
  })
}

export const getAccount = (params): Promise<ApiResponse<any>> => {
  return http.post(api, {
    method: 'account:get',
    data: params,
  })
}

export const setAccount = (params): Promise<ApiResponse<any>> => {
  return http.post(api, {
    method: 'account:edit',
    data: params,
  })
}

export const getDdns = (): Promise<ApiResponse<any>> => {
  return http.post(api, {
    method: 'network.ddns:get',
  })
}

export const addDdns = (params): Promise<ApiResponse<any>> => {
  return http.post(api, {
    method: 'network.ddns:add',
    data: params,
  })
}

export const editDdns = (params): Promise<ApiResponse<any>> => {
  return http.post(api, {
    method: 'network.ddns:edit',
    data: params,
  })
}

export const delDdns = (params): Promise<ApiResponse<any>> => {
  return http.post(api, {
    method: 'network.ddns:delete',
    data: params,
  })
}

export const getWifiMacFilterStatus = (): Promise<ApiResponse<any>> => {
  return http.get('security.wifi_mac_filter.status:get')
}

export const setWifiMacFilterStatus = (params): Promise<ApiResponse<any>> => {
  return http.post('security.wifi_mac_filter.status:edit', createData(params))
}

export const getWifiMacFilter = (): Promise<ApiResponse<any>> => {
  return http.get('security.wifi_mac_filter.items:get')
}

export const addWifiMacFilter = (params): Promise<ApiResponse<any>> => {
  return http.post('security.wifi_mac_filter.items:add', createData(params))
}

export const editWifiMacFilter = (params): Promise<ApiResponse<any>> => {
  return http.post('security.wifi_mac_filter.items:edit', createData(params))
}

export const delWifiMacFilter = (params): Promise<ApiResponse<any>> => {
  return http.post('security.wifi_mac_filter.items:delete', createData(params))
}

export const getMacFilterStatus = (): Promise<ApiResponse<any>> => {
  return http.get('getMacFilterStatus')
}

export const editMacFilterStatus = (params): Promise<ApiResponse<any>> => {
  return http.post('editMacFilterStatus', createData(params))
}

export const getMacFilterItems = (): Promise<ApiResponse<any>> => {
  return http.get('getMacFilterItems')
}

export const addMacFilterItem = (params): Promise<ApiResponse<any>> => {
  return http.post('addMacFilterItem', createData(params))
}

export const editMacFilterItem = (params): Promise<ApiResponse<any>> => {
  return http.post('editMacFilterItem', createData(params))
}

export const delMacFilterItem = (params): Promise<ApiResponse<any>> => {
  return http.post('delMacFilterItem', createData(params))
}

export const getUrlFilterStatus = (): Promise<ApiResponse<any>> => {
  return http.get('getUrlFilterStatus')
}

export const editUrlFilterStatus = (params): Promise<ApiResponse<any>> => {
  return http.post('editUrlFilterStatus', createData(params))
}

export const getUrlFilterItems = (): Promise<ApiResponse<any>> => {
  return http.get('getUrlFilterItems')
}

export const addUrlFilterItem = (params): Promise<ApiResponse<any>> => {
  return http.post('addUrlFilterItem', createData(params))
}

export const editUrlFilterItem = (params): Promise<ApiResponse<any>> => {
  return http.post('editUrlFilterItem', createData(params))
}

export const delUrlFilterItem = (params): Promise<ApiResponse<any>> => {
  return http.post('delUrlFilterItem', createData(params))
}

export const getUsb = (
  loading: boolean = true,
  toast: boolean = true,
  cancel: boolean = true,
): Promise<ApiResponse<any>> => {
  return http.post(
    api,
    {
      method: 'storage.usb.status:get',
    },
    { loading, toast, cancel },
  )
}

export const usbDownload = (params): Promise<ApiResponse<any>> => {
  return http.post(api, {
    method: 'storage.client.download:add',
    data: params,
  })
}

export const getUsbDownloadList = (): Promise<ApiResponse<any>> => {
  return http.post(api, {
    method: 'storage.client.download:get',
  })
}

export const editUsbServer = (params): Promise<ApiResponse<any>> => {
  return http.post(api, {
    method: 'storage.server:edit',
    data: params,
  })
}
export const getUsbServer = (): Promise<ApiResponse<any>> => {
  return http.post(api, {
    method: 'storage.server:get',
  })
}

export const editSamba = (params): Promise<ApiResponse<any>> => {
  return http.post(api, {
    method: 'storage.samba:edit',
    data: params,
  })
}

export const getSamba = (params): Promise<ApiResponse<any>> => {
  return http.post(api, {
    method: 'storage.samba:get',
    data: params,
  })
}

export const editMediaSharing = (params): Promise<ApiResponse<any>> => {
  return http.post(api, {
    method: 'storage.media_sharing:edit',
    data: params,
  })
}

export const getMediaSharing = (): Promise<ApiResponse<any>> => {
  return http.post(api, {
    method: 'storage.media_sharing:get',
  })
}

export const getMesh = (): Promise<ApiResponse<any>> => {
  return http.get('mesh.settings:get')
}
export const getMeshStatus = (): Promise<ApiResponse<any>> => {
  return http.get('mesh.status:get', undefined, { loading: false })
}
export const setMesh = (params): Promise<ApiResponse<any>> => {
  return http.post('mesh.settings:edit', createData(params))
}
export const triggerMesh = (params): Promise<ApiResponse<any>> => {
  return http.post('mesh.trigger:edit', createData(params))
}
export const getTopology = (): Promise<ApiResponse<any>> => {
  return http.get('mesh.topology:get', undefined, { loading: false })
}
export const getVpnInfo = (): Promise<ApiResponse<any>> => {
  return http.get('network.vpn.info:get')
}
export const getVpn = (): Promise<ApiResponse<any>> => {
  return http.post(api, {
    method: 'network.vpn.settings:get',
  })
}
export const setVpn = (params): Promise<ApiResponse<any>> => {
  return http.post(api, {
    method: 'network.vpn.settings:edit',
    data: params,
  })
}

export const startReboot = (): Promise<ApiResponse<any>> => {
  return http.post('reboot')
}

export const rebootStatus = (): Promise<ApiResponse<any>> => {
  return http.get('getRebootStatus', undefined, { loading: false, toast: false })
}

export const startPing = (params): Promise<ApiResponse<any>> => {
  return http.post('startPing', createData(params))
}

export const pingStatus = (): Promise<ApiResponse<any>> => {
  return http.get('getPingStatus', undefined, { loading: false, toast: false })
}

export const getPingResults = (): Promise<ApiResponse<any>> => {
  return http.get('getPingResults')
}

export const startTraceroute = (params): Promise<ApiResponse<any>> => {
  return http.post('startTraceroute', createData(params))
}

export const tracerouteStatus = (): Promise<ApiResponse<any>> => {
  return http.get('getTracerouteStatus', undefined, { loading: false, toast: false })
}

export const getTracerouteResults = (): Promise<ApiResponse<any>> => {
  return http.get('getTracerouteResults')
}

export const startInformUpload = (params): Promise<ApiResponse<any>> => {
  return http.post('startInformUpload', createData(params))
}

export const informUploadStatus = (): Promise<ApiResponse<any>> => {
  return http.get('getInformUploadStatus', undefined, { loading: false, toast: false })
}

export const getInformUploadResults = (): Promise<ApiResponse<any>> => {
  return http.get('getInformUploadResults')
}

export const startReset = (): Promise<ApiResponse<any>> => {
  return http.post('reset')
}

export const resetStatus = (): Promise<ApiResponse<any>> => {
  return http.get('getResetStatus', undefined, { loading: false, toast: false })
}
export const backup = (): Promise<ApiResponse<any>> => {
  return http.get('getConfig', undefined)
}

export const setLog = (params): Promise<ApiResponse<any>> => {
  return http.post('setLogSettings', createData(params))
}

export const getLog = (): Promise<ApiResponse<any>> => {
  return http.get('getLogSettings')
}

export const getSyslog = (): Promise<ApiResponse<any>> => {
  return http.get('getSyslog')
}

export const getWanBinding = (): Promise<ApiResponse<any>> => {
  return http.post(api, {
    method: 'wan.binding:get',
  })
}

export const setWanBinding = (params): Promise<ApiResponse<any>> => {
  return http.post(api, {
    method: 'wan.binding:edit',
    data: params,
  })
}

export const getWlanDevices = (params?): Promise<ApiResponse<any>> => {
  return http.post('getWlanDevices', createData(params))
}

export const getSysTime = (): Promise<ApiResponse<any>> => {
  return http.get('getSysTime')
}

export const getTime = (): Promise<ApiResponse<any>> => {
  return http.get('getTime')
}

export const setTime = (params): Promise<ApiResponse<any>> => {
  return http.post('setTime', createData(params))
}

export const getDevInfo = (): Promise<ApiResponse<any>> => {
  return http.get('getDevinfo')
}

export const getPonInfo = (): Promise<ApiResponse<any>> => {
  return http.get('getPoninfo')
}

export const getStaInfo = (): Promise<ApiResponse<any>> => {
  return http.get('getStaInfo')
}

export const getVoipBasicSettings = (): Promise<ApiResponse<any>> => {
  return http.post(api, {
    method: 'voip.basic.settings:get',
  })
}

export const setVoipBasicSettings = (params): Promise<ApiResponse<any>> => {
  return http.post(api, {
    method: 'voip.basic.settings:edit',
    data: params,
  })
}

export const getVoipAdvancedSettings = (): Promise<ApiResponse<any>> => {
  return http.post(api, {
    method: 'voip.advanced.settings:get',
  })
}

export const setVoipAdvancedSettings = (params): Promise<ApiResponse<any>> => {
  return http.post(api, {
    method: 'voip.advanced.settings:edit',
    data: params,
  })
}

export const getLanInfo = (): Promise<ApiResponse<any>> => {
  return http.get('getLanInfo')
}

export const getWanInfo = (): Promise<ApiResponse<any>> => {
  return http.get('getWaninfo')
}

export const getUpnpConfig = (): Promise<ApiResponse<any>> => {
  return http.get('getUpnpConfig')
}

export const setUpnpConfig = (params): Promise<ApiResponse<any>> => {
  return http.post('setUpnpConfig', createData(params))
}

export const getUpnpList = (): Promise<ApiResponse<any>> => {
  return http.get('getUpnpList')
}

export const getSwmpSettings = (): Promise<ApiResponse<any>> => {
  return http.get('getSwmpSettings')
}

export const editSwmpSettings = (params): Promise<ApiResponse<any>> => {
  return http.post('editSwmpSettings', createData(params))
}

export const getSwmpStatus = (): Promise<ApiResponse<any>> => {
  return http.get('getSwmpStatus')
}

export const getLoginTimeout = (): Promise<ApiResponse<any>> => {
  return http.get('getLogintimeout', undefined, { loading: false, toast: false, cancel: false })
}

export const getWifiMlo = (): Promise<ApiResponse<any>> => {
  return http.get('wifi.mlo:get', undefined, { timeout: 90000 })
}

export const setWifiMlo = (params): Promise<ApiResponse<any>> => {
  return http.post('wifi.mlo:set', createData(params), { timeout: 90000 })
}
