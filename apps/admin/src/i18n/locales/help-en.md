# HELP DOCUMENT

## 1. Status

### 1.1 Device

- Device info: product name, device serial number, hardware version, software version.

### 1.2 WAN

- Shows WAN information:Connection status,ONU IP address, Subnet mask, Default gateway, DNS server message.

### 1.3 Optical

- Shows PON information:PON link status, link performance statistic, PON module information.

### 1.4 WLan

- Shows WLAN interface and connected STA information: WLAN interface information include SSID name,Channel,encryption;connected STA information include ip,mac,host name.

### 1.5 VoIP

- Shows service connected status and phone number; service information is registered status; phone number is registered phone number.

### 1.6 LAN

- Shows Ethernet interface information.From this page you can see the user-side Ethernet port information.

### 1.7 CWMP Status

- Shows connection status and the ACS Platform information.

### 1.8 DHCP Information

- Shows DHCPV4 and DHCPV6 released IP message.You can see the connected STA's information including the DUID,IP address,lease time.

### 1.9 USB

- Shows USB connetion status:connected or disconnected.

### 1.10 VPN

- Shows vpn information:vpn type, ip address, default gateway.

## 2. Network

### 2.1 WAN

#### （1）Configurations display

- WAN configurations information: include TR069 WAN (cwmp service), VOIP WAN, INTERNET WAN, IPTV WAN etc.

#### （2）Operating

- WAN: Setup WAN configurations and show the final settings on the interface.
  - Add new WAN connection: click "New Connection" to add a new WAN; click "Delete Connection" to delete WAN.
  - Alias Name: Name of WAN connections
  - Binding: Binding each LAN port, SSID to corresponding WAN port (interface).
  - Mode: include Route and Bridge mode. Route has three connection mode: DHCP (get IP from ISP), Static (get static ip from ISP) and PPPoE. Bridge mode can configure device to be a bridge between LAN and ISP.
  - IP protocol version: choose IP version, usually use IPv4, also can choose Ipv6 to support Ipv6, if choose IPv4/v6, WAN connection will support IPv4/v6 simultaneously.
  - PPPoE: ISP will provide account, fill as below: account, password. this mode can get IP via PPPoE from ISP.
  - DHCP: device will get IP from ISP through DHCP protocol.
  - Static: get static IP information from ISP. input info includes: IP address, subnet mask, main DNS service, backup DNS server... IP address must be a correct template: x.x.x.x, for ex: 192.168.0.100.
  - VLAN: Used to distinguish different services for ISP.
  - Style of Acquiring IPv6: getting IPv6 address via DHCP or SLAAC (dynamic method), also can set static IPv6 address according to real network status.
  - Other Supports: 802.1p/q 'NAT' IGMP Proxy etc.

### 2.2 WAN Bind

- WAN Binding to set LAN ports to WAN port binding rules, include port binding and VlAN binding two methods. For port binding, data will go out via correspond WAN port; for port + VLAN binding, data will go out via correspond WAN port with binding VLAN. Port add VLAN as m1/n1 VLAN pair and m1 is LAN side VLAN, n1 is WAN side VLAN, multiple VLAN pair is separate by ";".

### 2.3 LAN

- IP Address: IP address of device, user can access device GUI via this IP address.
- IPv4 configuration: Settings of ipv4 DHCP service. include server release time (1min, 1hour, 1day, 1week). the GUI also show the DHCP configurations of current.
- IPv6 configuration: Can configure RA to open LAN side address distribution service to let LAN device get IPv6 address via RA, also can configure to IPV6 DHCP server.

### 2.4 WLAN 2.4G

- Wireless Band: Support two band: 2.4G
- Enable Wireless: enable or disable WLAN 2.4G
- Mode (2.4G band): can choose 802.11b, 802.11g, 802.11n, 802.11ax, 802.11b/g/n mixed and 802.11b/g/n/ax mixed mode.
- Channel selection: select appropriate channel according to network list. To avoid signal interference, should separate AP to different channel, suggest use auto selection mode.
- SSID index: SSID serial number, using to choose different SSID.
- SSID: SSID name, can be any character, length can not over 32 characters, Upper/Lower case should be distinguished.
- Bandwith: choose Wireless network bandwith in 802.11n, 802.11ac or any other mixed mode.
- SSID enable: enable the current SSID which be choosed.
- SSID Hide: enable/disable SSID broadcast, if enabled device (ONU) won't broadcast SSID.
- Security: configure SSID with secure parameters, include OPEN, WPA-PSK, WPA2-PSK, WPA3-SAE,WPA-PSK/WPA2-PSK,WPA2-PSK/WPA3-SAE and correspond encryption.

### 2.5 WLAN 5G

- Wireless Band: Support two band: 5G
- Enable Wireless: enable or disable WLAN 5G
- Mode (5G band): can choose 802.a, 802.ax,802.11a/n mixed, 802.11ac/n mixed, 802.11ac/a/n mixed mode.
- Channel selection: select appropriate channel according to network list. To avoid signal interference, should separate AP to different channel, suggest use auto selection mode.
- SSID index: SSID serial number, using to choose different SSID.
- SSID: SSID name, can be any character, length can not over 32 characters, Upper/Lower case should be distinguished.
- Bandwith: choose Wireless network bandwith in 802.11n, 802.11ac or any other mixed mode.
- SSID enable: enable the current SSID which be choosed.
- SSID Hide: enable/disable SSID broadcast, if enabled device (ONU) won't broadcast SSID.
- Security: can configure SSID with secure parameters, include OPEN, WPA-PSK, WPA2-PSK, WPA-PSK/WPA2-PSK and correspond encryption.

### 2.6 Static Route

#### （1）Configurations display

- Static Route: Info of static route rules.

#### （2）Operating

- Static Route: Add or delete static route rules, include setup destination network address,subnet mask,gateway address and interface of the rule. at least one of 'gateway address' or 'interface' should be choosed.

### 2.7 Mesh

- Activate or not.
- Set Mesh Device work Role.
- Display current device Role.
- Enable or Disable band steering.
- Trigger easyMesh on-board.

### 2.8 Vpn

- From this page, you can view the vpn information and configure the vpn function.

## 3. Security

### 3.1 Firewall

#### （1）Configurations display

- Enable: firewall enabled or not.
- Firewall level:High,Middle,Low,User-defined,for "User-defined" mode,user can configure firewall by yourself,for other modes,firewall will be configured automaticly according the level.

#### （2）Operating

- Firewall Enable: security setup for device, ex: ping of death, syn flood etc, land attack.

### 3.2 MAC Filter

#### （1）Configurations display

- Show activate or not.
- Show current filter rules.

#### （2）Operating

- Setup
  - Enable: enable or disable MAC filter.
  - Filter mode: Blacklist and Whitelist. MAC address be configuated can't be accessed in black list mode, in white list mode be reversed.
  - MAC address: input correct MAC address to add a MAC address rule.

- Filter List: mac filter list which user configurated.
- Blacklist and Whitelist: will filter mac address while current is black list; will only accept mac address while current is white list. No matter black/white list, LAN pc can still access ONU.

### 3.3 Wi-Fi MAC Filtering

- You can configure MAC filter to prohibit STAS to accessing the WLAN network.

### 3.4 IPV4 Filter

#### （1）Configurations display

- Show activate or not.
- show current filter rules.

#### （2）Operating

- Setup
  - IPV4 Filter
  - Add: add one filter rule; Delete: delete one or more choosen rules.

- Filter list: port filter rule list which has been configuated.
- Filter rule: include "Filter name" and "Protocol", "Source IP StartAddress", "Source IP EndAddress", "Source Port", "Destination IP StartAddress", "Destination IP EndAddress", "Destination Port". can set those parameters as a rule to match data packages.

### 3.5 ACL

- A maximum of 8 ACL entries can be configured.
- On this page, you can configure network access control,include two directions: upstream and downstream.
- ACL application include HTTP,FTP,SSH,and PING mode.

### 3.6 DOS

- You can configure DoS parameters.

### 3.7 URL Filter

#### （1）Configurations display

- Show activate or not.
- Show current filter rules.

#### （2）Operating

- Setup
  - Enable: enable or disable WWW browse function, default is Disabled.
  - Filter mode: Blacklist and Whitelist. URLs be configuated can't be accessed in black list mode, in white list mode be reversed.
  - URL: input correct URL to add URL filter rule.

- Filter List: URL filter rules list.
- Blacklist and Whitelist: will filter URL list while current is black list; will only accept URL list while current is white list.

## 4. Application

### 4.1 DDNS

#### （1）Configurations display

- Show dynamic domain name rules.

#### （2）Operating

- Enable DDNS: can enable/disable DDNS function.
- DDNS configuration: add rules of DDNS, configure parameters and setup.

### 4.2 Port Mapping

#### （1）Port Mapping configurations display

- Show Mapping rules completed

#### （2）Operating

- Configure port mapping rules.

### 4.3 UPNP

#### （1）Configurations display

- Display UPnP Activate status.

#### （2）Operating

- Setup UPnP function via webpage, choose checkbox can enable UPnP service, Otherwise service will be disabled.

### 4.4 VoIP Setup

#### （1）Configurations display

- Basic VoIP configurations.
- Advanced VoIp configurations.

#### （2）Operating

- Modify SIP parameters: click "apply" to save setting.
- Outbound server address: if the address of Outbound Proxy Server provide by ISP is null or 0.0.0.0, the Proxy Server will be deactivate.
- Outbound server port number: if the UDP port of Outbound SIP Proxy Server is null or 0 will use default 5060.
- Backup Outbound server address: if the address of backup Outbound Proxy Server provide by ISP is null or 0.0.0.0, the backup Proxy Server will be deactivate.
- Backup Outbound server port number: if the UDP port of backup Outbound SIP Proxy Server is null or 0 will use default 5060
- Main server address: if the main SIP proxy server address provide by ISP is null or 0.0.0.0, main proxy server will be deactivate.
- Main port number: if the UDP port of SIP proxy server is setup to null or 0, will use default 5060
- Backup server address
- Backup Port number: backup SIP server UDP port. if setup to null or 0, will use default 5060.
- Local port: Local SIP UDP port number, default is 5060.
- DigiMap: indicate VoIP service dial program.
- Digimap mapping mode: including maximum/minimum mapping
- Country and region: indicate current VoIP service country and region.

### 4.5 DMZ

#### （1）Configurations display

- Enable or not
- DMZ status.

#### （2）Operating

- IGMP/MLD Snooping setting: use this operating to enable or disable the IGMP/MLD Snooping function. After the setting is completed, the IGMP/MLD Snooping setting state is displayed on the UI.
- IGMP/MLD Proxy enable setting: use this operating to enable or disable the IGMP/MLD Proxy function. After the setting is completed, the IGMP/MLD Proxy setting state is displayed on the UI.
- IGMP/MLD Proxy setting: use this operating to enable or disable the each WAN connects to IGMP/MLD Proxy function. After the setting is completed, the IGMP/MLD Proxy setting state is displayed on the UI.

### 4.6 Storage

#### （1）Configurations display

- Configure the FTP client for file downloading from to a storage device of the home gateway, and configure the FTP server for resource sharing. When configuring the FTP server, enable the LAN-side or WAN-side FTP function and select character code in UTF-8 format.
- Caution: Do not remove and re-insert the USB storage device in use, because this may damage files in it.

### 4.7 SAMBA

#### （1）Configurations display

- SAMBA Configurations: when USB device connected to OUN, LAN side device (ex: LAN PC) can shared files in USB device via samba.

#### （2）operating

- Setup SAMBA parameters: using the samba acount (Username/Password), LAN side device (ex: LAN PC) can shared files in USB device which connected to ONU.

### 4.8 Time

#### （1）Configurations display

- Activate or not.

#### （2）Operating

- SNTP
  - SNTP setup: default is Disabled. Enable SNTP and setup SNTP server configuration.
  - Server can be configuated by domain or IP address, if you want to choose other SNTP, please choose "Other" and input SNTP server domain name or IP address.
  - Timezone list can let you choose your time area.

### 4.9 CWMP

#### （1）Configurations display

- ITMS server configurations.
- OLT authentication register.

#### （2）Operating

- Setup URL or IP address of ITMS server, ITMS username and password, gateway username password. also can setup gateway send inform by period, and setup period. Authentication enable and disable.
- OLT authentication register.

### 4.10 Media Sharing

- In the media sharing service, you can share media information to devices that support DLNA. For example, you can share video, audio, and pictures to PCs, mobile devices, and consumption appliances. On this page, you can configure the sharing service switch and share directories.
- Caution: Do not remove and re-insert the USB storage device in use, because this may damage files in it.

### 4.11 Static DNS

- Setting Static DNS.

### 4.12 DHCP Static IP

- You can assign an IP address to a MAC address using the interface ID and IPv6 GUA address. The IPv6 GUA address is a combination of the interface ID and prefix configured on the LAN side.

### 4.13 DHCPv6 Static IP

- You can assign an IP address to a MAC address using the interface ID and IPv6 GUA address. The IPv6 GUA address is a combination of the interface ID and prefix configured on the LAN side.

## 5. Management

### 5.1 User Management

#### （1）Admin Account

- Password setup: modify password without original password for admin/user acount (current login account: admin).

#### （2）User Account

- Password setup: modify password without original password for user acount (current login account: admin or user).

### 5.2 Device Management

- Reboot device: restart your ONU.
- Configuration management: click "Export configuration file" can backup current configuration file to the PC. Also you can use this configuration file to restore the ONU configuration.
- Reset to Defaults: reset ONU to default setting.

### 5.3 Log Management

- Set Level: enable/disable writing log to logfile according the log level and display log level while log enabled.
- Log: shows current log content.

### 5.4 Upgrade

- You can use the firmware upgrade function to upgrade the software of the terminal to the target version.

### 5.5 ONT Authentication

- You can change ONT authentication parameters to ensure that it can be authenticated on the OLT.

### 5.6 Diagnose

- Internet Diagnose:
  - PING test: support IP address and domain ping test in choosed WAN connection.
  - Traceroute Test: support IP address and domain traceroute test in choosed WAN connection.

- Inform Upload: support Inform upload and shows correct Inform status for CWMP.

### 5.7 Device Access Control

- You can enable or disable permissions to access the device using Telnet or SSH.
